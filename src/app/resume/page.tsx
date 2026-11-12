import { PrintButton } from "@/components/print-button";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import Markdown from "react-markdown";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${DATA.name}, ${DATA.title}.`,
};

const strip = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 print:mt-1.5">
      <h2 className="border-b pb-0.5 text-sm font-bold uppercase tracking-wider print:text-[9.5pt]">
        {title}
      </h2>
      <div className="mt-2 print:mt-1">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground print:space-y-0.5 print:pl-4">
      {items.map((item) => (
        <li key={item}>
          <Markdown
            components={{
              p: ({ children }) => <>{children}</>,
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),
            }}
          >
            {item}
          </Markdown>
        </li>
      ))}
    </ul>
  );
}

export default function ResumePage() {
  const { social } = DATA.contact;
  const contacts = [
    { label: DATA.contact.email, href: social.email.url },
    { label: strip(social.LinkedIn.url), href: social.LinkedIn.url },
    { label: strip(social.GitHub.url), href: social.GitHub.url },
    { label: strip(DATA.url), href: DATA.url },
  ];
  const projects = DATA.projects.filter((p) => p.bullets.length > 0);

  return (
    <main className="text-sm leading-snug print:text-[8.5pt] print:leading-[1.25]">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight print:text-[18pt]">
            {DATA.name}
          </h1>
          <p className="mt-0.5 text-base font-medium print:text-[10pt]">
            {DATA.title} · {DATA.location}
          </p>
        </div>
        <PrintButton />
      </header>
      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground print:mt-1">
        {contacts.map((c) => (
          <a
            key={c.href}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {c.label}
          </a>
        ))}
      </p>

      <Section title="Summary">
        <p className="text-muted-foreground">{DATA.resumeSummary}</p>
      </Section>

      <Section title="Experience">
        <div className="space-y-3 print:space-y-1">
          {DATA.work.map((job) => (
            <div key={`${job.company}-${job.start}`} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold">
                  {job.title} · {job.company}
                </h3>
                <span className="flex-none tabular-nums text-muted-foreground">
                  {job.start} – {job.end}
                </span>
              </div>
              <Bullets items={job.bullets} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Projects">
        <div className="space-y-3 print:space-y-1">
          {projects.map((project) => (
            <div key={project.title} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <h3>
                  <span className="font-semibold">{project.title}</span>
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-muted-foreground underline underline-offset-2 hover:text-foreground"
                    >
                      {link.type === "Website" ? "Live" : "Code"}
                    </a>
                  ))}
                  <span className="ml-2 italic text-muted-foreground">
                    {project.technologies.slice(0, 6).join(", ")}
                  </span>
                </h3>
                <span className="flex-none tabular-nums text-muted-foreground">
                  {project.dates}
                </span>
              </div>
              <Bullets items={project.bullets as readonly string[]} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skills">
        <dl className="space-y-1 print:space-y-0">
          {DATA.skills.map((group) => (
            <div key={group.category} className="flex gap-2">
              <dt className="w-40 flex-none font-semibold print:w-[34mm]">
                {group.category}
              </dt>
              <dd className="text-muted-foreground">
                {group.items.join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Education">
        {DATA.education.map((edu) => (
          <div
            key={edu.school}
            className="flex items-baseline justify-between gap-3"
          >
            <div>
              <h3 className="font-semibold">{edu.school}</h3>
              <p className="text-muted-foreground">{edu.degree}</p>
            </div>
            <span className="flex-none tabular-nums text-muted-foreground">
              {edu.start} – {edu.end}
            </span>
          </div>
        ))}
      </Section>

      <Section title="Achievements & Certifications">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">
            Problem solving:{" "}
          </span>
          {DATA.achievements.map((item, i) => (
            <span key={item.title}>
              {i > 0 && " · "}
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {item.title}
              </a>
              {item.detail && ` (${item.detail})`}
            </span>
          ))}
        </p>
        <p className="mt-1 text-muted-foreground print:mt-0">
          <span className="font-semibold text-foreground">
            Certifications:{" "}
          </span>
          {DATA.certifications
            .map((cert) =>
              cert.issuer ? `${cert.title} (${cert.issuer})` : cert.title
            )
            .join(" · ")}
        </p>
      </Section>
    </main>
  );
}
