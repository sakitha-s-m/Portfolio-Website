export const PROFILE = {
  name: "Sakitha Manamperi",
  role: "Software Engineering Student",
  location: "Melbourne, VIC",
  email: "sakithama20@gmail.com",
  phone: "044 999 0065",
  github: "https://github.com/sakitha-s-m",
  linkedin: "https://www.linkedin.com/in/ssm2004",
  resume: "/resume.pdf",
  degree: "Bachelor of Software Engineering · RMIT",
  graduation: "Class of 2027",
  tagline:
    "Building modern web applications, automation tools, cloud solutions, and intelligent digital experiences.",
};

export const ROTATING_ROLES = [
  "Full-Stack Development",
  "Cloud Engineering",
  "Software Architecture",
  "UI Engineering",
  "Problem Solving",
];

export type Milestone = {
  index: string;
  year: string;
  title: string;
  body: string;
  meta: string;
};

export const MILESTONES: Milestone[] = [
  {
    index: "01",
    year: "2021",
    title: "Curious Student",
    body: "It started in Panadura, Sri Lanka — pulling games apart to see how they worked, then writing the first lines of HTML, CSS and C# at ESoft Metro Campus.",
    meta: "Diploma in IT · ESoft Metro Campus",
  },
  {
    index: "02",
    year: "2024",
    title: "Software Engineering Degree",
    body: "Moved across the world to Melbourne to study a Bachelor of Software Engineering at RMIT, concentrating on Artificial Intelligence and Software Design.",
    meta: "RMIT University · expected July 2027",
  },
  {
    index: "03",
    year: "2025",
    title: "Building Real Projects",
    body: "Shipped a Java maze-processing system with custom DFS/BFS pipelines and a 24/7 automated crypto trading bot executing real trades on Binance Testnet.",
    meta: "MazeRunner · Smart Crypto Trading Bot",
  },
  {
    index: "04",
    year: "2026",
    title: "Learning Cloud Technologies",
    body: "Running production-style systems on Digital Ocean, studying AWS, microservices and system design — making software that survives the real world.",
    meta: "Cloud · DevOps · System Design",
  },
  {
    index: "05",
    year: "2027",
    title: "Future Software Engineer",
    body: "Graduating ready to build software that matters — looking for internships and teams that care about craft as much as code.",
    meta: "Open to internships & graduate roles",
  },
];

export type SkillNode = {
  id: string;
  label: string;
  group: "core" | "frontend" | "backend" | "cloud" | "data" | "craft";
  x: number; // 0–1000 viewBox space
  y: number; // 0–620 viewBox space
  blurb: string;
};

export const SKILL_NODES: SkillNode[] = [
  { id: "core", label: "SAKITHA.CORE", group: "core", x: 500, y: 300, blurb: "Data structures & algorithms — the kernel everything else links against." },
  // frontend (upper-left)
  { id: "react", label: "React", group: "frontend", x: 295, y: 160, blurb: "Component-driven UIs — powering this very portfolio." },
  { id: "next", label: "Next.js", group: "frontend", x: 430, y: 105, blurb: "App Router, server components, edge-ready rendering." },
  { id: "ts", label: "TypeScript", group: "frontend", x: 175, y: 245, blurb: "Types as documentation. Strict mode, always." },
  { id: "tailwind", label: "Tailwind", group: "frontend", x: 330, y: 270, blurb: "Design systems at utility speed." },
  // backend (upper-right)
  { id: "java", label: "Java", group: "backend", x: 655, y: 130, blurb: "OOP, testing & algorithms — built MazeRunner with 25+ test cases." },
  { id: "python", label: "Python", group: "backend", x: 800, y: 185, blurb: "Automation & trading systems — RSI strategies on the Binance API." },
  { id: "node", label: "Node.js", group: "backend", x: 645, y: 255, blurb: "JavaScript on the server, APIs and tooling." },
  { id: "cpp", label: "C++", group: "backend", x: 880, y: 105, blurb: "Low-level fundamentals and performance thinking." },
  // cloud (lower-right)
  { id: "do", label: "DigitalOcean", group: "cloud", x: 705, y: 420, blurb: "Runs my trading daemon 24/7 under tmux on a droplet." },
  { id: "aws", label: "AWS", group: "cloud", x: 845, y: 360, blurb: "Currently studying — compute, storage and serverless." },
  { id: "linux", label: "Linux", group: "cloud", x: 830, y: 505, blurb: "Daily driver for servers, ssh and shell automation." },
  // data (lower-left)
  { id: "sql", label: "SQL", group: "data", x: 330, y: 430, blurb: "Schema design and queries since my first diploma project." },
  { id: "mysql", label: "MySQL", group: "data", x: 195, y: 500, blurb: "Relational storage for application data." },
  { id: "pg", label: "PostgreSQL", group: "data", x: 390, y: 545, blurb: "The serious relational database — learning it deeply." },
  // craft (bottom-center)
  { id: "git", label: "Git", group: "craft", x: 545, y: 480, blurb: "Branching, pull requests and issue-driven workflow." },
  { id: "unreal", label: "Unreal 5", group: "craft", x: 110, y: 390, blurb: "Blueprints & game design — self-taught side quest." },
];

export const SKILL_EDGES: [string, string][] = [
  ["core", "react"], ["core", "java"], ["core", "sql"], ["core", "do"], ["core", "git"], ["core", "next"], ["core", "node"], ["core", "tailwind"],
  ["react", "next"], ["react", "ts"], ["react", "tailwind"], ["ts", "tailwind"], ["next", "java"],
  ["java", "python"], ["java", "node"], ["python", "node"], ["python", "cpp"], ["java", "cpp"],
  ["python", "do"], ["do", "aws"], ["do", "linux"], ["aws", "linux"],
  ["sql", "mysql"], ["sql", "pg"], ["mysql", "pg"], ["ts", "unreal"], ["sql", "unreal"],
  ["git", "do"], ["git", "sql"], ["node", "do"],
];

export const SKILL_GROUPS: Record<SkillNode["group"], { label: string; dot: string }> = {
  core: { label: "kernel", dot: "#e6eaf2" },
  frontend: { label: "frontend", dot: "#38bdf8" },
  backend: { label: "backend", dot: "#a78bfa" },
  cloud: { label: "cloud", dot: "#34d399" },
  data: { label: "data", dot: "#fbbf24" },
  craft: { label: "craft", dot: "#f472b6" },
};

export type Project = {
  slug: string;
  command: string;
  name: string;
  kicker: string;
  description: string;
  features: string[];
  challenges: string[];
  architecture: string[];
  stack: string[];
  impact: { value: string; label: string }[];
  github: string;
  live?: string;
  preview: "maze" | "trading" | "portfolio";
  accent: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "mazerunner",
    command: "open mazerunner --lang java",
    name: "MazeRunner System",
    kicker: "algorithms · software testing",
    description:
      "A full maze-processing system: a validation pipeline that catches invalid entrances, isolated cells and cycles with custom DFS/BFS, plus a 3D builder that renders text-based mazes inside Minecraft via automated block placement.",
    features: [
      "Complete input + validation pipeline with custom DFS/BFS graph algorithms",
      "3D maze builder visualising text mazes inside Minecraft",
      "25+ test cases across boundary, integration and workflow scenarios",
      "Git-branching workflow with pull requests and issue tracking",
    ],
    challenges: [
      "Detecting cycles and isolated cells without false positives",
      "Automating block placement reliably in a live Minecraft world",
    ],
    architecture: ["text input", "validator (DFS/BFS)", "path analysis", "3D renderer"],
    stack: ["Java", "OOP", "JUnit", "Algorithms", "Minecraft API", "Git"],
    impact: [
      { value: "100%", label: "valid-maze detection" },
      { value: "~40%", label: "less debugging time" },
      { value: "25+", label: "test scenarios" },
    ],
    github: "https://github.com/sakitha-s-m",
    preview: "maze",
    accent: "#a78bfa",
  },
  {
    slug: "tradingbot",
    command: "open trading-bot --env cloud",
    name: "Smart Crypto Trading Bot",
    kicker: "automation · cloud · quant",
    description:
      "A fully automated, cloud-hosted trading system executing real trades on Binance Testnet with a custom RSI strategy proven through iterative backtesting — running 24/7 even when every client device is offline.",
    features: [
      "24/7 trading daemon on a Digital Ocean droplet under tmux with auto-polling",
      "Custom RSI-based strategy (V1) refined through a backtesting engine",
      "Binance API integration: market data, live execution, order validation",
      "Streamlit dashboard for live control — start/stop, strategy tuning, monitoring",
    ],
    challenges: [
      "Keeping execution uninterrupted through disconnects and restarts",
      "Logging every trade to CSV with analytics for strategy evaluation",
    ],
    architecture: ["binance api", "strategy engine (RSI)", "execution daemon", "streamlit dashboard"],
    stack: ["Python", "Binance API", "Streamlit", "DigitalOcean", "tmux", "Pandas"],
    impact: [
      { value: "24/7", label: "uptime on cloud" },
      { value: "V1", label: "backtested strategy" },
      { value: "100%", label: "testnet-safe trades" },
    ],
    github: "https://github.com/sakitha-s-m",
    preview: "trading",
    accent: "#34d399",
  },
  {
    slug: "portfolio",
    command: "open portfolio --mode immersive",
    name: "This Command Center",
    kicker: "creative engineering · webgl",
    description:
      "The site you're inside right now — a cinematic, scroll-driven developer OS with a boot sequence, a live code editor, a WebGL network visualisation and a ⌘K command palette. Designed and engineered from scratch.",
    features: [
      "GSAP ScrollTrigger storytelling with section pinning and scrubbed timelines",
      "React Three Fiber network scene reacting to mouse movement",
      "Global command palette with fuzzy search (try ⌘K)",
      "Lenis smooth scroll, magnetic buttons, custom cursor physics",
    ],
    challenges: [
      "Holding 60fps while WebGL, scroll scrubbing and typing animations run together",
      "Making the same experience feel premium from a phone to an ultrawide",
    ],
    architecture: ["next.js app router", "gsap + lenis core", "r3f scene", "command layer"],
    stack: ["Next.js 15", "TypeScript", "GSAP", "Three.js", "Framer Motion", "Tailwind"],
    impact: [
      { value: "60fps", label: "animation budget" },
      { value: "0", label: "templates used" },
      { value: "⌘K", label: "everything is a command" },
    ],
    github: "https://github.com/sakitha-s-m",
    preview: "portfolio",
    accent: "#38bdf8",
  },
];

export type Commit = {
  hash: string;
  year: string;
  message: string;
  body: string;
  branch?: string;
  future?: boolean;
  head?: boolean;
};

export const COMMITS: Commit[] = [
  {
    hash: "7d1a2f",
    year: "2021",
    message: "init: started Diploma in IT",
    body: "ESoft Metro Campus, Panadura — app development, networking and database design. First real code: HTML, CSS, SQL, C#, JavaScript.",
  },
  {
    hash: "a4f5d2",
    year: "2023",
    message: "branch: crew-coach @ McDonald's Australia",
    body: "Team Leader in Melbourne — trained 14 new staff, mentored 20+, ran shifts of 6 and kept service smooth at peak hours. Leadership, merged back into everything I build.",
    branch: "leadership",
  },
  {
    hash: "c8e2f1",
    year: "2024",
    message: "feat: began BSE @ RMIT Melbourne",
    body: "Bachelor of Software Engineering with concentrations in Artificial Intelligence and Software Design. Algorithms, OOP, statistics, engineering fundamentals.",
  },
  {
    hash: "f3a7b8",
    year: "2025",
    message: "feat: shipped MazeRunner + trading bot",
    body: "Built full systems, not toy demos — a tested Java maze pipeline and a cloud-hosted quant bot trading around the clock.",
  },
  {
    hash: "b9e4c7",
    year: "2026",
    message: "wip: cloud, AI & system design",
    body: "Studying AWS and microservices, self-learning Unreal Engine 5, and continuously shipping side projects. Open to internships.",
    head: true,
  },
  {
    hash: "······",
    year: "2027",
    message: "merge: software-engineer → world",
    body: "Graduation. The next commit is being written.",
    future: true,
  },
];
