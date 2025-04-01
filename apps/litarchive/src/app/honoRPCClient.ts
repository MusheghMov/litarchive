import { hcWithType } from "@apps/backend/src/hc";

const honoClient = hcWithType(process.env.NEXT_PUBLIC_BACKEND_URL!);

export default honoClient;
