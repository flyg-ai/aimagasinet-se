/** Renders a JSON-LD block. Accepts one schema or an array. Strips
 *  undefined keys so the output is compact. */
export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const json = JSON.stringify(data, (_k, v) => (v === undefined ? undefined : v));
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
