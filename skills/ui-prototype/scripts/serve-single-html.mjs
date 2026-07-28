#!/usr/bin/env node

import { access, readFile } from "node:fs/promises"
import { constants } from "node:fs"
import { createServer } from "node:http"
import path from "node:path"
import process from "node:process"

const [htmlArg, portArg = "4173"] = process.argv.slice(2)

if (htmlArg === "-h" || htmlArg === "--help") {
  console.log(`Usage:
  node scripts/serve-single-html.mjs <bundle.html> [port]

Serve only the supplied HTML on 127.0.0.1 for Playwright verification.
The default port is 4173.

Example:
  node scripts/serve-single-html.mjs /tmp/ui-prototype-output.abc123/ui-prototype.html 4173`)
  process.exit(0)
}

if (!htmlArg) {
  console.error(
    "Usage: node serve-single-html.mjs <bundle.html> [port]"
  )
  process.exit(1)
}

const htmlPath = path.resolve(htmlArg)
const port = Number(portArg)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`Error: invalid port '${portArg}'.`)
  process.exit(1)
}

try {
  await access(htmlPath, constants.R_OK)
} catch {
  console.error(`Error: HTML file is not readable: ${htmlPath}`)
  process.exit(1)
}

const html = await readFile(htmlPath)
const fileRoute = `/${encodeURIComponent(path.basename(htmlPath))}`

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1")

  if (requestUrl.pathname === "/" || requestUrl.pathname === fileRoute) {
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Length": html.byteLength,
      "Content-Type": "text/html; charset=utf-8",
    })
    response.end(html)
    return
  }

  if (requestUrl.pathname === "/favicon.ico") {
    response.writeHead(204, {
      "Cache-Control": "no-store",
    })
    response.end()
    return
  }

  response.writeHead(404, {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8",
  })
  response.end("Not found")
})

server.on("error", (error) => {
  console.error(`Server error: ${error.message}`)
  process.exitCode = 1
})

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving: ${htmlPath}`)
  console.log(`URL: http://127.0.0.1:${port}/`)
  console.log(`PID: ${process.pid}`)
})

function shutdown() {
  server.close((error) => {
    if (error) {
      console.error(`Shutdown error: ${error.message}`)
      process.exitCode = 1
    }
  })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
