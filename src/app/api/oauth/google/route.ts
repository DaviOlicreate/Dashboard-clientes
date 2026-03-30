/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: Request) {
  // Previne crashing caso o usuário clique e não tenha inserido a chave no `.env` ainda
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "A integração Google Ads não foi configurada! Cheque o seu arquivo .env.local" },
      { status: 500 }
    );
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/google/callback` // Endpoint que construímos na Fase 4
    );

    // Definimos exatamente O QUE podemos ler do usuário (Acesso ao escopo puro do Google Ads)
    const scopes = [
      'https://www.googleapis.com/auth/adwords'
    ];

    // O workspace_id é mockado por ora. Em V2 oficial, pegamos a Session ID do supabase (quem clicou no botão)
    const stateWorkspaceId = "00000000-0000-0000-0000-000000000000";

    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Pede o refresh-token essencial pra crons!
      scope: scopes,
      prompt: 'consent', // Força o consentimento para garantir o recebimento do refresh-token na primeira vez
      state: stateWorkspaceId // Passado como passaporte escondido
    });

    // Encaminha o usuário que clicou para o servidor de login do Google
    return NextResponse.redirect(authorizationUrl);
    
  } catch (error) {
    console.error("Erro na geração de Link do Google:", error);
    return NextResponse.json({ error: "Erro interno ao gerar fluxo" }, { status: 500 });
  }
}
