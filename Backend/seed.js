require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Post = require("./models/Post");

const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000);
const KW = "Hiring Java Developer on C2C, 6+ months contract. Spring Boot, Microservices.";
const P = (author, email, text, location, country, h) =>
  ({ author, recruiterEmail: email, text, location, country, createdAt: hoursAgo(h) });

const posts = [
  // Asli job posts, US, last 24h (11): search me aane chahiye
  P("Rahul Mehta", "rahul@techstaff.test", `${KW} Send resumes to rahul@techstaff.test`, "Dallas, TX", "US", 2),
  P("Anita Rao", "anita@bluehire.test", `${KW} Email anita@bluehire.test`, "Austin, TX", "US", 10),
  P("Kevin Brooks", "kevin@nexgenit.test", `${KW} Reach kevin@nexgenit.test`, "Chicago, IL", "US", 1),
  P("Divya Nair", "divya@codebridge.test", `${KW} Contact divya@codebridge.test`, "Atlanta, GA", "US", 5),
  P("Mark Stevens", "mark@stafflink.test", `${KW} Send resumes to mark@stafflink.test`, "Seattle, WA", "US", 7),
  P("Sneha Iyer", "sneha@talentwave.test", `Urgent: ${KW} Mail sneha@talentwave.test`, "New York, NY", "US", 12),
  P("Brian Cole", "brian@primeconsult.test", `${KW} Reach brian@primeconsult.test`, "Charlotte, NC", "US", 15),
  P("Neha Kapoor", "neha@hirespark.test", `${KW} Contact neha@hirespark.test`, "San Jose, CA", "US", 18),
  P("Tony Ramirez", "tony@bluechip.test", `${KW} Email tony@bluechip.test`, "Phoenix, AZ", "US", 21),
  P("Alisha Khan", "alisha@jobgrid.test", `${KW} Contact alisha@jobgrid.test`, "Houston, TX", "US", 23),
  P("Rahul Mehta", "rahul@techstaff.test", `Another opening: ${KW} Contact rahul@techstaff.test`, "Dallas, TX", "US", 4),

  // Spam, US, last 24h (5): exclude hone chahiye
  P("Sam Lee", "sam@benchmark.test", "Hotlist: Java Developer C2C Bench consultants available. sam@benchmark.test", "Boston, MA", "US", 3),
  P("Paul Weber", "paul@marketing.test", "Java Developer C2C available on W2, Full-Time ok. paul@marketing.test", "Denver, CO", "US", 6),
  P("Ritu Sharma", "ritu@benchsales.test", "Bench Sales: Java Developer C2C candidate ready. ritu@benchsales.test", "Miami, FL", "US", 8),
  P("Carl Evans", "carl@hotlist.test", "Java Developer C2C Hotlist this week. carl@hotlist.test", "Detroit, MI", "US", 9),
  P("Maya Das", "maya@fulltime.test", "Java Developer C2C or Full-Time. maya@fulltime.test", "Dallas, TX", "US", 13),

  // Asli posts, US, purane (5): 24h filter me nahi aane chahiye
  P("Greg Hill", "greg@oldjobs.test", `${KW} greg@oldjobs.test`, "Boston, MA", "US", 48),
  P("Lena Ortiz", "lena@oldjobs.test", `${KW} lena@oldjobs.test`, "Denver, CO", "US", 60),
  P("Omar Syed", "omar@oldjobs.test", `${KW} omar@oldjobs.test`, "Miami, FL", "US", 72),
  P("Nina Patel", "nina@oldjobs.test", `${KW} nina@oldjobs.test`, "Detroit, MI", "US", 85),
  P("Jack Ryan", "jack@oldjobs.test", `${KW} jack@oldjobs.test`, "Dallas, TX", "US", 100),

  // Asli posts, non-US (5): US filter me nahi aane chahiye
  P("Priya N", "priya@ukhire.test", `${KW} priya@ukhire.test`, "London", "UK", 3),
  P("Arjun Verma", "arjun@indiastaff.test", `${KW} arjun@indiastaff.test`, "Hyderabad", "IN", 4),
  P("Emma Clarke", "emma@mancity.test", `${KW} emma@mancity.test`, "Manchester", "UK", 9),
  P("Rohit Jain", "rohit@punejobs.test", `${KW} rohit@punejobs.test`, "Pune", "IN", 14),
  P("Liam Walsh", "liam@dublinhr.test", `${KW} liam@dublinhr.test`, "Dublin", "IE", 20),

  // Irrelevant (5)
  P("Tom B", "", "Excited to join my new company as a designer!", "New York, NY", "US", 1),
  P("Julia Park", "", "Sharing my thoughts on leadership and teamwork today.", "Austin, TX", "US", 6),
  P("Dev Patel", "", "Completed my AWS certification! Thanks everyone for the support.", "San Francisco, CA", "US", 8),
  P("Olivia Grant", "", "Hiring a marketing manager. DM me for details.", "Chicago, IL", "US", 11),
  P("Ben Hall", "", "Great webinar on cloud cost optimization yesterday.", "Seattle, WA", "US", 16),
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Post.deleteMany(); await User.deleteMany();
  await Post.insertMany(posts);
  await User.create({ email: "demo@test.com", name: "Demo", password: await bcrypt.hash("demo123", 10) });
  console.log("Seeded"); process.exit();
})();