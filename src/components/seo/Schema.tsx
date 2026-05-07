import Script from 'next/script';

export default function Schema({ data }: { data: any }) {
  return (
    <Script
      id={`schema-${Math.random()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}