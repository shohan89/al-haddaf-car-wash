/**
 * SchemaMarkup — renders JSON-LD structured data in a <script> tag.
 * Use this in any page that has a schemaMarkup string from the DB.
 *
 * Usage:
 *   import { SchemaMarkup } from '@/components/shared/schema-markup'
 *   <SchemaMarkup json={service.schemaMarkup} />
 */
export function SchemaMarkup({ json }: { json?: string | null }) {
  if (!json) return null;
  let isValid = false;
  try {
    JSON.parse(json); // validate before rendering
    isValid = true;
  } catch {
    return null;
  }

  if (!isValid) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
