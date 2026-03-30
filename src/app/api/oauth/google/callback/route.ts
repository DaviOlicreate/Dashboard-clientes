/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { db } from "@/lib/db";
import { connections, workspaces } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const workspaceId = url.searchParams.get("state") || "00000000-0000-0000-0000-000000000000"; 

  if (!code) {
    return NextResponse.json({ error: "Code missing" }, { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/google/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);

    // [CORREÇÃO]: Garante que o Workspace MOCK exista antes de espetar a Conexão
    const existing = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
    if (existing.length === 0) {
      await db.insert(workspaces).values({ id: workspaceId, name: "Workspace B2B MVP" });
    }

    // Salvar Credenciais reais
    await db.insert(connections).values({
      workspaceId: workspaceId,
      provider: "GOOGLE",
      externalAccountId: "UNKNOWN_YET", 
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });

    return NextResponse.redirect(`${url.origin}/settings?success=google_connected`);
  } catch (error: any) {
    console.error("Erro Google OAuth:", error);
    return NextResponse.redirect(`${url.origin}/settings?error=google_failed`);
  }
}
