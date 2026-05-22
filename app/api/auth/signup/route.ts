import { NextRequest } from "next/server";
import { handleSignup } from "@/lib/auth-routes";

export async function POST(request: NextRequest) {
  return handleSignup(request);
}
