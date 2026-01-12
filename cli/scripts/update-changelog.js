#!/usr/bin/env node

/**
 * Update CHANGELOG.md by generating changelog entries from git commit history
 * using conventional-changelog, then inserting them as a new version section
 * while keeping the [Unreleased] section empty.
 *
 * This script is called from the Makefile's publish-cli target.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get version from package.json
const packageJson = require('../package.json');
const version = packageJson.version;

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Generate changelog entries using conventional-changelog
console.log(`📝 Generating changelog for version ${version} (${today})...`);

// Get the previous version tag
let previousTag;
try {
  const tags = execSync('git tag --sort=-version:refname', { encoding: 'utf8' }).trim().split('\n');
  previousTag = tags.find(tag => tag.startsWith('v') && !tag.includes('-'));
} catch (error) {
  console.warn('⚠️  Could not get previous git tag:', error.message);
}

let generatedChangelog;
try {
  if (previousTag) {
    // Get commits since the last tag
    const cwd = path.resolve(__dirname, '..');
    
    const commits = execSync(
      `git log ${previousTag}..HEAD --pretty=format:"%s%n%b"`,
      { cwd, encoding: 'utf8' }
    ).trim();

    if (!commits) {
      console.log('⚠️  No changes detected since last release.');
      process.exit(0);
    }

    // Parse commits manually to generate changelog
    const parsed = parseCommits(commits);
    generatedChangelog = formatChangelog(parsed);
  } else {
    // No previous tags - generate all changelog
    generatedChangelog = execSync(
      'npx conventional-changelog -p angular --first-release',
      { cwd: path.join(__dirname, '..'), encoding: 'utf8' }
    ).trim();
  }
} catch (error) {
  console.error('❌ Failed to generate changelog from commit history:', error.message);
  process.exit(1);
}

// Helper function to parse commits
function parseCommits(commits) {
  const features = [];
  const fixes = [];
  const others = [];

  const lines = commits.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Parse conventional commit format
    const match = trimmed.match(/^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)(\(.+\))?:\s+(.+)/);
    if (match) {
      const [, type, , message] = match;
      switch (type) {
        case 'feat':
          features.push(message);
          break;
        case 'fix':
          fixes.push(message);
          break;
        default:
          others.push(`${type}: ${message}`);
      }
    }
  }

  return { features, fixes, others };
}

// Helper function to format changelog
function formatChangelog(parsed) {
  let content = '';

  if (parsed.features.length > 0) {
    content += '### Features\n\n';
    parsed.features.forEach(f => {
      content += `- ${f}\n`;
    });
    content += '\n';
  }

  if (parsed.fixes.length > 0) {
    content += '### Fixes\n\n';
    parsed.fixes.forEach(f => {
      content += `- ${f}\n`;
    });
    content += '\n';
  }

  if (parsed.others.length > 0) {
    content += '### Other Changes\n\n';
    parsed.others.forEach(o => {
      content += `- ${o}\n`;
    });
    content += '\n';
  }

  return content.trim();
}

if (!generatedChangelog) {
  console.log('⚠️  No changes detected in commit history.');
  // Exit gracefully - no changes to add
  process.exit(0);
}

// Read existing CHANGELOG.md
const changelogPath = path.join(__dirname, '../CHANGELOG.md');
let changelogContent;
try {
  changelogContent = fs.readFileSync(changelogPath, 'utf8');
} catch (error) {
  console.error('❌ Failed to read CHANGELOG.md:', error.message);
  process.exit(1);
}

// Find the [Unreleased] section
const unreleasedHeader = '## [Unreleased]';
const unreleasedIndex = changelogContent.indexOf(unreleasedHeader);
if (unreleasedIndex === -1) {
  console.error('❌ [Unreleased] section not found in CHANGELOG.md');
  process.exit(1);
}

// Find the line after the [Unreleased] section (including its empty content)
// We'll insert the new version after the [Unreleased] section and before the next version.
// First, find the start of the next version section (like "## [0.2.5] - 2026-01-12")
const versionRegex = /^## \[\d+\.\d+\.\d+\] - \d{4}-\d{2}-\d{2}/m;
const afterUnreleased = changelogContent.substring(unreleasedIndex);
const match = versionRegex.exec(afterUnreleased);
let insertIndex;
if (match) {
  // Found an existing version section after [Unreleased]
  insertIndex = unreleasedIndex + match.index;
} else {
  // No existing version after [Unreleased] (should not happen)
  // Insert at the end of the file
  insertIndex = changelogContent.length;
}

// Build the new version section
const newVersionHeader = `## [${version}] - ${today}`;
const newSection = `${newVersionHeader}\n\n${generatedChangelog}\n\n---\n\n`;

// Insert the new section
const updatedChangelog =
  changelogContent.slice(0, insertIndex) +
  newSection +
  changelogContent.slice(insertIndex);

// Write back to file
try {
  fs.writeFileSync(changelogPath, updatedChangelog);
  console.log(`✅ Added changelog entries for version ${version} to CHANGELOG.md`);
} catch (error) {
  console.error('❌ Failed to write CHANGELOG.md:', error.message);
  process.exit(1);
}
