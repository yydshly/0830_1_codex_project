import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const errors = [];

const required = [
  "README.md",
  "index.md",
  "_config.yml",
  "projects/README.md",
  "projects/index.md",
  "projects/project-template/README.md",
  "projects/project-template/index.md",
  "docs/research-guide/README.md",
  "docs/decisions/README.md",
  ".github/workflows/quality.yml",
  ".github/workflows/pages.yml"
];

for (const relativePath of required) {
  if (!existsSync(join(root, relativePath))) {
    errors.push("Missing required path: " + relativePath);
  }
}

const rootReadmePath = join(root, "README.md");
if (existsSync(rootReadmePath)) {
  const rootReadme = readFileSync(rootReadmePath, "utf8");
  const start = rootReadme.indexOf("<!-- research-index:start -->");
  const end = rootReadme.indexOf("<!-- research-index:end -->");
  if (start < 0 || end < 0 || start >= end) {
    errors.push("README.md must contain an ordered research-index marker pair.");
  }
}

const projectsPath = join(root, "projects");
if (existsSync(projectsPath)) {
  const projectDirectories = readdirSync(projectsPath)
    .filter((name) => statSync(join(projectsPath, name)).isDirectory())
    .filter((name) => !name.startsWith("."));

  for (const name of projectDirectories) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      errors.push("Project directory must use lowercase kebab-case: projects/" + name);
    }

    for (const entry of ["README.md", "index.md"]) {
      const relativePath = join("projects", name, entry);
      if (!existsSync(join(root, relativePath))) {
        errors.push("Project is missing " + entry + ": projects/" + name);
      }
    }

    const pagePath = join(projectsPath, name, "index.md");
    if (existsSync(pagePath)) {
      const page = readFileSync(pagePath, "utf8");
      if (!page.includes("{% include_relative README.md %}")) {
        errors.push("Project Pages entry must include README.md: projects/" + name + "/index.md");
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Repository validation failed:");
  for (const error of errors) {
    console.error("- " + error);
  }
  process.exit(1);
}

console.log("Repository structure is valid.");
