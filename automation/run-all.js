const { execSync } = require("child_process");

const run = (file, label) => {
  console.log(`\n=== ${label} ===`);
  execSync(`node ${file}`, { stdio: "inherit" });
};

run("scrape.js", "Step 1: Login + Search + Scrape");
run("extract.js", "Step 2: Extract recruiter details");
run("send-emails.js", "Step 3: Send emails");

console.log("\nAll steps completed. Check recruiters.csv and email-log.json");