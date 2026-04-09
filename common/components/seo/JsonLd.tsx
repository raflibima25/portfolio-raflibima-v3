interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Injects a JSON-LD structured data script tag into the document head.
 * Use this in Server Components (page.tsx or layout.tsx).
 *
 * @see https://schema.org
 * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */
const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;
