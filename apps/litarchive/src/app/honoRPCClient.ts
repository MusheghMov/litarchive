// import { hcWithType } from "@apps/backend/src/hc";
import { hcWithType } from "@apps/backend/dist/hc";

const honoClient = hcWithType(process.env.NEXT_PUBLIC_BACKEND_URL!);

export default honoClient;
