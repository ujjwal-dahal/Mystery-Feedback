import { NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams;

    const username = query.get("username");
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const parsed = UsernameQuerySchema.safeParse({ username });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const isUsernameUnique = username !== "takenUsername"; 
    return NextResponse.json({ isUsernameUnique });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
