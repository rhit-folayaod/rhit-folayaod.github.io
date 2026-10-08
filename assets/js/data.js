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

// status: deployed | released | private
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
    id: "systemlink-mcp",
    name: "systemlink-mcp",
    year: 2026,
    icon: "rack",
    status: "released",
    blurb: "The fleet-level companion to DAQ MCP: an MCP server for NI SystemLink shaped around the questions test engineers actually ask.",
    tags: ["Python", "MCP", "FastMCP", "Pydantic", "uv", "pytest"],
    live: null,
    repo: "https://github.com/rhit-folayaod/systemlink-mcp",
    detail: [
      "Twelve tools for yield by product revision, failing DUT steps against spec limits, measurement-trace summaries, and calibration-due assets. Responses are summaries plus a bounded preview, not raw result dumps, so a model's context stays usable.",
      "Read-only by default. The two write tools refuse unless an environment flag is set.",
      "Tools call a backend interface instead of the SDK directly, so a pure-Python simulated fleet runs with no SystemLink server. The live backend is written against nisystemlink-clients but has not been run against a SystemLink Enterprise instance in CI. Personal project; not affiliated with NI or Emerson.",
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
      "Self-initiated during my Emerson (NI) internship, not an assigned project.",
    ],
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
];

export const statusInfo = {
  deployed: { label: "Deployed", bars: 4, tone: "green" },
  released: { label: "Released", bars: 3, tone: "green" },
  private: { label: "Private", bars: 1, tone: "aqua" },
};

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
