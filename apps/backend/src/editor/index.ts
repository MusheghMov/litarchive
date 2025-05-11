import { createRouter } from "../lib/create-app";
import { type YDurableObjectsAppType } from "y-durableobjects";
import { upgrade } from "y-durableobjects/helpers/upgrade";
import { hc } from "hono/client";

const router = createRouter();

const editorRoute = router.get("/:id", upgrade(), async (c) => {
  try {
    const id = c.env.Y_DURABLE_OBJECTS.idFromName("example");
    const stub = c.env.Y_DURABLE_OBJECTS.get(id);

    const url = new URL("/", c.req.url);

    const client = hc<YDurableObjectsAppType>(url.toString(), {
      fetch: stub.fetch.bind(stub),
    });

    const res = await client.rooms[":roomId"].$get(
      { param: { roomId: c.req.param("id") } },
      { init: { headers: c.req.raw.headers } },
    );

    if (res.ok) {
      const asd = new Response(null, {
        webSocket: res.webSocket,
        status: res.status,
        statusText: res.statusText,
      });
      return asd;
    }
  } catch (error) {
    console.log("Error in editor route: ", error);
  }
});

export default editorRoute;
