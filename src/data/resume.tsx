import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Sarthak Sarangi",
  initials: "SS",
  url: "https://sarthaksarangi.com",
  location: "Bhubaneswar, India",
  locationLink: "https://www.google.com/maps/place/Bhubaneswar",
  description:
    "Software Engineer building scalable full-stack and backend systems.",
  summary:
    "Software Engineer with hands-on experience building production-grade backend and full-stack systems. Currently working at Ericsson on enterprise supply-chain platforms using Oracle Database and PL/SQL, delivering measurable performance and data-quality improvements. Strong experience in React, Node.js, TypeScript, REST APIs, and modern cloud-native tooling.",

  avatarUrl: "/me.png",

  highlights: [
    "Backend Engineer at Ericsson (Enterprise Systems)",
    "Strong SQL & database optimization background",
    "Built multiple full-stack systems end-to-end",
    "Comfortable owning features from design to production",
  ],

  skills: [
    // Core
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",

    // Backend & APIs
    "Hono",
    "Express.js",
    "REST APIs",
    "JWT",
    "Microservices",

    // Databases
    "PostgreSQL",
    "Oracle Database",
    "PL/SQL",
    "MongoDB",
    "Prisma",

    // Cloud & DevOps
    "Docker",
    "Cloudflare Workers",
    "CI/CD",
    "Vercel",

    // Others
    "Java",
    "Python",
  ],

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
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
      company: "Ericsson",
      href: "https://www.ericsson.com",
      badges: [],
      location: "Kolkata, India",
      title: "Software Engineer",
      logoUrl: "/ericsson.svg",
      start: "Aug 2024",
      end: "Present",
      description:
        "Backend engineer on an enterprise supply-chain platform serving 1,000+ users. Designed and implemented PL/SQL procedures and Oracle Scheduler jobs integrated with ASP.NET services. Built end-to-end data processing pipelines including validation, transformation, and XML/CLOB parsing. Optimized legacy queries and refactored core modules, improving performance by 30–50% and data accuracy by ~40%.",
    },
    {
      company: "Ericsson",
      href: "https://www.ericsson.com",
      badges: ["Internship"],
      location: "Kolkata, India",
      title: "DevSecOps Intern",
      logoUrl: "/ericsson.svg",
      start: "Jan 2024",
      end: "Jul 2024",
      description:
        "Designed and built a full-stack Meal Booking system using Node.js, Express.js, PostgreSQL, and Prisma. Implemented JWT-based role-based access control supporting three user roles. Built RESTful microservices for concurrent usage and developed a React + TypeScript frontend using TanStack Query, reducing redundant API calls by ~40% through caching.",
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
      title: "Pay-X",
      href: "https://user-payx.sarthaksarangi.com/",
      dates: "Nov 2024 – Present",
      active: true,
      description:
        "Designed and built a TypeScript-first Turborepo monorepo powering a multi-app fintech-style platform. Includes separate Next.js user and merchant apps, a shared UI package, Prisma-backed database, NextAuth authentication, and an independent Express webhook service. Focused on scalable architecture, code reuse, and production-ready developer tooling.",
      technologies: [
        "Next.js (App Router)",
        "React",
        "TypeScript",
        "Turborepo",
        "Prisma",
        "NextAuth",
        "TailwindCSS",
        "PostgreSQL",
        "Express",
        "Chart.js",
        "Framer Motion",
        "Recoil",
        "Node.js",
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
      href: "#",
      dates: "Jan 2025 – Apr 2025",
      active: false,
      description:
        "Designed and built a production-ready blogging platform with multi-user support. Implemented JWT authentication, role-based access, and CRUD workflows using React + TypeScript and a serverless Hono backend on Cloudflare Workers. Integrated Tiptap editor and Cloudinary image optimization, reducing media payload sizes by 60–80%.",
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
          href: "https://medium-blog-fe.vercel.app",
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
    {
      title: "MockPay",
      href: "https://github.com/sarthaksarangi/payment-app",
      dates: "Jun 2024 – Aug 2024",
      active: false,
      description:
        "Engineered a secure peer-to-peer payment system using the MERN stack. Implemented JWT-based authentication, role-based permissions, wallet management, and transaction history. Optimized MongoDB queries using indexing to support real-time transfers across 50+ test accounts.",
      technologies: ["MongoDB", "Express.js", "React", "Node.js", "JWT"],
      links: [
        {
          type: "Source",
          href: "https://github.com/sarthaksarangi/payment-app",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "AI Keyword Extractor",
      href: "https://github.com/sarthaksarangi/keyword-extractor-openai",
      dates: "Mar 2024 – Apr 2024",
      active: false,
      description:
        "Built a React-based AI tool integrating OpenAI GPT APIs to extract 5–15 contextually relevant keywords from long-form text. Designed efficient prompt workflows and optimized API usage to handle documents up to 2,000 words with predictable latency.",
      technologies: ["React", "TypeScript", "OpenAI API", "Chakra UI"],
      links: [
        {
          type: "Source",
          href: "https://github.com/sarthaksarangi/keyword-extractor-openai",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
  ],

  achievements: [
    "Solved 450+ LeetCode problems (Top 15%)",
    "HackerRank SQL – 5 Star",
    "Strong foundation in Data Structures & Algorithms",
    "Oracle SQL & Full-Stack Web Development certified",
  ],
} as const;
