import {
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from "cloudflare:workers";
import { connectToDB, eq } from "@repo/db";
import { userBooks } from "@repo/db/schema";
import { Bindings } from "../lib/create-app";
import { nanoid } from "nanoid";

export interface ImageGenerationParams {
  bookId: number;
  title: string;
  author: string;
  description: string;
  databaseUrl: string;
  databaseAuthToken: string;
  imageStorageUrl: string;
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
    } = event.payload;

    // Step 1: Update book status to generating
    await step.do("update-status-generating", async () => {
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
    });

    // Step 2: Generate cover image using Flux 1.0 (schnell)
    const imageUrl = await step.do("generate-image", async () => {
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

      const result = await this.env.AI.run(
        "@cf/black-forest-labs/flux-1-schnell",
        {
          prompt: prompt,
        },
      );

      if (result.image) {
        const key = `covers/${nanoid()}.png`;
        // Convert from base64 string
        const binaryString = atob(result.image);
        // Create byte representation
        const img = Uint8Array.from(binaryString, (m) => m.codePointAt(0)!);
        await this.env.litarchive.put(key, img);

        const publicUrl = `${imageStorageUrl}/${key}`;

        return publicUrl;
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

    console.error(`Book ${bookId}: Image generation workflow failed:`, error);

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

