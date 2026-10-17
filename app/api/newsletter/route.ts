import { NextResponse } from "next/server";

/**
 * The Zohraé Circle sign-up. Until a mailing list is connected (Shopify
 * customer marketing or Klaviyo, Phase 4), emails are not stored anywhere,
 * so this answers "soon" honestly instead of pretending to subscribe.
 * Once CIRCLE_WELCOME_CODE is set (and the code exists in Shopify), members
 * get their private code.
 */
export async function POST(request: Request) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }
  const code = process.env.CIRCLE_WELCOME_CODE;
  const connected = Boolean(process.env.CIRCLE_LIST_ENDPOINT);
  if (!connected || !code) return NextResponse.json({ status: "soon" }, { status: 202 });

  const res = await fetch(process.env.CIRCLE_LIST_ENDPOINT!, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, source: "zohrae-circle" }),
  }).catch(() => null);
  if (!res?.ok) return NextResponse.json({ status: "error" }, { status: 502 });
  return NextResponse.json({ status: "joined", code });
}
