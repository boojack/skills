import assert from "node:assert/strict"
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises"
import { spawnSync } from "node:child_process"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const testDir = path.dirname(fileURLToPath(import.meta.url))
const skillDir = path.resolve(testDir, "..")
const scriptsDir = path.join(skillDir, "scripts")
const verifier = path.join(scriptsDir, "verify-single-html.mjs")

function run(command, args) {
  return spawnSync(command, args, {
    encoding: "utf8",
  })
}

function completeHtml(body, extraHead = "") {
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    ${extraHead}
  </head>
  <body>${body}</body>
</html>
`
}

test("skill identity matches its directory and requires explicit activation", async () => {
  const skillSource = await readFile(path.join(skillDir, "SKILL.md"), "utf8")

  assert.equal(path.basename(skillDir), "ui-prototype")
  assert.match(skillSource, /^name: ui-prototype$/m)
  assert.match(skillSource, /Use only when\s+the user explicitly invokes or names/)
  assert.match(skillSource, /Never activate automatically/)
  assert.match(skillSource, /\$ui-prototype/)
  assert.match(skillSource, /\/ui-prototype/)
})

test("every bundled script exposes --help", () => {
  const scripts = [
    ["bash", [path.join(scriptsDir, "init-project.sh"), "--help"]],
    ["bash", [path.join(scriptsDir, "configure-project.sh"), "--help"]],
    ["bash", [path.join(scriptsDir, "build-single-html.sh"), "--help"]],
    [process.execPath, [path.join(scriptsDir, "configure-project.mjs"), "--help"]],
    [process.execPath, [path.join(scriptsDir, "serve-single-html.mjs"), "--help"]],
    [process.execPath, [verifier, "--help"]],
  ]

  for (const [command, args] of scripts) {
    const result = run(command, args)
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /Usage:/)
  }
})

test("init dry-run does not create the target", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "single-html-init-test-"))
  const target = path.join(root, "demo")
  const result = run("bash", [
    path.join(scriptsDir, "init-project.sh"),
    target,
    "nova",
    "--dry-run",
  ])

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Dry run: no files will be written/)
  assert.equal(
    run(process.execPath, ["-e", `process.exit(require("node:fs").existsSync(${JSON.stringify(target)}) ? 1 : 0)`]).status,
    0
  )
})

test("init refuses Git worktree targets without explicit permission", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "ui-prototype-git-test-"))
  const gitResult = run("git", ["init", "--quiet", root])
  assert.equal(gitResult.status, 0, gitResult.stderr)

  const target = path.join(root, "demo")
  const rejected = run("bash", [
    path.join(scriptsDir, "init-project.sh"),
    target,
    "--dry-run",
  ])
  assert.notEqual(rejected.status, 0)
  assert.match(rejected.stderr, /refusing to create prototype files inside a Git worktree/)

  const allowed = run("bash", [
    path.join(scriptsDir, "init-project.sh"),
    target,
    "--dry-run",
    "--allow-repo",
  ])
  assert.equal(allowed.status, 0, allowed.stderr)
  assert.match(allowed.stdout, /Dry run: no files will be written/)
})

test("build and Vite overlay keep implicit output outside the project", async () => {
  const buildSource = await readFile(
    path.join(scriptsDir, "build-single-html.sh"),
    "utf8"
  )
  const configureSource = await readFile(
    path.join(scriptsDir, "configure-project.mjs"),
    "utf8"
  )

  assert.match(buildSource, /ui-prototype-build\.XXXXXX/)
  assert.match(buildSource, /ui-prototype-output\.XXXXXX/)
  assert.doesNotMatch(buildSource, /OUTPUT_PATH="\$PROJECT_DIR\/bundle\.html"/)
  assert.match(configureSource, /UI_PROTOTYPE_BUILD_DIR is required/)
  assert.match(configureSource, /outDir: outputDirectory/)
  assert.doesNotMatch(configureSource, /outDir: "\.single-html"/)
})

test("configure dry-run validates without modifying the project", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "single-html-config-test-"))
  const packagePath = path.join(root, "package.json")
  const originalPackage = {
    name: "fixture",
    private: true,
    scripts: {},
    dependencies: {
      "@base-ui/react": "1.6.0",
      "@tailwindcss/vite": "4.3.3",
      react: "19.2.8",
      shadcn: "4.16.0",
      tailwindcss: "4.3.3",
      vite: "8.1.5",
    },
  }

  await writeFile(packagePath, `${JSON.stringify(originalPackage, null, 2)}\n`)
  await writeFile(
    path.join(root, "components.json"),
    `${JSON.stringify({ style: "base-nova" }, null, 2)}\n`
  )
  await writeFile(
    path.join(root, "index.html"),
    completeHtml("", '<link rel="icon" href="/vite.svg"><title>vite-app</title>')
  )

  const result = run("bash", [
    path.join(scriptsDir, "configure-project.sh"),
    root,
    "--dry-run",
  ])

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Dry run complete\. No files were written\./)
  assert.deepEqual(
    JSON.parse(await readFile(packagePath, "utf8")),
    originalPackage
  )
  assert.equal(
    run(process.execPath, [
      "-e",
      `process.exit(require("node:fs").existsSync(${JSON.stringify(path.join(root, "vite.singlefile.config.ts"))}) ? 1 : 0)`,
    ]).status,
    0
  )
})

test("verifier accepts one embedded HTML and copies it", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "single-html-pass-test-"))
  const buildDir = path.join(root, "build")
  const outputPath = path.join(root, "bundle.html")
  await mkdir(buildDir)
  await writeFile(
    path.join(buildDir, "index.html"),
    completeHtml(
      '<img alt="dot" src="data:image/svg+xml,%3Csvg%3E%3C/svg%3E">',
      '<link rel="icon" href="data:,"><style>body{background:url("data:image/png;base64,AA==")}</style>'
    )
  )

  const result = run(process.execPath, [verifier, buildDir, outputPath])
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Single-file verification passed/)
  assert.match(await readFile(outputPath, "utf8"), /data:image\/svg\+xml/)
})

test("verifier rejects sibling files and external resources", async () => {
  const siblingRoot = await mkdtemp(
    path.join(tmpdir(), "single-html-sibling-test-")
  )
  await writeFile(
    path.join(siblingRoot, "index.html"),
    completeHtml("<main>App</main>")
  )
  await writeFile(path.join(siblingRoot, "app.js"), "console.log('extra')")

  const siblingResult = run(process.execPath, [verifier, siblingRoot])
  assert.notEqual(siblingResult.status, 0)
  assert.match(siblingResult.stderr, /Expected only index\.html/)

  const externalRoot = await mkdtemp(
    path.join(tmpdir(), "single-html-external-test-")
  )
  await writeFile(
    path.join(externalRoot, "index.html"),
    completeHtml('<img src="https://example.com/image.png">')
  )

  const externalResult = run(process.execPath, [verifier, externalRoot])
  assert.notEqual(externalResult.status, 0)
  assert.match(externalResult.stderr, /image src/)
})
