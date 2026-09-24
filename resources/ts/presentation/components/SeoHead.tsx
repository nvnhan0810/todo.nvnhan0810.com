import { Head, usePage } from "@inertiajs/react";

type SharedSeoProps = {
  appUrl?: string;
  appName?: string;
  locale?: string;
};

export type SeoHeadProps = {
  title: string;
  description: string;
  /** Absolute path for canonical / og:url, e.g. "/" or "/login" */
  path?: string;
  /** Absolute URL or site-relative path; defaults to /images/og-image.png */
  image?: string;
  robots?: string;
  type?: "website" | "article";
  /** When false, title is used as-is (landing). Default appends app name. */
  appendSiteName?: boolean;
  /** Optional JSON-LD structured data object */
  jsonLd?: Record<string, unknown>;
};

const DEFAULT_OG_IMAGE = "/images/og-image.png";

const toAbsoluteUrl = (appUrl: string, pathOrUrl: string): string => {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  const base = appUrl.replace(/\/$/, "");
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
};

/**
 * SEO + Open Graph + Twitter Card tags via Inertia Head (SSR-friendly).
 */
export const SeoHead = ({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  robots = "index,follow",
  type = "website",
  appendSiteName = true,
  jsonLd,
}: SeoHeadProps): React.ReactElement => {
  const { appUrl = "", appName = "Todo", locale = "en" } =
    usePage().props as unknown as SharedSeoProps;

  const documentTitle =
    appendSiteName && !title.includes(appName) ? `${title} | ${appName}` : title;
  const canonical = toAbsoluteUrl(appUrl, path);
  const ogImage = toAbsoluteUrl(appUrl, image);
  const ogLocale = locale === "vi" ? "vi_VN" : "en_US";
  const alternateLocale = locale === "vi" ? "en_US" : "vi_VN";

  return (
    <Head title={documentTitle}>
      <meta head-key="description" name="description" content={description} />
      <meta head-key="robots" name="robots" content={robots} />
      <link head-key="canonical" rel="canonical" href={canonical} />

      <meta head-key="og:type" property="og:type" content={type} />
      <meta head-key="og:site_name" property="og:site_name" content={appName} />
      <meta head-key="og:locale" property="og:locale" content={ogLocale} />
      <meta
        head-key="og:locale:alternate"
        property="og:locale:alternate"
        content={alternateLocale}
      />
      <meta head-key="og:url" property="og:url" content={canonical} />
      <meta head-key="og:title" property="og:title" content={documentTitle} />
      <meta head-key="og:description" property="og:description" content={description} />
      <meta head-key="og:image" property="og:image" content={ogImage} />
      <meta head-key="og:image:width" property="og:image:width" content="1200" />
      <meta head-key="og:image:height" property="og:image:height" content="630" />
      <meta head-key="og:image:alt" property="og:image:alt" content={documentTitle} />

      <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta head-key="twitter:title" name="twitter:title" content={documentTitle} />
      <meta
        head-key="twitter:description"
        name="twitter:description"
        content={description}
      />
      <meta head-key="twitter:image" name="twitter:image" content={ogImage} />

      {jsonLd ? (
        <script
          head-key="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
    </Head>
  );
};
