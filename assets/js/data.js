// Everything shown on the site lives here. Source of truth: Resume.pdf.

export const links = {
  github: "https://github.com/rhit-folayaod",
  linkedin: "https://www.linkedin.com/in/timifolayan",
  email: "folayaod@rose-hulman.edu",
  resume: "Resume.pdf",
};

export const experience = [
  {
    role: "Sales Development Engineering Intern",
    org: "Emerson (NI)",
    when: "Summer 2026",
    where: "Austin, TX",
    bullets: [
      "Built an opportunity pipeline from inbound demand and proposed tailored hardware/software solutions to prospective customers, generating over $1,600,000 in individual opportunity dollars.",
      "Led live demonstrations of the MioDAQ platform at a company-wide Tech Expo, translating technical concepts into customer value.",
      "Built and documented internal projects showcasing NI hardware and software for community outreach.",
      "Used LinkedIn Sales Navigator to build account intelligence and qualify prospects alongside sales engineers.",
    ],
    tags: ["MioDAQ", "NI-DAQmx", "Technical demos", "Solution scoping"],
  },
  {
    role: "Teaching Assistant, Formal Methods",
    org: "Rose-Hulman",
    when: "Spring 2026",
    where: "Terre Haute, IN",
    bullets: [
      "Supported undergraduates in logic, specifications, and program correctness.",
      "Graded assignments and gave detailed feedback on formal proofs and model-based designs.",
      "Maintained the automated grading pipeline, including tracking down a mismatched build-output path that was silently failing an entire lab's submissions.",
    ],
    tags: ["Formal methods", "Logic", "Grading pipeline"],
  },
  {
    role: "Software Engineer Intern",
    org: "Rose-Hulman Ventures (RHV)",
    when: "Summer 2025",
    where: "Terre Haute, IN",
    bullets: [
      "Sole software engineer on a multidisciplinary team of electrical, computer, and mechanical engineers building a gas valve calibration system.",
      "Built a multithreaded C# WinForms application as the central control interface for a six-unit calibration system.",
      "Implemented Modbus TCP/IP and serial communication to coordinate PLCs and programmable power supplies, synchronizing thermal, pressure, and flow testing across all six units.",
      "Enabled high-throughput calibration of over 1,000,000 gas valves with minimal operator intervention.",
    ],
    tags: ["C#", "WinForms", "Modbus TCP/IP", "Serial", "Multithreading"],
  },
  {
    role: "Learning Advisor",
    org: "Ask Rose",
    when: "Winter 2024 - Present",
    where: "Terre Haute, IN",
    bullets: [
      "Help students in grades 6-12 with STEM homework across math, physics, and computer science, with a 99% student satisfaction rate.",
      "Walk students through problem-solving techniques instead of handing over answers; 80% report increased confidence.",
    ],
    tags: ["Math", "Physics", "Computer science", "Tutoring"],
  },
];

// status: deployed | released | private | earlier
// "earlier" = course and earlier projects. They always come after the current ones.
export const projects = [
  {
    id: "linkedlife",
    name: "LinkedLife",
    year: 2026,
    icon: "briefcase",
    status: "deployed",
    blurb: "A satirical corporate life-sim in the browser. A local classifier owns every game consequence; an LLM, if present, only writes flavor text.",
    tags: ["TypeScript", "React", "Vite", "Zustand", "Vitest", "Playwright", "Tailwind CSS", "Vercel"],
    live: "https://www.linked-life.com",
    repo: null,
    detail: [
      "You cold-message strangers, hold conversations, sit interviews, and climb a career ladder while your network tries to eat you.",
      "A local classifier buckets typed messages into a tone, and that bucket alone decides the stat and relationship consequences. The engine is deterministic and seeded, so the game is fully playable with zero API calls.",
      "97 TypeScript modules. 470+ automated tests include headless bot playthroughs that drive the real store for thousands of turns, and dialogue tests that walk 4,000+ conversation paths across 8 personalities. Versioned save-schema migrations keep saves loading from the first build.",
    ],
  },
  {
    id: "daq-mcp",
    name: "DAQ MCP Server",
    year: 2026,
    icon: "daq",
    status: "released",
    blurb: "An MCP server so AI coding clients can discover, read, and write NI DAQ channels through structured tools instead of one-off scripts.",
    tags: ["Python", "MCP", "FastMCP", "NI-DAQmx", "Starlette", "pytest", "GitHub Actions"],
    live: null,
    repo: "https://github.com/rhit-folayaod/daq-mcp",
    detail: [
      "The point is the reach: an editor session can talk to physical test hardware, not just files.",
      "A 5-layer safety model: writes start off, channels have to be allowlisted, input vs output is enforced, analog outputs are clamped, and digital writes are read back to confirm they landed. Agent tools and the browser dashboard share the same gates.",
      "A pure-Python simulator means the same tools work on a laptop with no NI drivers. Point it at real hardware and it talks NI-DAQmx. Covered by pytest in GitHub Actions; continuous acquisition feeds a live Starlette/SSE dashboard.",
    ],
  },
  {
    id: "jetpack-joyride",
    name: "MioDAQ Jetpack Joyride",
    year: 2026,
    icon: "jetpack",
    status: "released",
    blurb: "A two-player split-screen endless flyer in pygame, played on physical buttons wired into an NI mioDAQ.",
    tags: ["Python", "pygame", "NI-DAQmx", "Cursor", "Claude Code"],
    live: null,
    repo: "https://github.com/rhit-folayaod/MioDAQ-Powered-Jetpack-Joyride",
    detail: [
      "Hold a button to fire the jetpack, let go to drop. Two players share one screen, one lane each, and race the same seeded course until both crash.",
      "A background thread polls the DAQ so driver reads never stall the 60fps game loop, and LEDs mirror each player's button. With no hardware it falls back to the keyboard; during a hardware round the keyboard is ignored so a bystander can't steal control.",
      "Self-initiated during my Emerson (NI) internship, not an assigned project. It's the second time I've built this game: the first was a team Java version in Winter 2023.",
    ],
    related: "jetpack-java",
  },
  {
    id: "nba-player-predictor",
    name: "NBA Player Predictor",
    year: null,
    icon: "ball",
    status: "private",
    blurb: "Predicts a player's next-game points against a specific opponent, built as a production ML system instead of a notebook.",
    tags: ["Python", "scikit-learn", "FastAPI", "PostgreSQL", "MLflow", "Docker", "Kubernetes", "GitHub Actions"],
    live: null,
    repo: null,
    detail: [
      "A matchup-aware RandomForestRegressor trained on player and team data in PostgreSQL, with scoring averages and opponent points allowed replacing opaque IDs.",
      "Tracked 10 MLflow runs varying tree depth and test split, and promoted the lowest-MAE model to the Model Registry under a production alias.",
      "The model is served from its own containerized FastAPI service. GitHub Actions runs tests and migrations on every push, deploys QA to GKE automatically, and gates production behind a manual approval.",
    ],
  },
  /* ---------- course & earlier projects (keep these last) ---------- */
  {
    id: "editor-trees",
    name: "Editor Trees",
    year: "Summer 2024",
    icon: "branches",
    status: "earlier",
    blurb: "A team-built custom data structure in Java, designed from its theory up before any code was written.",
    tags: ["Java", "Eclipse", "Data structures", "Algorithm design"],
    live: null,
    repo: null,
    detail: [
      "Designed and implemented a complex custom data structure from its theoretical foundations, with the algorithms planned out before implementation instead of written ad hoc.",
      "Built as a team: we worked the theory out together first, then split the implementation.",
    ],
  },
  {
    id: "online-sports-webstore",
    name: "Online Sports Webstore",
    year: "Spring 2024",
    icon: "cart",
    status: "earlier",
    blurb: "An online store built from scratch in plain HTML, CSS, and JavaScript, with CRUD for products and orders.",
    tags: ["HTML/CSS", "JavaScript", "CRUD", "Pair programming"],
    live: null,
    repo: null,
    detail: [
      "A responsive storefront with no framework, from product pages through checkout.",
      "CRUD operations handle product management and order processing on the seller side.",
      "Pair-programmed with a teammate to add real-time product updates and order tracking.",
    ],
  },
  {
    id: "lost-and-found",
    name: "Lost and Found Database",
    year: "Winter 2024",
    icon: "magnifier",
    status: "earlier",
    blurb: "A lost-and-found system on Microsoft SQL Server with a Java interface for admins and users.",
    tags: ["SQL", "Java", "MS SQL Server", "Eclipse", "Object-oriented design"],
    live: null,
    repo: null,
    detail: [
      "Designed the database for logging and tracking lost and found items on Microsoft SQL Server.",
      "Built a Java UI for admins and users on top of it, using object-oriented design and Java-SQL connectivity so the app and the schema could change independently.",
    ],
  },
  {
    id: "jetpack-java",
    name: "Jetpack Joyride (Java)",
    year: "Winter 2023",
    icon: "rocket",
    status: "earlier",
    blurb: "The original version: a side-scrolling jetpack game in Java that I led a team to build.",
    tags: ["Java", "Eclipse", "UML", "Object-oriented design"],
    live: null,
    repo: null,
    detail: [
      "Led the team from concept through design specs and feature development.",
      "Laid out the architecture first as a UML class diagram, using object-oriented design to pin down every class and relationship before coding.",
      "Directed the core mechanics: jetpack flight, collision detection against barriers, and missile behavior.",
      "I rebuilt the idea in 2026 as a two-player game on NI hardware (MioDAQ Jetpack Joyride).",
    ],
    related: "jetpack-joyride",
  },
  {
    id: "settlers-of-catan",
    name: "Settlers of Catan",
    year: null,
    icon: "hex",
    status: "earlier",
    blurb: "A multi-module Java implementation of Catan, with game logic, board state, and player interaction kept in separate modules.",
    tags: ["Java", "Maven", "Internationalization"],
    live: null,
    repo: null,
    detail: [
      "Split into cleanly separated packages for game logic, board state, and player interaction.",
      "Untangled classpath issues and internationalization resource-bundle loading in a fresh build environment, the kind of bug that only shows up once the project structure gets real.",
    ],
  },
  {
    id: "dsa-from-scratch",
    name: "DSA From Scratch",
    year: null,
    icon: "stack",
    status: "earlier",
    blurb: "A self-directed rebuild of my data-structures fundamentals in Python: approach in plain English first, then code.",
    tags: ["Python", "Data structures", "Algorithms"],
    live: null,
    repo: null,
    detail: [
      "Each problem starts with a plain-English approach before any code, runs on a 25-35 minute struggle timer, and gets a cold re-solve the next day.",
      "The goal is pattern recognition in hashmap and two-pointer problems: recognize the shape of a problem before reaching for a technique, instead of memorizing solutions.",
    ],
  },
];

export const statusInfo = {
  deployed: { label: "Deployed", bars: 4, tone: "green" },
  released: { label: "Released", bars: 3, tone: "green" },
  private: { label: "Private", bars: 1, tone: "aqua" },
  earlier: { label: "Course / earlier", bars: 2, tone: "gray" },
};
export const currentProjects = projects.filter((p) => p.status !== "earlier");
export const earlierProjects = projects.filter((p) => p.status === "earlier");

export const skills = [
  { tool: "sword", name: "Languages", items: ["Python", "Java", "SQL", "C#", "TypeScript", "JavaScript", "HTML/CSS", "C", "C++"] },
  { tool: "pickaxe", name: "Frameworks", items: ["React", "Next.js", "Vite", "Zustand", "Tailwind CSS", "FastAPI", "Pydantic", "scikit-learn"] },
  { tool: "shovel", name: "AI & Agent Tooling", items: ["MCP", "FastMCP", "OpenAI API", "Cursor", "Claude Code", "Claude API", "Grok Bot"] },
  { tool: "axe", name: "Data & Infra", items: ["PostgreSQL", "MS SQL Server", "Supabase", "Docker", "Kubernetes", "MLflow", "GitHub Actions", "Fly.io", "Vercel"] },
  { tool: "hoe", name: "Tools", items: ["Git", "VS Code", "IntelliJ", "Eclipse", "NI-DAQmx", "pytest", "Vitest", "uv", "Playwright"] },
];

export const about = {
  name: "Timi Folayan",
  fullName: 'David Oluwatimilehin "Timi" Folayan',
  facts: [
    ["Studying", "Software Engineering"],
    ["School", "Rose-Hulman"],
    ["Minor", "Geography"],
    ["Graduating", "May 2027"],
    ["From", "Nashville, TN"],
  ],
  chips: ["Software", "Hardware + DAQ", "Solutions"],
  bio: [
    "I'm a Software Engineering student at Rose-Hulman Institute of Technology with a Geography minor, graduating May 2027.",
    "At Rose-Hulman Ventures I was the sole software engineer on a gas valve calibration system. In Summer 2026 I was a Sales Development Engineering intern at Emerson (NI) in Austin: pipeline work, live MioDAQ demos, and explaining measurement systems to people who have to trust them. Solid software plus clear technical communication is what I'm building toward.",
    "Outside of that I tutor 6th-12th graders through Ask Rose, and I'm an avid music enjoyer/creator, content creator, gamer, and fly guy.",
  ],
  lookingFor: "New-grad software engineering and solutions engineering roles after May 2027, plus remote or hybrid internships during the school year.",
  leadership: [
    { label: "2024 - Present", title: "Vice President, African Student Union", color: "#2e7d32" },
    { label: "2024 - Present", title: "Member, National Society of Black Engineers (former PR Chair)", color: "#c62828" },
    { label: "2023 - Present", title: "Member, ColorStack", color: "#37474f" },
    { label: "2023 - Present", title: "Member, Linux Users Group and Computer Security Club", color: "#f9a825" },
    { label: "Current", title: "Campus Ambassador, Adobe", color: "#d32f2f" },
    { label: "Current", title: "Campus Ambassador, Microsoft Student Ambassadors", color: "#1565c0" },
  ],
};
