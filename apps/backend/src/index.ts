import authorsApp from "./authors";
import articlesRoute from "./articles";
import booksRoute from "./books";
import community from "./community";
import userApp from "./user";
import ratingsRoute from "./ratings";
import listsRoute from "./lists";
import genresRouter from "./genres";
import { apiReference } from "@scalar/hono-api-reference";
import createApp from "./lib/create-app";
import { YDurableObjects, yRoute } from "y-durableobjects";
import { Env } from "./lib/create-app";
import { AudioGenerationWorkflow } from "@/workflows/audio-generation";

const app = createApp();

//this must be named route
export const route = app
  .route("/authors", authorsApp)
  .route("/articles", articlesRoute)
  .route("/books", booksRoute)
  .route("/user", userApp)
  .route("/ratings", ratingsRoute)
  .route("/lists", listsRoute)
  .route("/community", community)
  .route("/genres", genresRouter)
  .route(
    "/editor",
    //@ts-ignore
    yRoute<Env>((env) => env.Y_DURABLE_OBJECTS),
  );

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "LitArchive API",
  },
});
app.get(
  "/reference",
  apiReference({
    spec: {
      url: "/doc",
    },
  }),
);

export type AppTypes = typeof route;

export default app;
export { YDurableObjects, AudioGenerationWorkflow };
