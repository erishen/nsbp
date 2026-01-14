#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');

// Read version from package.json dynamically
const packageJson = require('../package.json');

const program = new Command();

program
  .name('nsbp')
  .description('CLI tool to create NSBP (Node React SSR by Webpack) projects')
  .version(packageJson.version);

program
  .command('create <project-name>')
  .description('Create a new NSBP project')
  .option('-t, --template <template>', 'Specify template (basic, blog, ecommerce)', 'basic')
  .option('--skip-install', 'Skip pnpm install')
  .action(async (projectName, options) => {
    console.log(chalk.cyan(`🚀 Creating NSBP project: ${projectName}`));
    
    try {
      // Check if directory already exists
      const targetDir = path.join(process.cwd(), projectName);
      if (fs.existsSync(targetDir)) {
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: `Directory "${projectName}" already exists. Overwrite?`,
            default: false,
          },
        ]);
        if (!overwrite) {
          console.log(chalk.yellow('Operation cancelled.'));
          process.exit(0);
        }
        fs.removeSync(targetDir);
      }

      // Create project directory
      fs.ensureDirSync(targetDir);

      // Get template source path from built-in templates
      const templateSource = path.join(__dirname, '../templates/basic');
      
      // List of files/directories to copy
      const copyItems = [
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
        '.prettierrc',
        '.prettierignore',
        'gitignore',
        'Makefile',
        'README.md'
      ];

      // Copy each item
      console.log(chalk.cyan('📦 Copying project files...'));
      for (const item of copyItems) {
        const source = path.join(templateSource, item);
        const target = path.join(targetDir, item);
        if (fs.existsSync(source)) {
          if (fs.statSync(source).isDirectory()) {
            fs.copySync(source, target, {
              filter: (src) => {
                // Exclude node_modules, build, .temp_cache, etc.
                // Use relative path to avoid matching parent directory names
                const relativePath = path.relative(source, src);
                const segments = relativePath.split(path.sep);
                const excluded = ['node_modules', '.temp_cache', 'build', '.git', '.DS_Store', '.serena'];
                return !segments.some(seg => excluded.includes(seg));
              }
            });
          } else {
            fs.copySync(source, target);
          }
        }
      }

      // Rename gitignore to .gitignore
      const gitignorePath = path.join(targetDir, 'gitignore');
      if (fs.existsSync(gitignorePath)) {
        fs.renameSync(gitignorePath, path.join(targetDir, '.gitignore'));
      }

      // Create package.json for new project
      const originalPackage = require(path.join(templateSource, 'package.json'));
      const newPackage = {
        ...originalPackage,
        name: projectName,
        version: '1.0.0',
        description: `NSBP project: ${projectName}`
      };

      fs.writeFileSync(
        path.join(targetDir, 'package.json'),
        JSON.stringify(newPackage, null, 2)
      );

      // Remove package-lock.json if exists (use pnpm instead)
      const packageLockPath = path.join(targetDir, 'package-lock.json');
      if (fs.existsSync(packageLockPath)) {
        fs.removeSync(packageLockPath);
      }

      // Create .npmignore to prevent package-lock.json from being committed
      const npmignorePath = path.join(targetDir, '.npmignore');
      if (!fs.existsSync(npmignorePath)) {
        fs.writeFileSync(npmignorePath, 'package-lock.json\n');
      }

      // Optionally install dependencies
      if (!options.skipInstall) {
        // Check if pnpm is available
        try {
          execSync('which pnpm', { stdio: 'ignore' });
        } catch {
          console.error(chalk.red('❌ pnpm is not installed or not available in PATH.'));
          console.error(chalk.yellow('Please install pnpm before continuing:'));
          console.error(chalk.cyan('  npm install -g pnpm'));
          console.error(chalk.yellow('Or use --skip-install flag to skip dependency installation.'));
          process.exit(1);
        }
        
        console.log(chalk.cyan('📦 Installing dependencies...'));
        process.chdir(targetDir);
        execSync('pnpm install', { stdio: 'inherit' });
      }

      console.log(chalk.green(`✅ NSBP project "${projectName}" created successfully!`));
      console.log(chalk.yellow('\nNext steps:'));
      console.log(`  cd ${projectName}`);
      if (options.skipInstall) {
        console.log('  pnpm install');
      }
      console.log('  pnpm run dev');
      console.log(chalk.cyan('\nHappy coding! 🎉'));

    } catch (error) {
      console.error(chalk.red(`❌ Error creating project: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('info')
  .description('Display information about NSBP')
  .action(() => {
    console.log(chalk.cyan('NSBP - Node React SSR by Webpack'));
    console.log(chalk.gray('A lightweight React SSR framework with full Webpack control.'));
    console.log('');
    console.log(chalk.yellow('Key Features:'));
    console.log('  • ~60% less resource usage than Next.js');
    console.log('  • Full Webpack configuration control');
    console.log('  • TypeScript support out of the box');
    console.log('  • Built-in image service');
    console.log('');
    console.log(chalk.cyan('Website: ') + 'https://github.com/nsbp/nsbp');
    console.log(chalk.cyan('Usage:   ') + 'nsbp create my-app');
  });

// Parse command line arguments
program.parse();