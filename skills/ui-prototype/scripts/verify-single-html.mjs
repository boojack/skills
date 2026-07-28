#!/usr/bin/env node

import { copyFile, mkdir, readFile, readdir, stat } from "node:fs/promises"
import { createHash } from "node:crypto"
import path from "node:path"
import process from "node:process"

const [buildArg, outputArg] = process.argv.slice(2)

if (buildArg === "-h" || buildArg === "--help") {
  console.log(`Usage:
  node scripts/verify-single-html.mjs <build-directory> [output.html]

Require a build directory containing only index.html, reject non-embedded
runtime resource references, and optionally copy the verified HTML.

Example:
  node scripts/verify-single-html.mjs /tmp/ui-prototype-build.abc123 /tmp/ui-prototype-output.abc123/ui-prototype.html`)
  process.exit(0)
}

if (!buildArg) {
  console.error(
    "Usage: node verify-single-html.mjs <build-directory> [output.html]"
  )
  process.exit(1)
}

const buildDir = path.resolve(buildArg)
const outputPath = outputArg ? path.resolve(outputArg) : null

async function listFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const relativePath = path.join(prefix, entry.name)
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolutePath, relativePath)))
    } else if (entry.isFile()) {
      files.push(relativePath)
    }
  }

  return files.sort()
}

const files = await listFiles(buildDir)
if (files.length !== 1 || files[0] !== "index.html") {
  throw new Error(
    "Single-file verification failed. Expected only index.html, found: " +
      (files.length ? files.join(", ") : "(no files)")
  )
}

const sourcePath = path.join(buildDir, "index.html")
const html = await readFile(sourcePath, "utf8")

if (!/<!doctype html>/i.test(html) || !/<body\b/i.test(html)) {
  throw new Error("Output is not a complete HTML document.")
}

function isEmbeddedReference(reference) {
  const value = reference.trim()
  return (
    value === "" ||
    value.startsWith("#") ||
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    value === "about:blank"
  )
}

const violations = []

const attributeRules = [
  ["script src", /<script\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1/gi, 2],
  ["image src", /<(?:img|image|input)\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1/gi, 2],
  ["media src", /<(?:audio|video|source|track|embed|iframe)\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1/gi, 2],
  ["video poster", /<video\b[^>]*\bposter\s*=\s*(["'])(.*?)\1/gi, 2],
  ["object data", /<object\b[^>]*\bdata\s*=\s*(["'])(.*?)\1/gi, 2],
  ["SVG href", /<(?:use|image)\b[^>]*\b(?:href|xlink:href)\s*=\s*(["'])(.*?)\1/gi, 2],
  ["source srcset", /<(?:img|source)\b[^>]*\bsrcset\s*=\s*(["'])(.*?)\1/gi, 2],
]

for (const [label, pattern, capture] of attributeRules) {
  for (const match of html.matchAll(pattern)) {
    const reference = match[capture]
    if (!isEmbeddedReference(reference)) {
      violations.push(`${label}: ${reference}`)
    }
  }
}

for (const match of html.matchAll(/<link\b([^>]*)>/gi)) {
  const attributes = match[1]
  const relMatch = attributes.match(/\brel\s*=\s*(["'])(.*?)\1/i)
  const hrefMatch = attributes.match(/\bhref\s*=\s*(["'])(.*?)\1/i)
  if (!hrefMatch) continue

  const rel = relMatch?.[2]?.toLowerCase() ?? ""
  const resourceRelations = new Set([
    "stylesheet",
    "icon",
    "manifest",
    "modulepreload",
    "preload",
  ])

  if (
    rel
      .split(/\s+/)
      .some((relation) => resourceRelations.has(relation)) &&
    !isEmbeddedReference(hrefMatch[2])
  ) {
    violations.push(`link ${rel}: ${hrefMatch[2]}`)
  }
}

const inlineStyles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
  .map((match) => match[1])
  .join("\n")

for (const match of inlineStyles.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
  if (!isEmbeddedReference(match[2])) {
    violations.push(`CSS url(): ${match[2]}`)
  }
}

for (const match of inlineStyles.matchAll(
  /@import\s+(?:url\()?["']([^"']+)["']/gi
)) {
  if (!isEmbeddedReference(match[1])) {
    violations.push(`CSS @import: ${match[1]}`)
  }
}

if (violations.length > 0) {
  throw new Error(
    "Single-file verification found external resource references:\n- " +
      [...new Set(violations)].join("\n- ")
  )
}

const fileStats = await stat(sourcePath)
const sha256 = createHash("sha256").update(html).digest("hex")

if (outputPath && outputPath !== sourcePath) {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await copyFile(sourcePath, outputPath)
}

console.log("Single-file verification passed.")
console.log(`Bytes: ${fileStats.size}`)
console.log(`SHA-256: ${sha256}`)
if (outputPath) {
  console.log(`Output: ${outputPath}`)
}
