import { Helmet } from "react-helmet-async";

const SITE_URL = "https://multiclout.com";

function SEO({
  title = "Multiclout",
  description = "Watch educational videos, premium courses and learning content on Multiclout.",
  keywords = "multiclout, online courses, educational videos, learning platform",
  image = `${SITE_URL}/multiclout-logo.png`,
  url = SITE_URL,
  type = "website",
  schema = null,
}) {
  const fullTitle = title.includes("Multiclout")
    ? title
    : `${title} | Multiclout`;

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;