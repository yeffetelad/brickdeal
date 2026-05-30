export function withAffiliate(url: string): string {
  const tag = process.env.NEXT_PUBLIC_ALI_AFFILIATE_TAG;
  if (!tag) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}aff_id=${tag}`;
}
