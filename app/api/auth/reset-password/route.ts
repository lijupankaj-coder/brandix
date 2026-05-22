import { NextRequest } from "next/server";
import { handleResetPassword } from "@/lib/auth-routes";

export async function POST(request: NextRequest) {
  return handleResetPassword(request);
}
