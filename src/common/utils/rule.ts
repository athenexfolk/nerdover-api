export const slugRule = /^[a-z](?:[a-z0-9-]*[a-z])?$/;

export function isValidSlug(slug: string) {
  return slugRule.test(slug);
}
