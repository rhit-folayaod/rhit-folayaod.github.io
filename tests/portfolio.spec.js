const { test, expect } = require("@playwright/test");

test("title menu opens Experience and Back returns", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("img", { name: "Timi Folayan Portfolio" })).toBeVisible();
  await expect(page.getByText("Not approved by or associated with Mojang or Microsoft.")).toBeVisible();
  await page.getByRole("link", { name: "Experience" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Experience" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Sales Development Engineering Intern/ })).toBeVisible();
  await page.getByRole("link", { name: "Back" }).click();
  await expect(page.getByRole("link", { name: "Projects" })).toBeVisible();
});

test("projects: select, search, and actions follow the selection", async ({ page }) => {
  await page.goto("/#/projects");
  const open = page.getByRole("button", { name: /^Open/ });
  const github = page.getByRole("button", { name: "GitHub" });
  await expect(open).toBeDisabled();

  await page.getByRole("button", { name: /LinkedLife/ }).click();
  await expect(open).toHaveText("Open site");
  await expect(github).toBeDisabled(); // private repo

  await page.getByRole("button", { name: /DAQ MCP Server/ }).click();
  await expect(github).toBeEnabled();
  await open.click();
  await expect(page.getByRole("heading", { level: 1, name: "DAQ MCP Server" })).toBeVisible();
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/rhit-folayaod/daq-mcp");

  await page.goto("/#/projects");
  await page.getByRole("searchbox", { name: "Search projects" }).fill("kubernetes");
  await expect(page.getByRole("button", { name: /NBA Player Predictor/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /LinkedLife/ })).toBeHidden();
  await page.getByRole("searchbox", { name: "Search projects" }).fill("cobol");
  await expect(page.getByText(/Nothing matches "cobol"/)).toBeVisible();
});

test("skills: a book shows where the skill was used", async ({ page }) => {
  await page.goto("/#/skills");
  await page.getByRole("button", { name: /Data & Infra/ }).click();
  await page.getByRole("button", { name: "Docker" }).click();
  await expect(page.locator("#enchant")).toContainText("NBA Player Predictor");
  await page.getByRole("button", { name: /^Languages/ }).click();
  await page.getByRole("button", { name: "C#" }).click();
  await expect(page.locator("#enchant")).toContainText("Rose-Hulman Ventures (RHV)");
});

test("content hygiene across every screen", async ({ page }) => {
  let text = "";
  for (const hash of ["", "#/experience", "#/projects", "#/skills", "#/about", "#/projects/linkedlife", "#/projects/nba-player-predictor"]) {
    await page.goto("/" + hash);
    await expect(page.locator("main h1")).toBeVisible();
    text += await page.locator("body").innerText();
  }
  expect(text).not.toMatch(/779|\(615\)/); // no phone number
  expect(text).not.toMatch(/LabVIEW|AlgoQuest|Katham|Resume Tailor|Lost and Found|Sports Webstore/i);
  expect(text).not.toMatch(/(?<!former )PR Chair/); // only ever "former PR Chair"
  expect(text).toContain("former PR Chair");
  expect(text).not.toContain("\u2014"); // no em dashes
});

test("old URLs still land somewhere real", async ({ page }) => {
  await page.goto("/daq-mcp.html");
  await expect(page.getByRole("heading", { level: 1, name: "DAQ MCP Server" })).toBeVisible();
  await page.goto("/#projects");
  await expect(page.getByRole("heading", { level: 1, name: "Select Project" })).toBeVisible();
});
