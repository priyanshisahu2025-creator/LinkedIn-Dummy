const fs = require("fs");
const nodemailer = require("nodemailer");

const recruiters = JSON.parse(fs.readFileSync("recruiters.json", "utf-8"));

// Team ka template mile to bas ye do hisse badal dena
const SUBJECT = "Regarding {{role}} opportunity in {{location}}";
const BODY = `Hi {{firstName}},

I came across your recent post about the {{role}} opening in {{location}}.
I would like to connect and learn more about the requirement.

Looking forward to hearing from you.

Regards,
Priyanshi Sahu`;

const fill = (t, r) => t.replace(/{{(\w+)}}/g, (_, k) => r[k] ?? "");
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

(async () => {
  // Ethereal: free test inbox, kuch real nahi jata
  const account = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: account.user, pass: account.pass },
  });

  const log = [];
  for (const r of recruiters) {
    try {
      const info = await transporter.sendMail({
        from: `"Priyanshi Sahu" <${account.user}>`,
        to: r.email,
        subject: fill(SUBJECT, r),
        text: fill(BODY, r),
      });
      log.push({
        email: r.email,
        status: "sent",
        preview: nodemailer.getTestMessageUrl(info),
      });
      console.log("Sent:", r.email);
    } catch (err) {
      log.push({ email: r.email, status: "failed", error: err.message });
      console.log("Failed:", r.email, err.message);
    }
    await sleep(3000); // chhota gap, spam jaisa na lage
  }

  fs.writeFileSync("email-log.json", JSON.stringify(log, null, 2));
  const sent = log.filter((l) => l.status === "sent").length;
  console.log(`Done. Sent: ${sent}, Failed: ${log.length - sent}`);
})();