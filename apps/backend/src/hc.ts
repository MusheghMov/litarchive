import { hc } from "hono/client";
import { AppTypes } from "./index";

const client = hc<AppTypes>("");
export type Client = typeof client;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppTypes>(...args);
