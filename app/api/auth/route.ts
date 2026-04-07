import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isPasswordExpired, generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  
  if (isPasswordExpired()) {
    return NextResponse.json(
      { error: "Password has expired. Update WIKI_PASSWORD_HASH and WIKI_PASSWORD_SET_DATE in Vercel env vars." },
      { status: 403 }
    );
  }
  
  const hash = process.env.WIKI_PASSWORD_HASH;
  if (!hash) {
    return NextResponse.json({ error: "No password configured" }, { status: 500 });
  }
  
  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  
  const token = generateToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set("d4tw_wiki_auth", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 day session
    path: "/",
  });
  
  return response;
}
