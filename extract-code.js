/**
 * Node.js script to extract all code files from a specific folder
 * Output file will be created INSIDE the same folder
 *
 * Excludes:
 *  - .env files
 *  - all .md files
 *  - node_modules
 *  - .git
 */

const fs = require('fs');
const path = require('path');

// 👇 INPUT FOLDER (relative to project root)
const TARGET_FOLDER = 'google-calender-assistant'; // change this

const ROOT_DIR = path.resolve(process.cwd(), TARGET_FOLDER);
const OUTPUT_FILE = path.join(ROOT_DIR, 'extracted-code.txt');

// Folders to exclude
const EXCLUDED_DIRS = new Set(['node_modules', '.git']);

// Files to exclude
const EXCLUDED_FILES = [
  /^\.env/, // .env*
  /\.md$/i, // markdown
  /\.gitignore$/i,
  /\.json$/i, // all .json files
  /\.lock$/i, // package-lock.json, pnpm-lock.yaml, etc.
  /\.lockb$/i,
];

// Check file exclusion
function isExcludedFile(fileName) {
  return EXCLUDED_FILES.some((pattern) => pattern.test(fileName));
}

// Recursive directory traversal
function walkDir(dir, collectedFiles = []) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry)) {
        walkDir(fullPath, collectedFiles);
      }
    } else {
      if (!isExcludedFile(entry)) {
        collectedFiles.push(fullPath);
      }
    }
  }

  return collectedFiles;
}

// Main extractor
function extractCode() {
  if (!fs.existsSync(ROOT_DIR) || !fs.statSync(ROOT_DIR).isDirectory()) {
    console.error(`❌ Folder not found: ${ROOT_DIR}`);
    process.exit(1);
  }

  const files = walkDir(ROOT_DIR);
  const writeStream = fs.createWriteStream(OUTPUT_FILE);

  files.forEach((filePath) => {
    // Skip the output file itself
    if (filePath === OUTPUT_FILE) return;

    const relativePath = path.relative(ROOT_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    writeStream.write(`\n\n===== FILE: ${relativePath} =====\n\n`);
    writeStream.write(content);
  });

  writeStream.end();
  console.log(`✅ Code extracted into: ${OUTPUT_FILE}`);
}

extractCode();
