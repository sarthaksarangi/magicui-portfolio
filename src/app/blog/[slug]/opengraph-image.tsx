// Link-preview image for each blog post, e.g. /blog/rag-fundamentals/opengraph-image
//
// Next.js treats a file named opengraph-image.tsx as an image route for
// this segment: it calls the default export, which returns an
// ImageResponse (a PNG), and adds <meta property="og:image"> pointing at it
// to the post's <head>. generateStaticParams makes Next.js render one PNG
// per post at build time, so nothing is generated when someone shares a link.

import { SeriesCard, type SeriesSection } from "@/components/og/series-card";
import { getPostsMeta, getSeriesPosts } from "@/data/blog";
import { DATA } from "@/data/resume";
import { OG_SIZE, ogFonts } from "@/lib/og";
import { ImageResponse } from "next/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Blog post preview";
export const dynamicParams = false;

export function generateStaticParams() {
  return getPostsMeta().map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostsMeta().find((p) => p.slug === slug);
  if (!post) return new Response("Not found", { status: 404 });
  const m = post.metadata;

  // Series posts: build the section groups for the progress bar.
  let sections: SeriesSection[] | undefined;
  let totalParts: number | undefined;
  if (m.series) {
    const parts = getSeriesPosts(m.series).filter(
      (p) => (p.metadata.seriesOrder ?? 0) > 0,
    );
    totalParts = parts.length;
    sections = [];
    for (const p of parts) {
      const name = p.metadata.section ?? "";
      const last = sections[sections.length - 1];
      if (last?.name === name) last.parts.push(p.metadata.seriesOrder!);
      else sections.push({ name, parts: [p.metadata.seriesOrder!] });
    }
  }

  return new ImageResponse(
    (
      <SeriesCard
        title={m.title}
        site={`${DATA.url.replace(/^https?:\/\//, "")}/blog`}
        meta={[
          m.section,
          // Skip the level when it repeats the section ("Advanced · Advanced").
          m.level !== m.section ? m.level : undefined,
          `${post.readingMinutes} min read`,
        ].filter((x): x is string => Boolean(x))}
        series={m.series}
        part={m.seriesOrder}
        totalParts={totalParts}
        sections={sections}
        summary={m.series ? undefined : m.summary}
      />
    ),
    { ...OG_SIZE, fonts: ogFonts() },
  );
}
