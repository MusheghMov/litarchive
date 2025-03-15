import authorsApp from "./authors";
import articlesRoute from "./articles";
import booksRoute from "./books";
import userApp from "./user";
import ratingsRoute from "./ratings";
import { apiReference } from "@scalar/hono-api-reference";
import createApp from "./lib/create-app";

const app = createApp();

//this must be named route
export const route = app
  .route("/authors", authorsApp)
  .route("/articles", articlesRoute)
  .route("/books", booksRoute)
  .route("/user", userApp)
  .route("/ratings", ratingsRoute);

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
