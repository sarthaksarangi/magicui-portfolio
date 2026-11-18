import { Icons } from "@/components/icons";
import { FileTextIcon, HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Sarthak Sarangi",
  initials: "SS",
  url: "https://sarthaksarangi.com",
  location: "Gurugram, India",
  locationLink: "https://www.google.com/maps/place/Gurugram",
  title: "Full-Stack AI Engineer",
  description:
    "Full-Stack AI Engineer. I build RAG systems, LLM agents, and the products around them, with Python and Next.js.",
  summary: [
    "I build Generative AI products end to end: the RAG pipeline or agent in Python, the API behind it, and the interface people actually use.",
    "**What I build.** RAG systems that answer from your own documents with citations, LLM agents and automated workflows, and full-stack apps in Next.js and TypeScript. Recent work includes [DocSage](https://github.com/sarthaksarangi/docsage), a RAG assistant for technical PDFs built on LangChain and pgvector, and [TickrFlow](https://tickrflow.sarthaksarangi.com/), which runs a scheduled LLM pipeline to email personalized market summaries.",
    "**Production experience.** I'm a Software Engineer at [Exotel](https://exotel.com), where I've built LLM-powered automation with FastAPI and Pydantic, including a platform that turns report customization requests into explained, ready-to-apply changes. Before that I was at [Ericsson](https://www.ericsson.com), where I built Java Spring Boot services that synced 10,000+ enterprise product updates a day, automated 30+ hours of manual work a week, and cut bulk upload times from 45s to 15s.",
    "**Writing.** [AI Engineering, Explained](/blog/ai-engineering-explained) is a 23-part series on building with LLMs, from how models work and prompting to RAG, agents, MCP, evals and running AI apps in production.",
    "**Get in touch.** If you're building with LLMs, whether a RAG system, an agent, or an AI feature, I'd like to hear about it. [Email me](mailto:sarthaksarangi.dev@gmail.com).",
  ].join("\n\n"),

  resumeSummary:
    "Full-Stack AI Engineer building LLM-powered automation and applications with Python and FastAPI. Software Engineer at Exotel, previously at Ericsson; experienced in RAG pipelines, LLM workflows, Spring Boot services, and Next.js front ends.",

  avatarUrl: "/me.webp",

  highlights: [
    "Builds Generative AI apps in Python with LangChain, RAG, and vector databases",
    "Ships full-stack products end to end with Next.js and TypeScript",
    "Software Engineer at Exotel building AI automation with FastAPI; previously at Ericsson",
    "Comfortable owning features from design to production",
  ],

  skills: [
    {
      category: "LLMs & Agents",
      items: [
        "LLMs",
        "Prompt Engineering",
        "Tool Calling",
        "Agentic AI",
        "LangChain",
        "LangGraph",
        "MCP",
        "Hugging Face",
        "Fine-tuning",
      ],
    },
    {
      category: "RAG & Retrieval",
      items: [
        "RAG",
        "Embeddings",
        "Vector Databases",
        "Semantic Search",
        "Hybrid Search",
        "Reranking",
        "pgvector",
        "Qdrant",
      ],
    },
    {
      category: "Evals & Observability",
      items: [
        "LLM Evaluation",
        "RAGAS",
        "LangSmith",
        "Tracing",
        "pytest",
      ],
    },
    {
      category: "Python",
      items: [
        "Python",
        "FastAPI",
        "Pydantic",
        "asyncio",
        "SQLAlchemy",
        "SQLModel",
        "Streamlit",
        "pandas",
        "NumPy",
      ],
    },
    {
      category: "Backend",
      items: [
        "Java",
        "Spring Boot",
        "Spring Data JPA",
        "Hibernate",
        "Node.js",
        "Express.js",
        "REST APIs",
        "Microservices",
      ],
    },
    {
      category: "Frontend",
      items: [
        "TypeScript",
        "JavaScript",
        "React",
        "Next.js",
        "Tailwind CSS",
      ],
    },
    {
      category: "Data",
      items: [
        "SQL",
        "PostgreSQL",
        "Oracle SQL",
        "MongoDB",
        "Redis",
      ],
    },
    {
      category: "Cloud & DevOps",
      items: [
        "AWS",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "GitHub Actions",
        "Git",
        "Linux",
      ],
    },
  ],

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
    { href: "/resume", icon: FileTextIcon, label: "Resume" },
  ],

  contact: {
    email: "sarthaksarangi.dev@gmail.com",
    tel: "+91 7008664609",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/sarthaksarangi",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/sarthaksarangi",
        icon: Icons.linkedin,
        navbar: true,
      },
      LeetCode: {
        name: "LeetCode",
        url: "https://leetcode.com/u/sarthaksarangi/",
        icon: Icons.leetcode,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:sarthaksarangi.dev@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
      X: {
        name: "x",
        url: "https://x.com/sarthaksarangi_",
        icon: Icons.x,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Exotel",
      href: "https://exotel.com",
      badges: [],
      location: "Gurugram, India",
      title: "Software Engineer",
      logoUrl: "/exotel.svg",
      start: "Aug 2026",
      end: "Present",
      description:
        "Built an LLM-powered automation platform with Python, FastAPI, and Pydantic that turns a statement of work and a JRXML report template into a ready-to-apply customized call report, cutting common customizations from a full day of manual work to about 5 minutes. It is in beta with the Professional Services team across 6 default call-detail reports, covering column changes, logic changes, and data extraction from IVR and data tables. Designed it to convert each request into a standard requirement template, ask clarifying questions and score feasibility until the requirement is workable, and send the LLM only the relevant parts of the template, with Pydantic validating the output at every step. Added an explanation of every change (what, why, and how) beside a side-by-side comparison, with human approval required before anything is applied. Evaluated output quality with an LLM-as-judge and tests against a golden dataset, and used the results to refine the tool's knowledge base. Also delivered voice bot integrations with IVR, Next.js interfaces, middleware, and wrapper APIs.",
      bullets: [
        "Engineered an **LLM-powered automation platform** with **Python**, **FastAPI**, and **Pydantic** that turns a statement of work and a **JRXML** report template into a ready-to-apply customized call report, cutting common customizations from **1 day of manual work to ~5 minutes**.",
        "Rolled it out in **beta to the Professional Services team** across **6 default call-detail reports**, handling column additions, removals, and reordering, logic changes, and data extraction from **IVR** and data tables.",
        "Designed a **requirement-extraction pipeline** with a **clarification loop** and **feasibility score**: requests are normalized into a standard template, only relevant template fragments reach the LLM, **Pydantic** validates every step, and each change is explained (**what, why, how**) beside a **side-by-side diff** with **human approval** before it is applied.",
        "Evaluated output quality with an **LLM-as-judge** and tests against a **golden dataset**, using the results to curate the tool's **knowledge base** of text and Markdown files.",
        "Delivered **voice bot integrations with IVR**, **Next.js** interfaces, middleware, and wrapper APIs.",
      ],
    },
    {
      company: "Ericsson",
      href: "https://www.ericsson.com",
      badges: [],
      location: "Kolkata, India",
      title: "Software Engineer",
      logoUrl: "/ericsson.svg",
      start: "Aug 2024",
      end: "Aug 2026",
      description:
        "Built Java Spring Boot backend services and nightly PL/SQL batch jobs for enterprise product synchronization, with retry and orchestration logic across RESTful APIs supporting 10,000+ product updates daily. Designed rule-based synchronization and validation logic with Spring Boot, Spring Data JPA, and Oracle SQL that automated manual updates and cut operational effort by 30+ hours a week. Resolved N+1 query issues in Spring Data JPA and removed redundant joins in PL/SQL procedures, cutting bulk upload time from 45s to 15s across 100+ daily enterprise operations.",
      bullets: [
        "Built **Java Spring Boot** backend services and nightly PL/SQL batch jobs for enterprise product synchronization, with retry and orchestration logic across RESTful APIs supporting **10,000+** product updates daily.",
        "Designed rule-based synchronization and validation logic with **Spring Boot**, **Spring Data JPA**, and Oracle SQL that automated manual updates, cutting operational effort by **30+ hours weekly**.",
        "Resolved N+1 query issues in **Spring Data JPA** and removed redundant joins in PL/SQL procedures, cutting bulk upload time from **45s to 15s** across 100+ daily enterprise operations.",
      ],
    },
    {
      company: "Ericsson",
      href: "https://www.ericsson.com",
      badges: ["Internship"],
      location: "Kolkata, India",
      title: "Software Engineer Intern",
      logoUrl: "/ericsson.svg",
      start: "Jan 2024",
      end: "Jul 2024",
      description:
        "Led the backend team for a full-stack Meal Booking POC, designing 4 REST microservices (User, Auth, Booking, Ticketing) on Node.js, Express, and PostgreSQL with Prisma ORM, plus a complete JWT auth system with access/refresh token lifecycle and RBAC across 3 user roles. Built the React/TypeScript frontend with a multi-role dashboard, cutting redundant API calls by 40% via Axios interceptors and TanStack Query caching.",
      bullets: [
        "Led the backend team for a **full-stack Meal Booking POC**, designing 4 REST microservices (User, Auth, Booking, Ticketing) on **Node.js/Express/PostgreSQL** with Prisma ORM and JWT auth with access/refresh tokens and RBAC across 3 user roles.",
        "Built the **React/TypeScript** frontend with a multi-role dashboard, cutting redundant API calls by **40%** via TanStack Query caching.",
      ],
    },
  ],

  education: [
    {
      school: "Institute of Technical Education and Research, Bhubaneswar",
      href: "https://www.soa.ac.in/iter",
      degree:
        "Bachelor of Technology in Computer Science & Engineering (CGPA: 8.8/10)",
      logoUrl: "/iter.jpg",
      start: "2020",
      end: "2024",
    },
  ],

  projects: [
    {
      title: "DocSage",
      href: "https://github.com/sarthaksarangi/docsage",
      dates: "May 2026 – Present",
      active: true,
      description:
        "RAG-based conversational assistant for querying technical PDFs. Ingests and chunks documents, embeds them with Gemini, and runs semantic similarity search with metadata filtering on PostgreSQL + pgvector. Answers are generated by Gemini 2.5 Flash through LangChain and grounded with source citations in a Streamlit chat interface.",
      bullets: [
        "Developed a **RAG-based conversational assistant** for technical PDFs using **LangChain** and **Gemini 2.5 Flash**, with **pgvector** semantic search, metadata filtering, and citation-grounded answers in a **Streamlit** interface.",
      ],
      technologies: [
        "Python",
        "LangChain",
        "RAG",
        "pgvector",
        "PostgreSQL",
        "Gemini",
        "Streamlit",
        "Docker",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/sarthaksarangi/docsage",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/docsage-thumbnail.png",
      video: "",
    },
    {
      title: "TickrFlow",
      href: "https://tickrflow.sarthaksarangi.com/",
      dates: "Feb 2026 – Apr 2026",
      active: false,
      description:
        "AI-powered stock market intelligence app with real-time TradingView charts, Finnhub-powered debounced stock search with ISR caching, and watchlists behind Better Auth session-based access control. A daily Inngest background pipeline uses Gemini 2.5 Flash to write personalized market summaries for each user's watchlist and delivers them by email via Nodemailer.",
      bullets: [
        "Built an **AI-powered stock market intelligence application** with real-time **TradingView** charts, **Finnhub**-powered debounced stock search with **ISR caching**, and watchlists behind **Better Auth** session-based access control.",
        "Automated a **daily news pipeline** using **Inngest** background jobs and **Gemini 2.5 Flash**, generating personalized market summaries for each user's watchlist and delivering them via **Nodemailer**.",
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Gemini AI",
        "Inngest",
        "MongoDB",
        "Better Auth",
        "Finnhub",
        "Nodemailer",
      ],
      links: [
        {
          type: "Website",
          href: "https://tickrflow.sarthaksarangi.com/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/sarthaksarangi/tickr-flow",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/tickrflow.png",
      video: "",
    },
    {
      title: "Pay-X",
      href: "https://user-payx.sarthaksarangi.com/",
      dates: "Oct 2025 – Jan 2026",
      active: false,
      description:
        "Fintech payment platform built as a TypeScript Turborepo monorepo: a Next.js user dashboard, merchant portal, and Express webhook microservice over a shared Prisma/PostgreSQL data layer, with NextAuth supporting Google, GitHub, and phone/password login. Atomic database transactions and idempotency keys prevent double-spending on concurrent P2P transfers. Containerized with Docker and deployed through a CI/CD pipeline.",
      bullets: [
        "Architected a **fintech payment platform** as a **TypeScript Turborepo monorepo**: a Next.js user dashboard, merchant portal, and **Express webhook microservice** over a shared **Prisma/PostgreSQL** data layer with **NextAuth** login.",
        "Implemented **atomic database transactions** and **idempotency keys** to prevent double-spending on concurrent P2P transfers; containerized with **Docker** and deployed via a **CI/CD** pipeline.",
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Turborepo",
        "Express",
        "PostgreSQL",
        "Prisma",
        "NextAuth",
        "Docker",
        "CI/CD",
        "Chart.js",
      ],
      links: [
        {
          type: "Website",
          href: "https://user-payx.sarthaksarangi.com/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/sarthaksarangi/pay-x",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image:
        "https://res.cloudinary.com/dp3mmxvqb/image/upload/v1763058357/Screenshot_2025-11-13_at_11.46.10_PM_yzt921.png",
      video: "",
    },
    {
      title: "Blogify",
      href: "https://blogify.sarthaksarangi.com",
      dates: "Jan 2025 – Apr 2025",
      active: false,
      description:
        "Multi-user blogging platform with JWT authentication, role-based access, and CRUD workflows, built with React + TypeScript and a serverless Hono backend on Cloudflare Workers. Integrated the Tiptap editor and Cloudinary image optimization, reducing media payload sizes by 60–80%.",
      bullets: [],
      technologies: [
        "React",
        "TypeScript",
        "Hono",
        "Cloudflare Workers",
        "PostgreSQL",
        "JWT",
        "Cloudinary",
      ],
      links: [
        {
          type: "Website",
          href: "https://blogify.sarthaksarangi.com",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/sarthaksarangi/medium-blog-fe",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image:
        "https://res.cloudinary.com/dp3mmxvqb/image/upload/v1763064588/Screenshot_2025-11-14_at_1.25.58_AM_gncynz.png",
      video: "",
    },
  ],

  achievements: [
    {
      title: "450+ problems solved on LeetCode",
      detail: "Top 15%",
      href: "https://leetcode.com/u/sarthaksarangi/",
    },
    {
      title: "HackerRank SQL 5-Star",
      detail: "",
      href: "https://www.hackerrank.com/sarthaksarangi",
    },
  ],

  certifications: [
    {
      title: "LangChain for LLM Application Development",
      issuer: "DeepLearning.AI",
    },
    {
      title: "Oracle SQL & Database Design",
      issuer: "Udemy",
    },
  ],
} as const;
