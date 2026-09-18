const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
app.use((req,res,next)=>{res.set("Access-Control-Allow-Origin","*");next();});
const PORT = process.env.PORT || 3030;
const FILE = path.join(__dirname, "..", "data", "own", "shops.json");

app.get("/shops", (req, res) => {
  let shops = [];
  try {
    shops = JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch (e) {
    return res.status(500).json({ error: "cannot read shops.json" });
  }
  const cat = req.query.category;
  if (cat) shops = shops.filter(s => s.category === cat);
  res.set("X-Data-As-Of", new Date().toISOString());
  res.set("X-Cache-Status", "own-only");
  res.json(shops);
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log("listening on " + PORT));
