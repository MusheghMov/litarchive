import {
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from "cloudflare:workers";
import { connectToDB, eq } from "@repo/db";
import { userBookChapters } from "@repo/db/schema";
import { Bindings } from "@/lib/create-app";

export interface AudioGenerationParams {
  chapterId: number;
  content: string;
  language: string;
  databaseUrl: string;
  databaseAuthToken: string;
  imageStorageUrl: string;
}

export class AudioGenerationWorkflow extends WorkflowEntrypoint<
  Bindings,
  AudioGenerationParams
> {
  async run(event: WorkflowEvent<AudioGenerationParams>, step: WorkflowStep) {
    const {
      chapterId,
      content,
      language,
      databaseUrl,
      databaseAuthToken,
      imageStorageUrl,
    } = event.payload;

    // Step 1: Update chapter status to generating
    await step.do("update-status-generating", async () => {
      console.log("1. update-status-generating");
      const db = connectToDB({
        url: databaseUrl,
        authoToken: databaseAuthToken,
      });

      await db
        .update(userBookChapters)
        .set({
          audioStatus: "generating",
        })
        .where(eq(userBookChapters.id, chapterId));

      console.log(`Chapter ${chapterId}: Status updated to generating`);
    });

    // Step 1.1: Restructure content
    const restructuredContent = await step.do(
      "restructure-content",
      async () => {
        console.log("1.1. restructure-content");
        const messages = [
          {
            role: "system",
            content:
              "You are a helpful assistant who will receive a book chapter as an html string, remove html tags, recognize the text structure of the chapter and restructure the text without changing its content. Your output will be use as an input for the text to speech ai model to generate audio version of the chapter. Importantly just return the chapter content without adding any description from you",
          },
          {
            role: "user",
            content: content,
          },
        ];
        const response = await this.env.AI.run(
          "@cf/meta/llama-3.2-3b-instruct",
          { messages, max_tokens: 10000, temperature: 0 },
        );
        console.log("1.1. restructure-content", response);

        return response.response;
      },
    );

    // Step 2: Generate audio using MeloTTS
    const audioUrl = await step.do("generate-audio", async () => {
      console.log("2. generate-audio");

      const audioResponse = await this.env.AI.run("@cf/myshell-ai/melotts", {
        prompt: restructuredContent || content,
        lang: language || "en",
      });

      if (audioResponse instanceof Uint8Array) {
        throw new Error("Unexpected audio response format");
      }

      const { audio } = audioResponse;
      if (!audio) {
        throw new Error("No audio data received from AI model");
      }

      console.log(`Chapter ${chapterId}: Audio generation completed`);

      console.log(`Chapter ${chapterId}: Processing and uploading audio`);

      // Convert base64 audio to ArrayBuffer
      const audioBuffer = Uint8Array.from(atob(audio), (c) => c.charCodeAt(0));

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `audio/chapters/${chapterId}/chapter-${timestamp}.mp3`;

      // Upload to R2
      await this.env.litarchive.put(fileName, audioBuffer);

      // Generate public URL for the audio file
      const publicUrl = `${imageStorageUrl}/${fileName}`;

      console.log(`Chapter ${chapterId}: Audio uploaded to ${publicUrl}`);
      return publicUrl;
    });

    // Step 3: Update chapter with final audio URL and completion status
    await step.do("update-status-completed", async () => {
      console.log("3. update-status-completed");
      const db = connectToDB({
        url: databaseUrl,
        authoToken: databaseAuthToken,
      });

      await db
        .update(userBookChapters)
        .set({
          audioUrl: audioUrl,
          audioGeneratedAt: new Date().toISOString(),
          audioStatus: "completed",
        })
        .where(eq(userBookChapters.id, chapterId));

      console.log(
        `Chapter ${chapterId}: Audio generation workflow completed successfully`,
      );
    });

    return {
      success: true,
      audioUrl: audioUrl,
      chapterId: chapterId,
    };
  }

  // Handle workflow failures
  async onFailure(event: WorkflowEvent<AudioGenerationParams>, error: Error) {
    const { chapterId, databaseUrl, databaseAuthToken } = event.payload;

    console.error(
      `Chapter ${chapterId}: Audio generation workflow failed:`,
      error,
    );

    // Update chapter status to failed
    try {
      const db = connectToDB({
        url: databaseUrl,
        authoToken: databaseAuthToken,
      });

      await db
        .update(userBookChapters)
        .set({
          audioStatus: "failed",
        })
        .where(eq(userBookChapters.id, chapterId));
    } catch (dbError) {
      console.error(
        `Chapter ${chapterId}: Failed to update status to failed:`,
        dbError,
      );
    }
  }
}
