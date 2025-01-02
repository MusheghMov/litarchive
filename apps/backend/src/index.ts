import { Hono } from "hono";
import authorsApp from "./authors";
import articlesApp from "./articles";
import booksApp from "./books";
import userApp from "./user";
import { cors } from "hono/cors";
export const app = new Hono();

//this must be named route
export const route = app
  .use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["POST", "GET", "OPTIONS"],
    }),
  )
  .route("/authors", authorsApp)
  .route("/articles", articlesApp)
  .route("/books", booksApp)
  .route("/user", userApp);

export type AppTypes = typeof route;

export default app;
