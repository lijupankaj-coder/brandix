import { NextRequest } from "next/server";
import { handleLogin } from "@/lib/auth-routes";

export async function POST(request: NextRequest) {
  return handleLogin(request);
}
