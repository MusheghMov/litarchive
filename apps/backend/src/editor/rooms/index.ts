import { createRouter } from "../../lib/create-app";
import { fromUint8Array } from "js-base64";

const router = createRouter();

const roomsRoute = router
  .get("/:id/state", async (c) => {
    const roomId = c.req.param("id");
    const id = c.env.Y_DURABLE_OBJECTS.idFromName(roomId);
    const stub = c.env.Y_DURABLE_OBJECTS.get(id);

    const doc = await stub.getYDoc();
    //@ts-ignore
    const base64 = fromUint8Array(doc);

    return c.json({ doc: base64 }, 200);
  })
  .post("/:id/update", async (c) => {
    const roomId = c.req.param("id");
    const id = c.env.Y_DURABLE_OBJECTS.idFromName(roomId);
    const stub = c.env.Y_DURABLE_OBJECTS.get(id);

    const buffer = await c.req.arrayBuffer();
    const update = new Uint8Array(buffer);

    await stub.updateYDoc(update);

    return c.json(null, 200);
  });

export default roomsRoute;
