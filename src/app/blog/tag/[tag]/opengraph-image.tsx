// Link-preview image for each topic page, e.g. /blog/tag/rag/opengraph-image.
// Same design as the post images (components/og/series-card.tsx), with
// "Topic" and the post count in the header and the description below.

import { SeriesCard } from "@/components/og/series-card";
import { getTopics } from "@/data/blog";
import { DATA } from "@/data/resume";
import { OG_SIZE, ogFonts } from "@/lib/og";
import { ImageResponse } from "next/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Blog topic preview";
export const dynamicParams = false;

export function generateStaticParams() {
  return getTopics().map((t) => ({ tag: t.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const topic = getTopics().find((t) => t.slug === tag);
  if (!topic) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    (
      <SeriesCard
        title={topic.label}
        kicker="Topic"
        badge={`${topic.count} ${topic.count === 1 ? "post" : "posts"}`}
        summary={topic.description}
        site={`${DATA.url.replace(/^https?:\/\//, "")}/blog`}
        meta={["AI Engineering, Explained"]}
      />
    ),
    { ...OG_SIZE, fonts: ogFonts() },
  );
}
