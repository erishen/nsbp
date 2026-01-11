#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');

const program = new Command();

program
  .name('nsbp')
  .description('CLI tool to create NSBP (Node React SSR by Webpack) projects')
  .version('0.1.0');

program
  .command('create <project-name>')
  .description('Create a new NSBP project')
  .option('-t, --template <template>', 'Specify template (basic, blog, ecommerce)', 'basic')
  .option('--skip-install', 'Skip npm install')
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
        'webpack.base.js',
        'webpack.client.js', 
        'webpack.server.js',
        'tsconfig.json',
        'postcss.config.js',
        '.prettierrc',
        '.prettierignore',
        '.gitignore',
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
                const excluded = ['node_modules', '.temp_cache', 'build', '.git', '.DS_Store', '.serena'];
                return !excluded.some(ex => src.includes(ex));
              }
            });
          } else {
            fs.copySync(source, target);
          }
        }
      }

      // Create package.json for new project
      const originalPackage = require(path.join(templateSource, 'package.json'));
      const newPackage = {
        name: projectName,
        version: '1.0.0',
        description: `NSBP project: ${projectName}`,
        scripts: originalPackage.scripts,
        dependencies: originalPackage.dependencies,
        devDependencies: originalPackage.devDependencies,
        keywords: originalPackage.keywords,
        author: originalPackage.author,
        license: originalPackage.license
      };

      fs.writeFileSync(
        path.join(targetDir, 'package.json'),
        JSON.stringify(newPackage, null, 2)
      );

      // Optionally install dependencies
      if (!options.skipInstall) {
        console.log(chalk.cyan('📦 Installing dependencies...'));
        process.chdir(targetDir);
        execSync('npm install', { stdio: 'inherit' });
      }

      console.log(chalk.green(`✅ NSBP project "${projectName}" created successfully!`));
      console.log(chalk.yellow('\nNext steps:'));
      console.log(`  cd ${projectName}`);
      if (options.skipInstall) {
        console.log('  npm install');
      }
      console.log('  npm run dev');
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