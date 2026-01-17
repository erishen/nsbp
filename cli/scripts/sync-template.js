#!/usr/bin/env node
/**
 * 同步 NSBP 主项目代码到 CLI 模板目录
 * 使用：node scripts/sync-template.js
 */

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

// 路径配置
const ROOT_DIR = path.resolve(__dirname, '../..') // nsbp 项目根目录
const CLI_DIR = path.resolve(__dirname, '..') // cli 目录
const TARGET_DIR = path.join(CLI_DIR, 'templates/basic')

// 要复制的文件和目录列表
const COPY_ITEMS = [
  'src',
  'public',
  'scripts',
  'config',
  'docker',
  'docs',
  '.env.example',
  '.env.development',
  '.env.production',
  'tsconfig.json',
  '.gitignore',
  '.prettierrc',
  '.prettierignore',
  '.prettierrc.js',
  'eslint.config.js',
  '.husky',
  'Makefile',
  'README.md',
  'package.json'
]

// 排除的模式（相对路径包含这些字符串的文件将被跳过）
const EXCLUDE_PATTERNS = [
  '/node_modules/',
  '.temp_cache',
  '/build/',
  '/.git/',
  '.DS_Store',
  '/.serena/',
  '/.vscode/',
  '/.idea/',
  '.log',
  '.tmp',
  // 构建产物 - 匹配 public 下的特定文件
  'public/js/',
  'public/css/',
  'public/client.',
  'public/*.js',
  'public/*.js.map',
  'public/*.txt',
  'public/*.json'
]

// 特殊文件处理配置
const SPECIAL_FILES = {
  'package.json': (content) => {
    const pkg = JSON.parse(content)
    // 修改为模板名称
    pkg.name = 'nsbp-template'
    pkg.description = 'node react ssr by webpack'
    // 确保版本号
    pkg.version = '1.0.0'
    return JSON.stringify(pkg, null, 2)
  },
  'README.md': (content) => {
    // 删除 CLI 发布相关内容
    let lines = content.split('\n')
    let resultLines = []
    let skip = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // 查找 "### CLI 发布" 部分
      if (line.trim().startsWith('### CLI 发布')) {
        skip = true
        continue
      }

      // 如果遇到新的顶级标题（## 或 ###），停止跳过
      if (skip && (line.startsWith('## ') || line.startsWith('### '))) {
        skip = false
        // 跳过被删除的第一个标题行
        continue
      }

      // 如果 skip 为 false，添加行
      if (!skip) {
        resultLines.push(line)
      }
    }

    // 确保文件末尾有结束分隔符和帮助链接
    const lastLine = resultLines[resultLines.length - 1]
    if (!lastLine || !lastLine.includes('NSBP 文档')) {
      // 如果没有帮助链接，添加
      resultLines.push('')
      resultLines.push('---')
      resultLines.push('')
      resultLines.push(
        '如有问题，请参考 [NSBP 文档](https://github.com/erishen/nsbp)。'
      )
    }

    // 确保文件末尾没有多余的空行
    while (
      resultLines.length > 0 &&
      resultLines[resultLines.length - 1] === ''
    ) {
      resultLines.pop()
    }

    return resultLines.join('\n')
  },
  Makefile: (content) => {
    // 从 .PHONY 行中移除 publish-cli
    let lines = content.split('\n')
    let resultLines = []
    let skip = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // 处理 .PHONY 行
      if (line.startsWith('.PHONY:')) {
        // 移除 publish-cli 并清理多余的逗号
        const cleaned = line
          .replace(/\s+publish-cli/g, '')
          .replace(/\s*,\s*$/, '')
        resultLines.push(cleaned)
        continue
      }

      // 跳过 publish-cli 目标定义
      if (line.startsWith('publish-cli:')) {
        skip = true
        continue
      }

      // 如果遇到空行，停止跳过（表示目标块结束）
      if (skip && line.trim() === '') {
        skip = false
        // 不添加这个空行，避免多余的空行
        continue
      }

      // 如果 skip 为 false，添加行
      if (!skip) {
        resultLines.push(line)
      }
    }

    // 确保文件末尾没有多余的空行
    while (
      resultLines.length > 0 &&
      resultLines[resultLines.length - 1] === ''
    ) {
      resultLines.pop()
    }

    return resultLines.join('\n')
  }
}

// 主函数
async function syncTemplate() {
  console.log(chalk.cyan('🔄 开始同步 NSBP 主项目代码到 CLI 模板...'))
  console.log(chalk.gray(`源目录: ${ROOT_DIR}`))
  console.log(chalk.gray(`目标目录: ${TARGET_DIR}`))

  // 验证源目录
  if (!fs.existsSync(ROOT_DIR)) {
    console.error(chalk.red(`❌ 源目录不存在: ${ROOT_DIR}`))
    process.exit(1)
  }

  // 清理目标目录（但保留 templates/basic 本身）
  if (fs.existsSync(TARGET_DIR)) {
    console.log(chalk.gray('🧹 清理目标目录...'))
    await fs.emptyDir(TARGET_DIR)
  } else {
    await fs.ensureDir(TARGET_DIR)
  }

  // 复制文件
  console.log(chalk.cyan('📦 复制项目文件...'))
  let copiedCount = 0
  let skippedCount = 0

  for (const item of COPY_ITEMS) {
    const source = path.join(ROOT_DIR, item)
    const target = path.join(TARGET_DIR, item)

    if (!fs.existsSync(source)) {
      console.log(chalk.yellow(`⚠️  源文件不存在，跳过: ${item}`))
      skippedCount++
      continue
    }

    // 检查是否为排除项
    const shouldExclude = EXCLUDE_PATTERNS.some((pattern) => {
      if (pattern.includes('*')) {
        // 简单的通配符匹配（仅支持后缀）
        if (pattern.startsWith('*')) {
          const ext = pattern.substring(1)
          return item.endsWith(ext)
        }
      }
      return item.includes(pattern)
    })

    if (shouldExclude) {
      console.log(chalk.gray(`  跳过排除项: ${item}`))
      skippedCount++
      continue
    }

    try {
      const stat = fs.statSync(source)

      if (stat.isDirectory()) {
        // 复制目录，使用自定义过滤器
        await fs.copy(source, target, {
          filter: (src) => {
            const relativePath = path.relative(source, src)
            // 检查是否匹配排除模式
            for (const pattern of EXCLUDE_PATTERNS) {
              if (relativePath.includes(pattern)) {
                return false
              }
              // 简单的通配符匹配
              if (pattern.includes('*')) {
                const [prefix] = pattern.split('*')
                if (relativePath.startsWith(prefix)) {
                  return false
                }
              }
            }

            // 排除构建产物文件（避免复制 .js, .js.map, .css, .css.map, .txt, .json 等）
            // 仅对 public 目录应用此过滤
            if (item === 'public') {
              const buildArtifactPatterns = [
                '.js.map',
                '.css.map',
                '.js',
                '.css',
                '.txt',
                '.json',
                '.LICENSE.txt'
              ]

              // 只检查文件，不检查目录
              try {
                const stat = fs.statSync(src)
                if (stat.isFile()) {
                  const name = path.basename(src)

                  // 检查构建产物模式
                  for (const pattern of buildArtifactPatterns) {
                    if (name.endsWith(pattern)) {
                      // 但保留 favicon.ico
                      if (name === 'favicon.ico') {
                        return true
                      }
                      return false
                    }
                  }
                }
              } catch (err) {
                // 如果无法获取状态，继续复制
                console.warn(
                  chalk.yellow(`⚠️  无法检查文件状态: ${src}`),
                  err.message
                )
              }
            }

            return true
          }
        })
        console.log(chalk.green(`  目录复制: ${item}`))
      } else {
        // 复制文件
        await fs.copy(source, target)

        // 特殊文件处理
        const basename = path.basename(item)
        if (SPECIAL_FILES[basename]) {
          const content = await fs.readFile(target, 'utf8')
          const processed = SPECIAL_FILES[basename](content)
          await fs.writeFile(target, processed, 'utf8')
          console.log(chalk.green(`  文件处理: ${item} (已模板化)`))
        } else {
          console.log(chalk.green(`  文件复制: ${item}`))
        }
      }
      copiedCount++
    } catch (error) {
      console.error(chalk.red(`❌ 复制失败: ${item}`), error.message)
    }
  }

  // Rename .gitignore to gitignore for npm packaging
  const gitignorePath = path.join(TARGET_DIR, '.gitignore')
  if (fs.existsSync(gitignorePath)) {
    await fs.rename(gitignorePath, path.join(TARGET_DIR, 'gitignore'))
    console.log(chalk.green(`  重命名: .gitignore -> gitignore`))
  }

  // 确保必要的目录存在（即使源目录为空）
  const requiredDirs = ['public/css', 'public/js', 'public/images']
  for (const dir of requiredDirs) {
    const dirPath = path.join(TARGET_DIR, dir)
    if (!fs.existsSync(dirPath)) {
      await fs.ensureDir(dirPath)
      console.log(chalk.gray(`  创建目录: ${dir}`))
    }
  }

  // 清理 public 目录中的构建产物
  console.log(chalk.cyan('🧹 清理构建产物...'))
  const publicDir = path.join(TARGET_DIR, 'public')
  if (fs.existsSync(publicDir)) {
    const items = await fs.readdir(publicDir, { withFileTypes: true })
    for (const item of items) {
      const itemPath = path.join(publicDir, item.name)
      // 删除 .js, .js.map, .txt, .json 文件（但保留 favicon.ico 和目录）
      if (item.isFile()) {
        const ext = path.extname(item.name)
        if (
          ['.js', '.js.map', '.txt', '.json', '.css'].includes(ext) &&
          item.name !== 'favicon.ico'
        ) {
          await fs.remove(itemPath)
          console.log(chalk.gray(`    删除: ${item.name}`))
        }
      }
    }
    // 清理子目录中的文件
    const subDirs = ['css', 'js']
    for (const subDir of subDirs) {
      const subDirPath = path.join(publicDir, subDir)
      if (fs.existsSync(subDirPath)) {
        const subItems = await fs.readdir(subDirPath, { withFileTypes: true })
        for (const subItem of subItems) {
          if (subItem.isFile()) {
            await fs.remove(path.join(subDirPath, subItem.name))
            console.log(chalk.gray(`    删除: ${subDir}/${subItem.name}`))
          }
        }
      }
    }
  }

  // 验证模板完整性
  console.log(chalk.cyan('🔍 验证模板完整性...'))
  const requiredFiles = [
    'src/Routers.tsx',
    'scripts/start.js',
    'package.json',
    'eslint.config.js',
    '.prettierrc.js',
    '.husky/pre-commit'
  ]
  let missingFiles = []

  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(TARGET_DIR, file))) {
      missingFiles.push(file)
    }
  }

  if (missingFiles.length > 0) {
    console.log(chalk.yellow(`⚠️  缺少必要文件: ${missingFiles.join(', ')}`))
  } else {
    console.log(chalk.green('✅ 模板完整性验证通过'))
  }

  console.log(chalk.cyan('\n📊 同步完成'))
  console.log(chalk.green(`   复制文件: ${copiedCount} 个`))
  console.log(chalk.yellow(`   跳过文件: ${skippedCount} 个`))
  console.log(chalk.blue(`   目标目录: ${TARGET_DIR}`))

  if (missingFiles.length > 0) {
    console.log(chalk.yellow('\n⚠️  警告：部分必要文件缺失，请检查源项目'))
  }
}

// 执行
syncTemplate().catch((error) => {
  console.error(chalk.red('❌ 同步过程中发生错误:'), error)
  process.exit(1)
})
