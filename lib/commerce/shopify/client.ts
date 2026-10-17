import "server-only";

/** Storefront API version; bump deliberately (Shopify supports each for a year). */
const API_VERSION = "2025-07";

export class ShopifyError extends Error {}

/** One Storefront GraphQL request. Credentials come from the environment (see SHOPIFY-SETUP.md). */
export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  if (!domain || !token)
    throw new ShopifyError("Shopify isn't configured (SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN).");

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new ShopifyError(`Shopify responded ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new ShopifyError(json.errors.map((e) => e.message).join("; "));
  return json.data as T;
}
