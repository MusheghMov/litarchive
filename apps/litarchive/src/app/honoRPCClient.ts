import { AppTypes } from "@apps/backend/src";
import { hc } from "hono/client";

const client = hc<AppTypes>(process.env.NEXT_PUBLIC_BACKEND_URL!);
type Client = typeof client;

const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppTypes>(...args);

const honoClient = hcWithType(process.env.NEXT_PUBLIC_BACKEND_URL!);

export default honoClient;
