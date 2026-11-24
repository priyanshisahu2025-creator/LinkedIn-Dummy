const { chromium } = require("playwright");
const fs = require("fs");

const KEYWORDS = "Java Developer C2C -Bench -Sales -W2 -Full-Time -Hotlist";

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const page = await browser.newPage();

  // 1. Auto login
  await page.goto("http://localhost:5173");
  await page.fill("#email", "demo@test.com");
  await page.fill("#password", "demo123");
  await page.click("#login-btn");
  await page.waitForURL("**/feed");
  console.log("Login done");

  // 2. Search + filters
  await page.fill("#search-input", KEYWORDS);
  await page.check("#filter-24h");
  await page.check("#filter-us");
  await Promise.all([
    page.waitForResponse((r) => r.url().includes("country=US")),
    page.click("#search-btn"),
  ]);
  await page.waitForTimeout(500);

  // 3. Posts scrape
  const posts = await page.$$eval(".post-card", (cards) =>
    cards.map((c) => ({
      author: c.querySelector(".post-author").innerText,
      location: c.querySelector(".post-location").innerText,
      text: c.querySelector(".post-text").innerText,
    }))
  );

  console.log(`Found ${posts.length} posts`);
  fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));
  await browser.close();
})();