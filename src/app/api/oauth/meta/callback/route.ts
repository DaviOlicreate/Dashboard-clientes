import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connections } from "@/lib/db/schema";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const workspaceId = url.searchParams.get("state") || "00000000-0000-0000-0000-000000000000";

  if (!code) {
    return NextResponse.json({ error: "Code missing" }, { status: 400 });
  }

  try {
    // 1. Troca code por Short Lived Token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.META_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/meta/callback&client_secret=${process.env.META_CLIENT_SECRET}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();
    
    if (tokenData.error) throw new Error(tokenData.error.message);

    // 2. Troca O Short pelo Long Lived Token (dura 2 meses e re-renova automaticamente nos requests)
    const longUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_CLIENT_ID}&client_secret=${process.env.META_CLIENT_SECRET}&fb_exchange_token=${tokenData.access_token}`;
    const longRes = await fetch(longUrl);
    const longData = await longRes.json();

    if (longData.error) throw new Error(longData.error.message);

    await db.insert(connections).values({
      workspaceId: workspaceId,
      provider: "META",
      externalAccountId: "UNKNOWN_YET", // Capturado depois via GET /me/adaccounts
      accessToken: longData.access_token,
      // Meta não usa Refresh Token para page/ad access na v19 da mesma forma, o Long lived renova ativamente.
    });

    return NextResponse.redirect(`${url.origin}/settings?success=meta_connected`);
  } catch (error: any) {
    console.error("Erro Meta OAuth:", error);
    return NextResponse.redirect(`${url.origin}/settings?error=meta_failed`);
  }
}
