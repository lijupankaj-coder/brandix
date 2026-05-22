import { NextRequest } from "next/server";
import { handleForgotPassword } from "@/lib/auth-routes";

export async function POST(request: NextRequest) {
  return handleForgotPassword(request);
}
