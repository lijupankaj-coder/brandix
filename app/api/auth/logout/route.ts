import { NextRequest } from "next/server";
import { handleLogout } from "@/lib/auth-routes";

export async function POST(request: NextRequest) {
  return handleLogout(request);
}
