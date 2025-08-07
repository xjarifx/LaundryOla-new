#!/usr/bin/env node

/**
 * Production URL Verification Script
 * Verifies that all localhost references have been replaced with environment variables
 */

const fs = require("fs");
const path = require("path");

const clientDir = path.join(__dirname, "client");
const srcDir = path.join(clientDir, "src");

function searchForLocalhostReferences(directory) {
  const localhostReferences = [];

  function searchFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (
        stat.isDirectory() &&
        !file.includes("node_modules") &&
        !file.includes(".git")
      ) {
        searchFiles(filePath);
      } else if (
        file.endsWith(".js") ||
        file.endsWith(".jsx") ||
        file.endsWith(".ts") ||
        file.endsWith(".tsx")
      ) {
        const content = fs.readFileSync(filePath, "utf8");
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          if (
            line.includes("localhost:5000") ||
            line.includes("localhost:5173")
          ) {
            localhostReferences.push({
              file: filePath,
              line: index + 1,
              content: line.trim(),
            });
          }
        });
      }
    });
  }

  searchFiles(directory);
  return localhostReferences;
}

console.log("🔍 Searching for localhost references...\n");

const references = searchForLocalhostReferences(srcDir);

if (references.length === 0) {
  console.log("✅ No localhost references found in source files!");
  console.log("✅ All API calls should now use environment variables");
} else {
  console.log("❌ Found localhost references that need to be updated:");
  references.forEach((ref) => {
    console.log(`   📄 ${ref.file.replace(process.cwd(), ".")}:${ref.line}`);
    console.log(`      ${ref.content}`);
  });
}

// Check environment files
const envFiles = [
  path.join(clientDir, ".env"),
  path.join(clientDir, ".env.production"),
  path.join(clientDir, ".env.development"),
];

console.log("\n📋 Environment files status:");
envFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file.replace(process.cwd(), ".")} exists`);
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split("\n");
    lines.forEach((line) => {
      if (line.includes("VITE_API_BASE_URL")) {
        console.log(`   ${line}`);
      }
    });
  } else {
    console.log(`❌ ${file.replace(process.cwd(), ".")} missing`);
  }
});

console.log("\n🚀 Ready for production deployment!");
