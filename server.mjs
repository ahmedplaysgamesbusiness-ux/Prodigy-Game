import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { createServer } from "node:http";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 8000);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function safePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const filePath = normalize(join(root, requestedPath));
  return filePath.startsWith(root) ? filePath : join(root, "index.html");
}

function sendFile(response, filePath) {
  const type = contentTypes[extname(filePath)] || "application/octet-stream";
  response.writeHead(200, { "Content-Type": type });
  createReadStream(filePath).pipe(response);
}

createServer((request, response) => {
  const requestedFile = safePath(request.url || "/");
  const fallbackFile = join(root, "index.html");
  const fileToServe = existsSync(requestedFile) && statSync(requestedFile).isFile()
    ? requestedFile
    : fallbackFile;

  sendFile(response, fileToServe);
}).listen(port, () => {
  console.log(`Arcane Math Quest is running at http://localhost:${port}`);
});
