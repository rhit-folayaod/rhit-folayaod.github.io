const { test, expect } = require("@playwright/test");

const THEMES = ["mario", "terraria", "minecraft", "sonic", "fortnite", "clash", "fighter"];
const SECTIONS = ["", "/experience", "/projects", "/skills", "/about"];
const DISCLAIMER = "Fan-made tribute. Not affiliated with or endorsed by Nintendo, Sega, Epic Games, Re-Logic, Mojang, Microsoft, Supercell, or Capcom.";
const CURRENT = ["LinkedLife", "DAQ MCP Server", "MioDAQ Jetpack Joyride", "NBA Player Predictor"];
const EARLIER = ["Editor Trees", "Online Sports Webstore", "Lost and Found Database", "Jetpack Joyride (Java)", "Settlers of Catan", "DSA From Scratch"];

test("desktop: one click on a game icon boots it, and the game can quit back", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Welcome.exe" })).toBeVisible();
  await expect(page.getByText(DISCLAIMER)).toBeVisible();
  for (const name of ["Village Clash", "Arcade Brawl"]) await expect(page.getByRole("button", { name })).toBeVisible();
  await expect(page.getByRole("button", { name: "Brick Hub" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Arcade Brawl" })).toHaveAttribute("title", "Street Fighter-style");
  await page.getByRole("button", { name: "Block Craft" }).click();
  await expect(page.getByRole("progressbar", { name: "Loading Block Craft" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Timi Folayan Portfolio" })).toBeVisible();
  await expect(page).toHaveURL(/#\/minecraft$/);
  await page.getByRole("link", { name: "Quit to Desktop" }).click();
  await expect(page.getByRole("button", { name: "Block Craft" })).toBeVisible();

  // Resume.txt and My Computer open as windows; Escape closes them.
  await page.getByRole("button", { name: "Resume.txt" }).press("Enter");
  await expect(page.getByLabel("Resume text")).toContainText("Summer 2025");
  await page.keyboard.press("Escape");
  await expect(page.getByLabel("Resume text")).toBeHidden();
  await page.getByRole("button", { name: "My Computer" }).click();
  await expect(page.getByRole("link", { name: "GitHub (G:)" })).toHaveAttribute("href", "https://github.com/rhit-folayaod");
});

test("glory picks a random game, never the one opened last", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("tf.lastTheme", "mario"));
  await page.goto("/");
  await page.getByRole("button", { name: "Open glory" }).click();
  await expect(page.getByText("Picking a game...")).toBeVisible();
  await expect(page).toHaveURL(/#\/(terraria|minecraft|sonic|fortnite|clash|fighter)$/, { timeout: 10000 });
  await expect(page.locator("main h1")).toBeVisible();
});

test("every theme shows the same experience and projects, and has a way home", async ({ page }) => {
  for (const t of THEMES) {
    await page.goto(`/#/${t}/experience`);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.getByText(/Summer 2025/).first()).toBeVisible();
    await expect(page.getByText("Software Engineer Intern", { exact: false }).first()).toBeVisible();
    await page.goto(`/#/${t}/projects`);
    await expect(page.locator(`main a[href="https://www.linked-life.com"], main button:has-text("LinkedLife")`).first()).toBeVisible();
    await page.goto(`/#/${t}`);
    await expect(page.locator('main a[href="#/"]').first()).toBeVisible();
    await expect(page.getByText(DISCLAIMER, { exact: false }).first()).toBeVisible();
  }
});

test("block craft: project select/search and the skills lookup still work", async ({ page }) => {
  await page.goto("/#/minecraft/projects");
  const open = page.getByRole("button", { name: /^Open/ });
  const github = page.getByRole("button", { name: "GitHub" });
  await expect(open).toBeDisabled();
  await page.getByRole("button", { name: /LinkedLife/ }).click();
  await expect(open).toHaveText("Open site");
  await expect(github).toBeDisabled(); // private repo
  await page.getByRole("button", { name: /DAQ MCP Server/ }).click();
  await open.click();
  await expect(page.getByRole("heading", { level: 1, name: "DAQ MCP Server" })).toBeVisible();
  await page.goto("/#/minecraft/projects");
  await page.getByRole("searchbox", { name: "Search projects" }).fill("cobol");
  await expect(page.getByText(/Nothing matches "cobol"/)).toBeVisible();

  await page.goto("/#/minecraft/skills");
  await page.getByRole("button", { name: /Data & Infra/ }).click();
  await page.getByRole("button", { name: "Docker" }).click();
  await expect(page.locator("#enchant")).toContainText("NBA Player Predictor");
});

test("content hygiene on every screen of every theme", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  let text = "";
  await page.goto("/");
  await page.getByRole("button", { name: "Resume.txt" }).press("Enter");
  text += await page.locator("body").innerText();
  for (const t of THEMES) for (const s of SECTIONS) {
    await page.goto(`/#/${t}${s}`);
    await expect(page.locator("main h1")).toBeVisible();
    text += await page.locator("body").innerText();
  }
  expect(text).not.toMatch(/779|\(615\)/); // no phone number
  expect(text).not.toMatch(/LabVIEW|AlgoQuest|Katham|Resume Tailor|systemlink/i);
  // the current resume wins over the old ones
  expect(text).not.toMatch(/Computer Engineering|Cybersecurity|Japanese|Expected 202|Public Relations|National Honor|\bNHS\b|captain|\bDell\b|church/i);
  expect(text).not.toMatch(/\b(40|50|25|95)%|250 devices/); // no metrics from old resumes
  expect(text).toContain("Geography");
  expect(text).toContain("Lost and Found Database");
  expect(text).not.toMatch(/(?<!former )PR Chair/); // only ever "former PR Chair"
  expect(text).toContain("former PR Chair");
  expect(text).not.toMatch(/Summer 2022/);
  expect(text).not.toContain("\u2014"); // no em dashes
  expect(text).not.toMatch(/\b(Mario|Luigi|Sonic|Steve|Minecraft|Terraria|Fortnite|Stardew|Street Fighter|Clash of Clans|Ryu|Chun-Li)\b/); // parody names only on screen
  expect(text).not.toMatch(/Roblox|Brick Hub|ConcernedApe/);
  expect(errors, errors.join("\n")).toEqual([]);
});

test("older projects come after the current ones, and the new themes open them", async ({ page }) => {
  await page.goto("/#/minecraft/projects");
  const names = await page.locator(".proj-name").allInnerTexts();
  const order = [...CURRENT, ...EARLIER].map((n) => names.findIndex((x) => x.startsWith(n)));
  expect(order).toEqual([...order].sort((a, b) => a - b));
  expect(order.every((i) => i >= 0)).toBe(true);
  await expect(page.getByText("Course & earlier projects")).toBeVisible();


  // Village Clash: the Town Hall is About, the Workshop holds the older builds.
  await page.goto("/#/clash");
  await page.getByRole("link", { name: /Town Hall/ }).click();
  // (the village h1 also mentions the Town Hall, so match the panel heading from its start)
  await expect(page).toHaveURL(/#\/clash\/about$/);
  await expect(page.getByRole("heading", { level: 1, name: /^Town Hall/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/#\/clash$/);
  await page.getByRole("link", { name: /Builder's Workshop/ }).click();
  await page.getByRole("button", { name: /Lost and Found Database/ }).click();
  await expect(page.locator("#v-pd")).toContainText("Microsoft SQL Server");

  // Arcade Brawl: picking a project from the select screen loads its card.
  await page.goto("/#/fighter");
  await expect(page).toHaveTitle("Arcade Brawl | Timi Folayan");
  await page.goto("/#/fighter/projects");
  await page.getByRole("button", { name: "Editor Trees" }).click();
  await expect(page.locator("#x-bio")).toContainText("Summer 2024");
  await expect(page).toHaveURL(/#\/fighter\/projects\/editor-trees$/);
  // ...and the two jetpack games link to each other.
  await page.getByRole("button", { name: "Jetpack Joyride (Java)" }).click();
  await expect(page.locator("#x-bio")).toContainText("Winter 2023");
  await page.locator("#x-bio").getByRole("link", { name: /MioDAQ Jetpack Joyride/ }).click();
  await expect(page.locator("#x-bio h2")).toHaveText("MioDAQ Jetpack Joyride");
});

test("old URLs land in the Block Craft theme", async ({ page }) => {
  await page.goto("/daq-mcp.html");
  await expect(page.getByRole("heading", { level: 1, name: "DAQ MCP Server" })).toBeVisible();
  await page.goto("/#projects");
  await expect(page).toHaveURL(/#\/minecraft\/projects$/);
  await page.goto("/#/experience");
  await expect(page).toHaveURL(/#\/minecraft\/experience$/);
  // Brick Hub was retired; its links go home instead of a dead theme.
  await page.goto("/#/roblox/projects/linkedlife");
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByRole("heading", { name: "Welcome.exe" })).toBeVisible();
  await page.goto("/lost-and-found.html");
  await expect(page.getByRole("heading", { level: 1, name: "Lost and Found Database" })).toBeVisible();
});

test("boot never leaves #main blank (CSS load must not block forever)", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/");
  await expect(page.locator("#main")).not.toBeEmpty({ timeout: 2500 });
  await expect(page.locator("#main")).not.toContainText("interactive portfolio failed", { timeout: 1000 });
  await expect(page.getByRole("heading", { name: "Welcome.exe" })).toBeVisible({ timeout: 2500 });
  expect(errors, errors.join("\n")).toEqual([]);
});

test("link previews: meta tags are in the raw HTML and every icon is served", async ({ request }) => {
  // Crawlers (iMessage, Slack, LinkedIn, Discord) read the HTML as served; they never run boot.js.
  const html = await (await request.get("/")).text();
  const meta = (attr, key) => html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1];
  const desc = "Software Engineering @ Rose-Hulman (May 2027). Pick a game to explore my experience and projects.";
  expect(html).toContain("<title>Timi Folayan | Portfolio</title>");
  expect(html).toContain('<link rel="canonical" href="https://timifolayan.com/">');
  expect(meta("name", "description")).toBe(desc);
  expect(meta("property", "og:title")).toBe("Timi Folayan | Portfolio");
  expect(meta("property", "og:site_name")).toBe("Timi Folayan Portfolio");
  expect(meta("property", "og:description")).toBe(desc);
  expect(meta("property", "og:url")).toBe("https://timifolayan.com/");
  expect(meta("property", "og:type")).toBe("website");
  expect(meta("property", "og:image")).toBe("https://timifolayan.com/assets/og/og-card.png");
  expect(meta("property", "og:image:width")).toBe("1200");
  expect(meta("property", "og:image:height")).toBe("630");
  expect(meta("property", "og:image:alt")).toBeTruthy();
  expect(meta("name", "twitter:card")).toBe("summary_large_image");
  expect(meta("name", "twitter:image")).toBe("https://timifolayan.com/assets/og/og-card.png");
  expect(html).not.toContain("rhit-folayaod.github.io/");

  for (const path of ["/assets/og/og-card.png", "/apple-touch-icon.png", "/favicon-32x32.png", "/assets/og/icon-192.png", "/assets/og/icon-512.png"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"], path).toBe("image/png");
  }
  expect((await request.get("/favicon.ico")).status()).toBe(200);
  expect((await request.get("/favicon.svg")).headers()["content-type"]).toContain("image/svg+xml");
  const manifest = await (await request.get("/site.webmanifest")).json();
  expect(manifest).toMatchObject({ name: "Timi Folayan Portfolio", short_name: "Timi" });
  expect(manifest.icons.map((i) => i.sizes)).toEqual(["192x192", "512x512"]);
});
