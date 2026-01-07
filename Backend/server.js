const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const LRUCache = require("./lruCache.js");

const app = express();
let cache = null; 

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../Frontend")));

// Set cache capacity
app.post("/setCapacity", (req, res) => {
    const { capacity } = req.body;
    if (!capacity || capacity <= 0) return res.status(400).json({ error: "Invalid capacity" });
    cache = new LRUCache(capacity);
    return res.json({ message: `Cache capacity set to ${capacity}` });
});

// PUT
app.post("/put", (req, res) => {
    if (!cache) return res.status(400).json({ error: "Set cache capacity first" });
    const { key, value } = req.body;
    if (key === undefined || value === undefined) return res.status(400).json({ error: "Invalid key/value" });
    cache.put(key, value);
    res.json({ message: `Inserted (${key}, ${value})`, cache: cache.getCacheState() });
});

// GET
app.get("/get/:key", (req, res) => {
    if (!cache) return res.status(400).json({ error: "Set cache capacity first" });
    const key = Number(req.params.key);
    const value = cache.get(key);
    res.json({ key, value, cache: cache.getCacheState() });
});

// DELETE
app.delete("/delete/:key", (req, res) => {
    if (!cache) return res.status(400).json({ error: "Set cache capacity first" });
    const key = Number(req.params.key);
    if (!cache.mp.has(key)) return res.status(404).json({ error: "Key not found" });
    const node = cache.mp.get(key);
    cache.delete(node);
    cache.mp.delete(key);
    res.json({ message: `Deleted key ${key}`, cache: cache.getCacheState() });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

app.listen(8080, () => console.log("Server running at http://localhost:8080"));
