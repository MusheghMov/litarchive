import {
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from "cloudflare:workers";
import { connectToDB, eq } from "@repo/db";
import { userBooks } from "@repo/db/schema";
import { Bindings } from "../lib/create-app";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { nanoid } from "nanoid";

export interface ImageGenerationParams {
  bookId: number;
  title: string;
  author: string;
  description: string;
  databaseUrl: string;
  databaseAuthToken: string;
  imageStorageUrl: string;
  geminiApiKey: string;
}

export class ImageGenerationWorkflow extends WorkflowEntrypoint<
  Bindings,
  ImageGenerationParams
> {
  async run(event: WorkflowEvent<ImageGenerationParams>, step: WorkflowStep) {
    const {
      bookId,
      title,
      author,
      description,
      databaseUrl,
      databaseAuthToken,
      imageStorageUrl,
      geminiApiKey,
    } = event.payload;

    // Step 1: Update book status to generating
    await step.do("update-status-generating", async () => {
      console.log("1. update-status-generating");
      const db = connectToDB({
        url: databaseUrl,
        authoToken: databaseAuthToken,
      });

      await db
        .update(userBooks)
        .set({
          imageStatus: "generating",
        })
        .where(eq(userBooks.id, bookId));

      console.log(`Book ${bookId}: Status updated to generating`);
    });

    // Step 2: Generate cover image using Gemini 2.0
    const imageUrl = await step.do("generate-image", async () => {
      console.log("2. generate-image");

      const bookData = {
        title: title,
        author: author,
        synopsis: description,
        genre: "General Fiction",
        targetAudience: "General Adult",
        mood: "Engaging",
        setting: "Contemporary",
        artStyle: "Modern digital art",
        colorScheme: "Vibrant and appealing",
        typographyStyle: "Modern serif",
        mainSubject: "Abstract or symbolic representation",
        background: "Clean and professional",
        symbolicElements: "Relevant to the story theme",
      };

      const prompt = generateBookCoverPrompt(bookData);

      const google = createGoogleGenerativeAI({
        apiKey: geminiApiKey,
      });

      const result = await generateText({
        model: google("gemini-2.0-flash-exp"),
        providerOptions: {
          google: {
            responseModalities: ["TEXT", "IMAGE"],
            aspectRatio: "1:1",
          },
        },
        prompt: prompt,
      });

      console.log(`Book ${bookId}: Image generation completed`);

      // Process generated image files
      for (const file of result.files) {
        if (file.mimeType.startsWith("image/")) {
          const base64Data = file.base64;
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const fileExtension = "png";
          const key = `covers/${nanoid()}.${fileExtension}`;
          
          console.log(`Book ${bookId}: Uploading image to R2`);
          await this.env.litarchive.put(key, bytes);

          const publicUrl = `${imageStorageUrl}/${key}`;
          console.log(`Book ${bookId}: Image uploaded to ${publicUrl}`);
          
          return publicUrl;
        }
      }

      throw new Error("No image file generated");
    });

    // Step 3: Update book with final image URL and completion status
    await step.do("update-status-completed", async () => {
      console.log("3. update-status-completed");
      const db = connectToDB({
        url: databaseUrl,
        authoToken: databaseAuthToken,
      });

      await db
        .update(userBooks)
        .set({
          coverImageUrl: imageUrl,
          imageGeneratedAt: new Date().toISOString(),
          imageStatus: "completed",
        })
        .where(eq(userBooks.id, bookId));

      console.log(
        `Book ${bookId}: Image generation workflow completed successfully`,
      );
    });

    return {
      success: true,
      imageUrl: imageUrl,
      bookId: bookId,
    };
  }

  // Handle workflow failures
  async onFailure(event: WorkflowEvent<ImageGenerationParams>, error: Error) {
    const { bookId, databaseUrl, databaseAuthToken } = event.payload;

    console.error(
      `Book ${bookId}: Image generation workflow failed:`,
      error,
    );

    // Update book status to failed
    try {
      const db = connectToDB({
        url: databaseUrl,
        authoToken: databaseAuthToken,
      });

      await db
        .update(userBooks)
        .set({
          imageStatus: "failed",
        })
        .where(eq(userBooks.id, bookId));
    } catch (dbError) {
      console.error(
        `Book ${bookId}: Failed to update status to failed:`,
        dbError,
      );
    }
  }
}

function generateBookCoverPrompt(bookData: any) {
  const {
    title,
    author,
    synopsis,
    genre,
    targetAudience,
    mood,
    setting,
    artStyle,
    colorScheme,
    typographyStyle,
    mainSubject,
    background,
    symbolicElements,
    aspectRatio = "1:1",
    textPlacement = "title at top and author name at bottom",
    additionalRequirements = "image should be a high quality 1024x1024 image",
  } = bookData;

  return `Generate a high quality 1024x1024 book cover image for "${title}" by ${author}.

**Book Details:**
- Genre: ${genre}
- Synopsis: ${synopsis}
- Target Audience: ${targetAudience}
- Mood/Tone: ${mood}
- Setting: ${setting}

**Visual Style:**
- Art Style: ${artStyle}
- Color Scheme: ${colorScheme}
- Typography Style: ${typographyStyle}

**Key Visual Elements:**
- Main Subject: ${mainSubject}
- Background: ${background}
- Symbolic Elements: ${symbolicElements}

**Technical Specifications:**
- Aspect Ratio: ${aspectRatio} for standard book cover
- Image Quality: High resolution, professional publishing quality
- Text Placement: Leave space for ${textPlacement}

${additionalRequirements ? `**Specific Instructions:**\n${additionalRequirements}\n` : ""}
Create an eye-catching, marketable book cover that would attract readers browsing an online bookstore.`;
}