const fs = require("fs");

const posts = JSON.parse(fs.readFileSync("posts.json", "utf-8"));

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const ROLE_RE = /(Java Developer|Python Developer|React Developer|Full Stack Developer)/i;

const seen = new Set();
const recruiters = [];

for (const p of posts) {
  const emails = p.text.match(EMAIL_RE) || [];
  for (const raw of emails) {
    const email = raw.toLowerCase();
    if (seen.has(email)) continue; // duplicate hatao
    seen.add(email);
    recruiters.push({
      name: p.author,
      firstName: p.author.split(" ")[0],
      email,
      role: (p.text.match(ROLE_RE) || [])[0] || "Java Developer",
      location: p.location,
    });
  }
}

// JSON
fs.writeFileSync("recruiters.json", JSON.stringify(recruiters, null, 2));

// CSV
const header = "name,email,role,location";
const rows = recruiters.map((r) =>
  [r.name, r.email, r.role, r.location].map((v) => `"${v}"`).join(",")
);
fs.writeFileSync("recruiters.csv", [header, ...rows].join("\n"));

console.log(`Extracted ${recruiters.length} unique recruiters from ${posts.length} posts`);