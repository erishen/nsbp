#!/usr/bin/env node
/**
 * 自动更新 CHANGELOG.md 文件，添加新版本条目
 * 使用：node scripts/update-changelog.js <version> <date>
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// 获取参数
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(chalk.red('❌ 用法: node scripts/update-changelog.js <version> <date>'));
  console.error(chalk.gray('例如: node scripts/update-changelog.js 0.2.6 2026-01-12'));
  process.exit(1);
}

const version = args[0];
const date = args[1];
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

// 验证版本格式
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(chalk.red(`❌ 无效的版本格式: ${version}`));
  console.error(chalk.gray('版本号必须符合语义化版本格式: x.y.z'));
  process.exit(1);
}

// 验证日期格式
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(chalk.red(`❌ 无效的日期格式: ${date}`));
  console.error(chalk.gray('日期必须为 YYYY-MM-DD 格式'));
  process.exit(1);
}

async function updateChangelog() {
  try {
    // 读取现有 CHANGELOG
    let content = await fs.readFile(changelogPath, 'utf8');
    
    // 检查 [Unreleased] 部分
    const unreleasedHeader = '## [Unreleased]';
    const unreleasedIndex = content.indexOf(unreleasedHeader);
    
    if (unreleasedIndex === -1) {
      console.error(chalk.red('❌ 在 CHANGELOG.md 中未找到 [Unreleased] 部分'));
      process.exit(1);
    }
    
    // 查找 [Unreleased] 部分结束的位置（下一个版本标题或文件结束）
    const nextVersionMatch = content.slice(unreleasedIndex).match(/\n## \[/);
    let unreleasedEndIndex;
    
    if (nextVersionMatch) {
      unreleasedEndIndex = unreleasedIndex + nextVersionMatch.index;
    } else {
      unreleasedEndIndex = content.length;
    }
    
    // 提取 [Unreleased] 部分内容（不包括标题）
    const unreleasedSection = content.slice(unreleasedIndex, unreleasedEndIndex);
    const afterHeader = unreleasedSection.slice(unreleasedHeader.length);
    
    // 检查是否有实际内容（除了空白和分隔符）
    const hasContent = afterHeader.trim().length > 0 && 
                      !afterHeader.trim().match(/^---\s*$/);
    
    // 构建新版本条目
    const newEntry = `\n\n## [${version}] - ${date}\n\n### ${hasContent ? 'Changed' : 'No changes documented'}\n\n${hasContent ? afterHeader.trim() : '- **No changes documented in this release**'}\n\n---`;
    
    // 替换 [Unreleased] 部分
    const beforeUnreleased = content.slice(0, unreleasedIndex);
    const afterUnreleased = content.slice(unreleasedEndIndex);
    
    // 新的 [Unreleased] 部分（清空）
    const newUnreleased = `${unreleasedHeader}\n\n---`;
    
    // 组合新内容
    const newContent = beforeUnreleased + newUnreleased + newEntry + afterUnreleased;
    
    // 写入文件
    await fs.writeFile(changelogPath, newContent, 'utf8');
    
    console.log(chalk.green(`✅ CHANGELOG.md 已更新，添加了版本 ${version} (${date})`));
    if (!hasContent) {
      console.log(chalk.yellow('⚠️  [Unreleased] 部分为空，已添加占位符条目'));
      console.log(chalk.gray('   建议在发布前填写实际的变更内容'));
    }
  } catch (error) {
    console.error(chalk.red(`❌ 更新 CHANGELOG.md 失败: ${error.message}`));
    process.exit(1);
  }
}

// 执行
updateChangelog();