const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

const auth = (req, res, next) => {
  try {
    jwt.verify((req.headers.authorization || "").split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ message: "Unauthorized" }); }
};

router.get("/", auth, async (req, res) => {
  const { q, hours, country } = req.query;
  const filter = {};
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (q) {
    const terms = q.split(/\s+/).filter(Boolean);
    const include = terms.filter((t) => !t.startsWith("-"));
    const exclude = terms.filter((t) => t.startsWith("-") && t.length > 1).map((t) => t.slice(1));
    const conds = [
      ...include.map((t) => ({ text: { $regex: esc(t), $options: "i" } })),
      ...exclude.map((t) => ({ text: { $not: new RegExp(esc(t), "i") } })),
    ];
    if (conds.length) filter.$and = conds;
  }
  if (hours) filter.createdAt = { $gte: new Date(Date.now() - hours * 3600 * 1000) };
  if (country) filter.country = country;

  res.json(await Post.find(filter).sort({ createdAt: -1 }));
});


module.exports = router;