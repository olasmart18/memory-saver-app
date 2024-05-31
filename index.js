const fs = require("fs");
const http = require("http");
const url = require("url");
const auth = require("./auth");

// Initialize memories array
let memories = [];

// create server usiing http 
const server = http.createServer((req, res) => {
    try{
        const parsedUrl = url.parse(req.url, true);
  // Middleware to check authentication
  auth(req, res, () => {
    if (req.method === "POST" && parsedUrl.pathname === "/memories") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const newMemory = JSON.parse(body);
        const id = Math.random().toString(36).substr(2, 9); // Generate random id
        newMemory.id = id;
        // push new memories to array
        memories.push(newMemory);
        // add new array to json storage file.
        fs.writeFileSync("common.json", JSON.stringify(memories));
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newMemory));
      });
    } else if (req.method === "GET" && parsedUrl.pathname === "/memories") {
      // Load memories from JSON file if exists
      if (fs.existsSync("common.json")) {
        const data = fs.readFileSync("common.json");
        memories = JSON.parse(data);
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(memories));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Page not found");
    }
  });
    } catch (error) {
        console.log(error);
    }
});

    server.listen(3000, () => {
        console.log("Server is running on port 3000");
      });
