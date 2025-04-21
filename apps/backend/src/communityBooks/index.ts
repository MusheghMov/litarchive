import { createRouter } from "../lib/create-app";
import communityBooks from "./books";
import communityChaptersRouter from "./chapters";

const router = createRouter();

const communityRoute = router
  .route("/books", communityBooks)
  .route("/chapters", communityChaptersRouter);

export default communityRoute;
