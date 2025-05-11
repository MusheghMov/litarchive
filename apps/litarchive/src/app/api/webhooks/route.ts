import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import honoClient from "@/app/honoRPCClient";

export async function GET(req: Request) {
  return new Response("Hello World", { status: 200 });
}
export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log("Webhook event:", evt);
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", JSON.stringify(payload, null, 2));

  try {
    if (eventType === "user.created") {
      const createdUser = await honoClient.user["create"].$post({
        query: {
          sub: (payload as any)?.data.id,
          firstName: (payload as any)?.data.first_name,
          lastName: (payload as any)?.data.last_name,
          email: (payload as any)?.data.email_addresses[0].email_address,
          imageUrl: (payload as any)?.data.image_url,
        },
      });
      console.log("Created user:", createdUser);
    }
    if (eventType === "user.deleted") {
      const deletedUser = await honoClient.user.$delete(
        {
          query: {
            sub: (payload as any)?.data.id,
          },
        },
        {
          headers: {
            Authorization: (payload as any)?.data.id,
          },
        }
      );

      console.log("Deleted user:", deletedUser);
    }
    return new Response("", { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response("Error handling webhook", { status: 500 });
  }
}
