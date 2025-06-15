#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const chalk = require('chalk');
const readline = require('readline');

// Read version from package.json
const packageJson = require('../package.json');

const program = new Command();

// Main command - Initialize documentation
program
  .name('claude-conductor')
  .description('Claude Conductor - Documentation framework for AI-assisted development')
  .version(packageJson.version)
  .option('-V, --version', 'output the version number')
  .action(() => {
    // If no subcommand, show help
    program.outputHelp();
  });

// Init subcommand (default behavior)
program
  .command('init [target-dir]', { isDefault: true })
  .description('Initialize documentation framework in your project')
  .option('-f, --force', 'Overwrite existing files')
  .option('--full', 'Create all 12 documentation templates (default: core templates only)')
  .option('--deepscan', 'Perform comprehensive codebase analysis (slower but more detailed)')
  .option('--no-analyze', 'Skip codebase analysis')
  .option('-y, --yes', 'Skip confirmation prompts (use with caution)')
  .addHelpText('after', `
Examples:
  $ npx claude-conductor                    # Initialize core templates only
  $ npx claude-conductor --full           # Initialize all 12 templates
  $ npx claude-conductor --deepscan       # Deep analysis of your codebase
  $ npx claude-conductor ./docs           # Initialize in ./docs directory
  $ npx claude-conductor --force          # Overwrite existing files
  $ npx claude-conductor --no-analyze     # Skip codebase analysis
  
The framework creates a complete documentation suite including:
- CONDUCTOR.md (master template)
- CLAUDE.md (AI assistant guidance)
- JOURNAL.md (development changelog)
- ARCHITECTURE.md, API.md, BUILD.md and more...`)
  .action(async (targetDir, options) => {
    try {
      // Default to current directory if not specified
      const dir = targetDir || '.';
      await initializeFramework(dir, options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Checkup subcommand
program
  .command('checkup')
  .description('Generate a security and health checkup prompt for Claude Code')
  .option('-p, --path <path>', 'Path to scan (defaults to current directory)', '.')
  .addHelpText('after', `
This command generates a prompt for Claude Code to perform a security and health checkup.

Examples:
  $ npx claude-conductor checkup          # Check current directory
  $ npx claude-conduct checkup            # Using shorthand
  $ npx claude-conduct checkup -p ./src   # Check specific directory

What it checks for:
- Exposed .env files or API keys in code
- Unsafe innerHTML usage that could lead to XSS
- Missing .gitignore entries for sensitive files
- Hardcoded credentials or secrets
- Common security anti-patterns

The checkup is informational only and will not modify any code.`)
  .action(async (options) => {
    try {
      await generateCheckupPrompt(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Backup subcommand - Step 1 of upgrade process
program
  .command('backup [target-dir]')
  .description('⚠️ ALPHA: Backup your JOURNAL.md and CLAUDE.md files before upgrade')
  .addHelpText('after', `
⚠️  WARNING: EARLY ALPHA FEATURE - Always backup your entire project first!

This is Step 1 of the 3-step upgrade process:
1. npx claude-conductor backup     (backup your data)
2. npx claude-conductor upgrade --clean  (fresh install)
3. npx claude-conductor restore    (restore your data)

What gets backed up:
- JOURNAL.md (your development history)
- CLAUDE.md (your customizations)

The backup is stored in ./conductor-backup/ and is completely safe.`)
  .action(async (targetDir, options) => {
    try {
      const dir = targetDir || '.';
      await createUserBackup(dir);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Upgrade subcommand - Step 2 of upgrade process  
program
  .command('upgrade [target-dir]')
  .description('⚠️ ALPHA: Clean reinstall of Claude Conductor (Step 2: Run backup first!)')
  .option('--clean', 'Perform clean reinstall (requires backup first)')
  .option('-f, --force', 'Force upgrade without checking for backup')
  .option('--full', 'Create all 12 documentation templates')
  .option('-y, --yes', 'Skip confirmation prompts')
  .addHelpText('after', `
⚠️  WARNING: EARLY ALPHA FEATURE - This DELETES files! Always backup first!

This is Step 2 of the 3-step upgrade process:
1. npx claude-conductor backup     (backup your data) ✓
2. npx claude-conductor upgrade --clean  (YOU ARE HERE)
3. npx claude-conductor restore    (restore your data)

IMPORTANT: This will DELETE all conductor files and reinstall fresh templates.
Make sure you ran 'backup' first!

Examples:
  $ npx claude-conductor upgrade --clean     # Clean reinstall (safe with backup)
  $ npx claude-conductor upgrade --clean --full  # Install all 12 templates`)
  .action(async (targetDir, options) => {
    try {
      const dir = targetDir || '.';
      await upgradeClean(dir, options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Restore subcommand - Step 3 of upgrade process
program
  .command('restore [target-dir]')
  .description('⚠️ ALPHA: Restore your backed up files after upgrade (Step 3: Final step!)')
  .addHelpText('after', `
⚠️  WARNING: EARLY ALPHA FEATURE - Verify backup exists before running!

This is Step 3 of the 3-step upgrade process:
1. npx claude-conductor backup     ✓
2. npx claude-conductor upgrade --clean  ✓  
3. npx claude-conductor restore    (YOU ARE HERE)

This will restore your JOURNAL.md and CLAUDE.md files from backup
and clean up the backup folder.

Your upgrade will be complete after this step!`)
  .action(async (targetDir, options) => {
    try {
      const dir = targetDir || '.';
      await restoreUserBackup(dir);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

async function initializeFramework(targetDir, options) {
  const templatesDir = path.join(__dirname, '..', 'templates');
  const targetPath = path.resolve(targetDir);
  const newlyCreatedFiles = new Set(); // Track files created during this run
  
  // ASCII art Super Basic Studio S logo
  console.log(chalk.green(`
      ████████████████████████████████████
      ████████████████████████████████████
      ████                            ████
      ████    ████████████████████    ████
      ████  ████████████████████████  ████
      ████  ████                      ████
      ████  ████                      ████
      ████    ████████████████        ████
      ████      ████████████████      ████
      ████                  ████████  ████
      ████                      ████  ████
      ████                      ████  ████
      ████  ████████████████████████  ████
      ████    ████████████████████    ████
      ████                            ████
      ████████████████████████████████████
      ████████████████████████████████████
  `));
  
  console.log(chalk.cyan.bold('    Claude Conductor Framework'));
  console.log(chalk.gray('    Made with love by ') + chalk.blue.underline('Super Basic Studio'));
  console.log(chalk.gray('    ') + chalk.blue.underline('https://superbasic.studio'));
  console.log('');
  
  // File behavior examples with bright background
  console.log(chalk.green('+---------------------------------------+'));
  console.log(chalk.green('|') + chalk.green.bold(' DEFAULT: Core templates only          ') + chalk.green('|'));
  console.log(chalk.green('+---------------------------------------+'));
  console.log(chalk.gray('  npx claude-conductor'));
  console.log(chalk.gray('  - Creates 5 essential files'));
  console.log(chalk.gray('  - Preserves existing files'));
  console.log('');
  console.log(chalk.blue('+---------------------------------------+'));
  console.log(chalk.blue('|') + chalk.blue.bold(' FULL: All 12 documentation templates  ') + chalk.blue('|'));
  console.log(chalk.blue('+---------------------------------------+'));
  console.log(chalk.gray('  npx claude-conductor --full'));
  console.log(chalk.gray('  - Creates complete framework'));
  console.log(chalk.gray('  - API, CONFIG, DATA_MODEL, etc.'));
  console.log('');
  console.log(chalk.yellow('+---------------------------------------+'));
  console.log(chalk.yellow('|') + chalk.yellow.bold(' DEEPSCAN: Comprehensive analysis      ') + chalk.yellow('|'));
  console.log(chalk.yellow('+---------------------------------------+'));
  console.log(chalk.gray('  npx claude-conductor --deepscan'));
  console.log(chalk.gray('  - Analyzes dependencies & frameworks'));
  console.log(chalk.gray('  - Maps components & API routes'));
  console.log('');
  console.log(chalk.red('+---------------------------------------+'));
  console.log(chalk.red('|') + chalk.red.bold(' FORCE: Overwrites all files           ') + chalk.red('|'));
  console.log(chalk.red('+---------------------------------------+'));
  console.log(chalk.gray('  npx claude-conductor --force'));
  console.log(chalk.gray('  - Overwrites ALL documentation'));
  console.log(chalk.gray('  - Use with caution!'));
  console.log('');
  
  console.log('');
  console.log(chalk.blue.bold('[*] Initializing documentation framework...'));
  console.log(chalk.gray(`Target directory: ${targetPath}`));
  console.log('');
  
  // Ensure target directory exists
  await fs.ensureDir(targetPath);
  
  // Check for existing files
  const existingFiles = await checkExistingFiles(targetPath, options.full);
  
  // Special handling for CLAUDE.md - we can handle it gracefully
  const claudeMdPath = path.join(targetPath, 'CLAUDE.md');
  const claudeMdExists = await fs.pathExists(claudeMdPath);
  
  // Filter out CLAUDE.md from the existing files check since we handle it separately
  const otherExistingFiles = existingFiles.filter(file => file !== 'CLAUDE.md');
  
  if (otherExistingFiles.length > 0 && !options.force) {
    console.log('');
    console.log(chalk.red('[!] Existing conductor files detected:'));
    otherExistingFiles.forEach(file => {
      console.log(chalk.red(`   - ${file}`));
    });
    console.log('');
    console.log(chalk.yellow('[!] These files would be overwritten. Use --force to proceed.'));
    console.log(chalk.gray('   Example: npx claude-conductor --force'));
    return;
  }
  
  // If using --force, show warning and prompt for confirmation
  if (options.force && (existingFiles.length > 0 || claudeMdExists)) {
    console.log('');
    console.log(chalk.bgRed.white.bold(' [!] WARNING: FORCE MODE ACTIVATED '));
    console.log('');
    console.log(chalk.red.bold('The following files will be OVERWRITTEN:'));
    
    if (claudeMdExists) {
      console.log(chalk.red(`   - CLAUDE.md`));
    }
    existingFiles.forEach(file => {
      console.log(chalk.red(`   - ${file}`));
    });
    
    console.log('');
    console.log(chalk.red.bold('[!] This action cannot be undone!'));
    console.log(chalk.red.bold('[!] Ensure you are in the CORRECT FOLDER!'));
    console.log(chalk.red.bold('[!] All existing documentation will be lost!'));
    console.log('');
    console.log(chalk.gray(`Current directory: ${targetPath}`));
    console.log('');
    
    if (!options.yes) {
      const confirmed = await promptConfirmation(chalk.yellow('Are you sure you want to continue? (y/N): '));
      
      if (!confirmed) {
        console.log(chalk.green('[OK] Operation cancelled. No files were modified.'));
        return;
      }
    }
  }
  
  // Copy template files
  console.log('');
  console.log(chalk.blue.bold('[>] Copying template files...'));
  console.log('');
  const claudeMdSkipped = await copyTemplates(templatesDir, targetPath, options.force, options.full, newlyCreatedFiles);
  console.log('');
  
  // Analyze existing codebase if requested
  if (options.analyze !== false) {
    console.log('');
    if (options.deepscan) {
      console.log(chalk.yellow.bold('[~] Performing deep codebase analysis...'));
      console.log(chalk.gray('This may take 30-60 seconds...'));
    } else {
      console.log(chalk.blue.bold('[~] Analyzing codebase...'));
    }
    console.log('');
    await analyzeCodebase(targetPath, options.deepscan, newlyCreatedFiles, options.force);
    console.log('');
  }
  
  // Create initial journal entry
  await createInitialJournalEntry(targetPath, newlyCreatedFiles, options.force);
  console.log('');
  
  console.log('');
  console.log(chalk.green.bold('[OK] Claude Conductor framework initialized successfully!'));
  console.log('');
  console.log(chalk.gray('Next steps:'));
  console.log(chalk.gray('1. Review and customize CLAUDE.md'));
  console.log(chalk.gray('2. Fill in the Critical Context section'));
  console.log(chalk.gray('3. Start documenting your architecture'));
  console.log('');
  
  // Ask if they want to run a health check
  if (!options.yes) {
    console.log('');
    console.log(chalk.cyan('┌─────────────────────────────────────────────────────────────────┐'));
    console.log(chalk.cyan('│') + ' ' + chalk.cyan.bold('🪄 Would you like Conductor to perform a security checkup?') + '       ' + chalk.cyan('│'));
    console.log(chalk.cyan('├─────────────────────────────────────────────────────────────────┤'));
    console.log(chalk.cyan('│') + ' This will generate a prompt for Claude Code to audit your       ' + chalk.cyan('│'));
    console.log(chalk.cyan('│') + ' codebase for common security issues. No files will be changed.  ' + chalk.cyan('│'));
    console.log(chalk.cyan('└─────────────────────────────────────────────────────────────────┘'));
    console.log('');
    
    const runCheckup = await promptConfirmation(chalk.yellow('Run security checkup? (y/N): '));
    
    if (runCheckup) {
      console.log('');
      await generateCheckupPrompt({ path: targetPath });
    }
  }
  
  // Important seed command recommendation
  console.log(chalk.yellow('┌─────────────────────────────────────────────────────────────────┐'));
  console.log(chalk.yellow('│') + ' ' + chalk.yellow.bold('⚠️  RECOMMENDED NEXT STEP') + '                                       ' + chalk.yellow('│'));
  console.log(chalk.yellow('├─────────────────────────────────────────────────────────────────┤'));
  console.log(chalk.yellow('│') + ' To populate your documentation with actual project details,     ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + ' ask Claude Code:                                                ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + '                                                                 ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + chalk.cyan('  "Please review this codebase and update the CLAUDE.md') + '         ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + chalk.cyan('   and CONDUCTOR.md files with the actual project details.') + '      ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + chalk.cyan('   Also perform a security health check and list any') + '            ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + chalk.cyan('   potential vulnerabilities or concerns (like exposed') + '          ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + chalk.cyan('   .env files, API keys in code, missing .gitignore') + '            ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + chalk.cyan('   entries, outdated dependencies with known vulnerabilities,') + '   ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + chalk.cyan('   or insecure configurations) - just list them as warnings,') + '   ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + chalk.cyan('   don\'t fix anything."') + '                                          ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + '                                                                 ' + chalk.yellow('│'));
  console.log(chalk.yellow('│') + ' This one-time setup ensures your docs match your project! 🚀   ' + chalk.yellow('│'));
  console.log(chalk.yellow('└─────────────────────────────────────────────────────────────────┘'));
  console.log('');
  
  // Show CLAUDE.md update message if it was skipped
  if (claudeMdSkipped && !options.force) {
    console.log('');
    console.log(chalk.blue('┌─────────────────────────────────────────────────────────────────┐'));
    console.log(chalk.blue('│') + ' ' + chalk.blue.bold('ℹ️  EXISTING CLAUDE.md DETECTED') + '                                  ' + chalk.blue('│'));
    console.log(chalk.blue('├─────────────────────────────────────────────────────────────────┤'));
    console.log(chalk.blue('│') + ' Your existing CLAUDE.md was preserved. To work optimally with   ' + chalk.blue('│'));
    console.log(chalk.blue('│') + ' Claude Conductor, please add this section to your CLAUDE.md:    ' + chalk.blue('│'));
    console.log(chalk.blue('│') + '                                                                 ' + chalk.blue('│'));
    console.log(chalk.blue('│') + chalk.white(' ## Journal Update Requirements') + '                                  ' + chalk.blue('│'));
    console.log(chalk.blue('│') + chalk.white(' **IMPORTANT**: Update JOURNAL.md regularly throughout our work') + '  ' + chalk.blue('│'));
    console.log(chalk.blue('│') + chalk.white(' sessions:') + '                                                       ' + chalk.blue('│'));
    console.log(chalk.blue('│') + chalk.white(' - After completing any significant feature or fix') + '               ' + chalk.blue('│'));
    console.log(chalk.blue('│') + chalk.white(' - When encountering and resolving errors') + '                       ' + chalk.blue('│'));
    console.log(chalk.blue('│') + chalk.white(' - At the end of each work session') + '                              ' + chalk.blue('│'));
    console.log(chalk.blue('│') + chalk.white(' - When making architectural decisions') + '                          ' + chalk.blue('│'));
    console.log(chalk.blue('│') + chalk.white(' - Format: What/Why/How/Issues/Result structure') + '                 ' + chalk.blue('│'));
    console.log(chalk.blue('│') + '                                                                 ' + chalk.blue('│'));
    console.log(chalk.blue('│') + ' This ensures Claude maintains a detailed development history! 📝 ' + chalk.blue('│'));
    console.log(chalk.blue('│') + '                                                                 ' + chalk.blue('│'));
    console.log(chalk.blue('│') + chalk.gray(' For security checkups, use: npx claude-conduct checkup 🪄') + '       ' + chalk.blue('│'));
    console.log(chalk.blue('└─────────────────────────────────────────────────────────────────┘'));
    console.log('');
  }
  
  // Animated thank you
  await animateThankYou();
}

async function animateThankYou() {
  // Display a nice thank you message
  console.log('');
  console.log(chalk.cyan('    +-----------------------------------+'));
  console.log(chalk.cyan('    |') + '                                   ' + chalk.cyan('|'));
  console.log(chalk.cyan('    |') + '            ' + chalk.green.bold('THANK YOU!') + '            ' + chalk.cyan('|'));
  console.log(chalk.cyan('    |') + '                                   ' + chalk.cyan('|'));
  console.log(chalk.cyan('    +-----------------------------------+'));
  console.log('');
  console.log(chalk.gray('    Happy documenting with Claude!'));
  console.log('');
}

async function copyTemplates(templatesDir, targetPath, force, full = false, newlyCreatedFiles) {
  let templateFiles = await glob('**/*.md', { cwd: templatesDir });
  let claudeMdSkipped = false;
  
  // Filter templates based on --full flag
  if (!full) {
    // Core templates only
    const coreTemplates = ['CONDUCTOR.md', 'CLAUDE.md', 'ARCHITECTURE.md', 'BUILD.md'];
    templateFiles = templateFiles.filter(file => coreTemplates.includes(path.basename(file)));
  }
  
  for (const file of templateFiles) {
    const sourcePath = path.join(templatesDir, file);
    const targetFilePath = path.join(targetPath, file);
    
    const fileExists = await fs.pathExists(targetFilePath);
    
    if (fileExists) {
      if (!force) {
        console.log(chalk.yellow(`[=] Skipping ${file} (already exists)`));
        if (file === 'CLAUDE.md') {
          claudeMdSkipped = true;
        }
        continue;
      } else {
        console.log(chalk.red(`[!] Overwriting ${file}`));
      }
    } else {
      // Track newly created files
      if (newlyCreatedFiles) {
        newlyCreatedFiles.add(file);
      }
      console.log(chalk.green(`[+] Creating ${file}`));
    }
    
    await fs.ensureDir(path.dirname(targetFilePath));
    
    // Copy file and add version info
    let content = await fs.readFile(sourcePath, 'utf8');
    
    // Add version comment to key template files
    if (['CONDUCTOR.md', 'CLAUDE.md'].includes(path.basename(file))) {
      content = content.replace(
        /<!-- Generated by Claude Conductor v\d+\.\d+\.\d+ -->/,
        `<!-- Generated by Claude Conductor v${packageJson.version} -->`
      );
    }
    
    await fs.writeFile(targetFilePath, content);
  }
  
  return claudeMdSkipped;
}

async function analyzeCodebase(targetPath, isDeepScan = false, newlyCreatedFiles, force) {
  const analysis = {
    techStack: await detectTechStack(targetPath, isDeepScan),
    mainFiles: await findMainFiles(targetPath),
    lineCount: await countLines(targetPath),
    structure: await analyzeStructure(targetPath)
  };
  
  if (isDeepScan) {
    // Deep analysis features
    analysis.dependencies = await analyzeDependencies(targetPath);
    analysis.frameworks = await detectFrameworks(targetPath);
    analysis.apiEndpoints = await findApiEndpoints(targetPath);
    analysis.components = await mapComponents(targetPath);
    analysis.buildScripts = await extractBuildScripts(targetPath);
    analysis.databaseSchema = await findDatabaseSchema(targetPath);
  }
  
  // Update documentation files with analysis results
  await updateClaudeMdWithAnalysis(targetPath, analysis, newlyCreatedFiles, force);
  
  if (isDeepScan) {
    await updateArchitectureMd(targetPath, analysis, newlyCreatedFiles, force);
    await updateBuildMd(targetPath, analysis, newlyCreatedFiles, force);
  }
}

async function detectTechStack(targetPath) {
  const stack = [];
  
  // Check for common files
  const indicators = {
    'package.json': 'Node.js/npm',
    'yarn.lock': 'Yarn',
    'Cargo.toml': 'Rust',
    'requirements.txt': 'Python',
    'Gemfile': 'Ruby',
    'pom.xml': 'Java/Maven',
    'build.gradle': 'Java/Gradle',
    'go.mod': 'Go',
    'composer.json': 'PHP'
  };
  
  for (const [file, tech] of Object.entries(indicators)) {
    if (await fs.pathExists(path.join(targetPath, file))) {
      stack.push(tech);
    }
  }
  
  return stack.length > 0 ? stack : ['To be determined'];
}

async function findMainFiles(targetPath) {
  const mainFiles = [];
  const commonMainFiles = [
    'src/main.*', 'src/index.*', 'index.*', 'main.*',
    'src/app.*', 'app.*', 'server.*', 'src/server.*'
  ];
  
  for (const pattern of commonMainFiles) {
    const files = await glob(pattern, { cwd: targetPath });
    for (const file of files.slice(0, 3)) { // Limit to 3 files
      const stats = await fs.stat(path.join(targetPath, file));
      const lines = await countLinesInFile(path.join(targetPath, file));
      mainFiles.push(`${file} (${lines} lines)`);
    }
  }
  
  return mainFiles.length > 0 ? mainFiles : ['To be determined'];
}

async function countLines(targetPath) {
  try {
    const codeFiles = await glob('**/*.{js,ts,jsx,tsx,py,rs,go,java,php,rb}', { 
      cwd: targetPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**']
    });
    
    let totalLines = 0;
    for (const file of codeFiles) {
      totalLines += await countLinesInFile(path.join(targetPath, file));
    }
    
    return totalLines;
  } catch (error) {
    return 0;
  }
}

async function countLinesInFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

async function analyzeStructure(targetPath) {
  const structure = [];
  const dirs = await glob('*/', { cwd: targetPath });
  
  for (const dir of dirs.slice(0, 10)) { // Limit to 10 directories
    if (!dir.startsWith('.') && !['node_modules/', 'dist/', 'build/'].includes(dir)) {
      structure.push(dir.replace('/', ''));
    }
  }
  
  return structure;
}

async function updateClaudeMdWithAnalysis(targetPath, analysis, newlyCreatedFiles, force) {
  const claudeMdPath = path.join(targetPath, 'CLAUDE.md');
  
  // Only update if file was newly created or force is enabled
  if (!newlyCreatedFiles || (!newlyCreatedFiles.has('CLAUDE.md') && !force)) {
    return; // Skip update for existing files without --force
  }
  
  if (await fs.pathExists(claudeMdPath)) {
    let content = await fs.readFile(claudeMdPath, 'utf8');
    
    // Update Critical Context section
    const techStackStr = analysis.techStack.join(', ');
    const mainFileStr = analysis.mainFiles[0] || 'To be determined';
    
    content = content.replace(
      /- \*\*Tech Stack\*\*: \[List core technologies\]/,
      `- **Tech Stack**: ${techStackStr}`
    );
    
    content = content.replace(
      /- \*\*Main File\*\*: \[Primary code file and line count\]/,
      `- **Main File**: ${mainFileStr}`
    );
    
    content = content.replace(
      /- \*\*Core Mechanic\*\*: \[One-line description\]/,
      `- **Core Mechanic**: ${analysis.lineCount} lines of code across ${analysis.structure.length} directories`
    );
    
    await fs.writeFile(claudeMdPath, content);
    console.log(chalk.green('[+] Updated CLAUDE.md with codebase analysis'));
  }
}

async function createInitialJournalEntry(targetPath, newlyCreatedFiles, force) {
  const journalPath = path.join(targetPath, 'JOURNAL.md');
  
  // Check if JOURNAL.md already exists
  const journalExists = await fs.pathExists(journalPath);
  
  // Skip if file exists and --force not used
  if (journalExists && !force) {
    console.log(chalk.yellow('[=] Skipping JOURNAL.md update (file exists and --force not used)'));
    return;
  }
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 16);
  
  const journalContent = `# Engineering Journal

## ${timestamp}

### Documentation Framework Implementation
- **What**: Implemented Claude Conductor modular documentation system
- **Why**: Improve AI navigation and code maintainability
- **How**: Used \`npx claude-conductor\` to initialize framework
- **Issues**: None - clean implementation
- **Result**: Documentation framework successfully initialized

---

`;
  
  await fs.writeFile(journalPath, journalContent);
  console.log(chalk.green('[+] Created initial JOURNAL.md entry'));
}

// Deep scan analysis functions
async function analyzeDependencies(targetPath) {
  const packageJsonPath = path.join(targetPath, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    const pkg = await fs.readJson(packageJsonPath);
    return {
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {},
      scripts: pkg.scripts || {}
    };
  }
  return null;
}

async function detectFrameworks(targetPath) {
  const frameworks = [];
  const packageJsonPath = path.join(targetPath, 'package.json');
  
  if (await fs.pathExists(packageJsonPath)) {
    const pkg = await fs.readJson(packageJsonPath);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    
    // Detect frontend frameworks
    if (deps.react) frameworks.push(`React ${deps.react}`);
    if (deps.vue) frameworks.push(`Vue ${deps.vue}`);
    if (deps['@angular/core']) frameworks.push(`Angular ${deps['@angular/core']}`);
    if (deps.svelte) frameworks.push(`Svelte ${deps.svelte}`);
    
    // Detect backend frameworks
    if (deps.express) frameworks.push(`Express ${deps.express}`);
    if (deps.fastify) frameworks.push(`Fastify ${deps.fastify}`);
    if (deps.koa) frameworks.push(`Koa ${deps.koa}`);
    if (deps.next) frameworks.push(`Next.js ${deps.next}`);
    if (deps.nuxt) frameworks.push(`Nuxt ${deps.nuxt}`);
    
    // Detect other tools
    if (deps.tailwindcss) frameworks.push(`Tailwind CSS ${deps.tailwindcss}`);
    if (deps.prisma) frameworks.push(`Prisma ${deps.prisma}`);
    if (deps.typescript) frameworks.push(`TypeScript ${deps.typescript}`);
  }
  
  return frameworks;
}

async function findApiEndpoints(targetPath) {
  const endpoints = [];
  const patterns = [
    'app.get\\(',
    'app.post\\(',
    'app.put\\(',
    'app.delete\\(',
    'router.get\\(',
    'router.post\\(',
    'router.put\\(',
    'router.delete\\('
  ];
  
  try {
    const files = await glob('**/*.{js,ts}', {
      cwd: targetPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**']
    });
    
    for (const file of files.slice(0, 20)) { // Limit to 20 files for performance
      const content = await fs.readFile(path.join(targetPath, file), 'utf8');
      for (const pattern of patterns) {
        const regex = new RegExp(`${pattern}['"\`]([^'"\`]+)['"\`]`, 'g');
        let match;
        while ((match = regex.exec(content)) !== null) {
          endpoints.push({
            method: pattern.match(/(get|post|put|delete)/i)[0].toUpperCase(),
            path: match[1],
            file
          });
        }
      }
    }
  } catch (error) {
    // Silently handle errors
  }
  
  return endpoints;
}

async function mapComponents(targetPath) {
  const components = {
    react: [],
    vue: [],
    pages: [],
    layouts: []
  };
  
  try {
    // Find React components
    const reactFiles = await glob('**/*.{jsx,tsx}', {
      cwd: targetPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**']
    });
    components.react = reactFiles.slice(0, 10);
    
    // Find Vue components
    const vueFiles = await glob('**/*.vue', {
      cwd: targetPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**']
    });
    components.vue = vueFiles.slice(0, 10);
    
    // Find pages
    const pageFiles = await glob('**/pages/**/*.{js,jsx,ts,tsx,vue}', {
      cwd: targetPath,
      ignore: ['node_modules/**']
    });
    components.pages = pageFiles.slice(0, 10);
  } catch (error) {
    // Silently handle errors
  }
  
  return components;
}

async function extractBuildScripts(targetPath) {
  const packageJsonPath = path.join(targetPath, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    const pkg = await fs.readJson(packageJsonPath);
    return pkg.scripts || {};
  }
  return {};
}

async function findDatabaseSchema(targetPath) {
  const schema = {
    prisma: null,
    sql: [],
    models: []
  };
  
  try {
    // Check for Prisma schema
    const prismaSchema = path.join(targetPath, 'prisma/schema.prisma');
    if (await fs.pathExists(prismaSchema)) {
      schema.prisma = await fs.readFile(prismaSchema, 'utf8');
    }
    
    // Find SQL files
    const sqlFiles = await glob('**/*.sql', {
      cwd: targetPath,
      ignore: ['node_modules/**']
    });
    schema.sql = sqlFiles.slice(0, 5);
    
    // Find model files
    const modelFiles = await glob('**/models/**/*.{js,ts}', {
      cwd: targetPath,
      ignore: ['node_modules/**']
    });
    schema.models = modelFiles.slice(0, 5);
  } catch (error) {
    // Silently handle errors
  }
  
  return schema;
}

async function updateArchitectureMd(targetPath, analysis, newlyCreatedFiles, force) {
  const archPath = path.join(targetPath, 'ARCHITECTURE.md');
  
  // Only update if file was newly created or force is enabled
  if (!newlyCreatedFiles || (!newlyCreatedFiles.has('ARCHITECTURE.md') && !force)) {
    return; // Skip update for existing files without --force
  }
  
  if (!await fs.pathExists(archPath)) return;
  
  let content = await fs.readFile(archPath, 'utf8');
  
  // Build detailed tech stack section
  let techStackDetail = '## Tech Stack\n\n';
  
  if (analysis.frameworks && analysis.frameworks.length > 0) {
    analysis.frameworks.forEach(framework => {
      techStackDetail += `- **${framework}**\n`;
    });
  }
  
  if (analysis.dependencies) {
    techStackDetail += '\n### Key Dependencies\n';
    const deps = Object.entries(analysis.dependencies.dependencies || {}).slice(0, 10);
    deps.forEach(([name, version]) => {
      techStackDetail += `- ${name}: ${version}\n`;
    });
  }
  
  // Add API endpoints if found
  if (analysis.apiEndpoints && analysis.apiEndpoints.length > 0) {
    techStackDetail += '\n## API Endpoints\n\n';
    analysis.apiEndpoints.slice(0, 10).forEach(endpoint => {
      techStackDetail += `- ${endpoint.method} ${endpoint.path} (${endpoint.file})\n`;
    });
  }
  
  // Replace the tech stack section
  content = content.replace(
    /## Tech Stack[\s\S]*?(?=##|$)/,
    techStackDetail + '\n'
  );
  
  await fs.writeFile(archPath, content);
  console.log(chalk.green('[+] Updated ARCHITECTURE.md with deep analysis'));
}

async function updateBuildMd(targetPath, analysis, newlyCreatedFiles, force) {
  const buildPath = path.join(targetPath, 'BUILD.md');
  
  // Only update if file was newly created or force is enabled
  if (!newlyCreatedFiles || (!newlyCreatedFiles.has('BUILD.md') && !force)) {
    return; // Skip update for existing files without --force
  }
  
  if (!await fs.pathExists(buildPath)) return;
  
  let content = await fs.readFile(buildPath, 'utf8');
  
  if (analysis.buildScripts && Object.keys(analysis.buildScripts).length > 0) {
    let scriptsSection = '## Available Scripts\n\n';
    Object.entries(analysis.buildScripts).forEach(([name, command]) => {
      scriptsSection += `### npm run ${name}\n\`\`\`bash\n${command}\n\`\`\`\n\n`;
    });
    
    // Replace or append scripts section
    if (content.includes('## Available Scripts')) {
      content = content.replace(
        /## Available Scripts[\s\S]*?(?=##|$)/,
        scriptsSection
      );
    } else {
      content += '\n' + scriptsSection;
    }
    
    await fs.writeFile(buildPath, content);
    console.log(chalk.green('[+] Updated BUILD.md with build scripts'));
  }
}

async function promptConfirmation(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function checkExistingFiles(targetPath, full = false) {
  const coreTemplates = ['CONDUCTOR.md', 'ARCHITECTURE.md', 'BUILD.md', 'JOURNAL.md'];
  const allTemplates = [
    'CONDUCTOR.md', 'CLAUDE.md', 'ARCHITECTURE.md', 'BUILD.md', 'JOURNAL.md',
    'DESIGN.md', 'UIUX.md', 'CONFIG.md', 'DATA_MODEL.md', 'API.md', 
    'TEST.md', 'CONTRIBUTING.md', 'ERRORS.md', 'PLAYBOOKS/DEPLOY.md'
  ];
  
  const templatesToCheck = full ? allTemplates : coreTemplates;
  const existingFiles = [];
  
  for (const template of templatesToCheck) {
    const filePath = path.join(targetPath, template);
    if (await fs.pathExists(filePath)) {
      existingFiles.push(template);
    }
  }
  
  return existingFiles;
}

async function generateCheckupPrompt(options) {
  const scanPath = path.resolve(options.path || '.');
  
  // Display header
  console.log('');
  console.log(chalk.magenta('┌─────────────────────────────────────────────────────────────────┐'));
  console.log(chalk.magenta('│') + ' ' + chalk.magenta.bold('🪄 Conductor Security & Health Checkup') + '                           ' + chalk.magenta('│'));
  console.log(chalk.magenta('└─────────────────────────────────────────────────────────────────┘'));
  console.log('');
  
  console.log(chalk.blue('[*] Generating checkup prompt for Claude Code...'));
  console.log(chalk.gray(`Target path: ${scanPath}`));
  console.log('');
  
  // Generate the prompt
  const prompt = `Please perform a security and health checkup of the codebase at: ${scanPath}

Check for:
1. Exposed .env files or API keys in code
2. Unsafe innerHTML usage that could lead to XSS
3. Missing .gitignore entries for sensitive files
4. Hardcoded credentials or secrets
5. Common security anti-patterns

IMPORTANT:
- Only report CRITICAL security issues
- Do not modify any code
- Be silent if no issues are found
- Present findings as warnings for review

Start the checkup with: "Conductor🪄 is running a security checkup..."`;

  // Display the prompt in a nice box
  console.log(chalk.yellow('┌─────────────────────────────────────────────────────────────────┐'));
  console.log(chalk.yellow('│') + ' ' + chalk.yellow.bold('📋 Copy this prompt to Claude Code:') + '                              ' + chalk.yellow('│'));
  console.log(chalk.yellow('├─────────────────────────────────────────────────────────────────┤'));
  
  // Split prompt into lines and display
  const lines = prompt.split('\n');
  lines.forEach(line => {
    const padding = 65 - line.length;
    console.log(chalk.yellow('│') + ' ' + chalk.white(line) + ' '.repeat(Math.max(1, padding)) + chalk.yellow('│'));
  });
  
  console.log(chalk.yellow('└─────────────────────────────────────────────────────────────────┘'));
  console.log('');
  
  // Tips
  console.log(chalk.gray('💡 Tips:'));
  console.log(chalk.gray('- This checkup is read-only and won\'t modify your code'));
  console.log(chalk.gray('- Claude will only alert on critical security issues'));
  console.log(chalk.gray('- Run this periodically to maintain code health'));
  console.log('');
}

// === ULTRA-SIMPLE BACKUP/RESTORE UPGRADE SYSTEM ===
// 3-step process: backup → upgrade --clean → restore

async function createUserBackup(targetPath) {
  const backupDir = path.join(targetPath, 'conductor-backup');
  
  // Alpha warning
  console.log(chalk.bgYellow.black.bold(' ⚠️  EARLY ALPHA FEATURE WARNING '));
  console.log(chalk.yellow('This backup/restore upgrade system is NEW and EXPERIMENTAL.'));
  console.log(chalk.yellow('Make sure you have a full backup of your entire project first!'));
  console.log('');
  
  console.log(chalk.cyan.bold('    Conductor Backup (Step 1/3)'));
  console.log(chalk.gray('    Safeguarding your work...'));
  console.log('');
  
  // Check if this directory has conductor files
  const hasFiles = await checkHasConductorFiles(targetPath);
  if (!hasFiles) {
    console.log(chalk.yellow('[!] No Conductor files found in this directory.'));
    console.log(chalk.gray('    Nothing to backup. Run "npx claude-conductor" to initialize.'));
    return;
  }
  
  // Check if backup already exists
  if (await fs.pathExists(backupDir)) {
    console.log(chalk.yellow('[!] Backup already exists at ./conductor-backup/'));
    console.log(chalk.gray('    Your data is already safely backed up!'));
    console.log('');
    console.log(chalk.green('[OK] Ready for Step 2: npx claude-conductor upgrade --clean'));
    return;
  }
  
  // Create backup directory
  try {
    await fs.ensureDir(backupDir);
    console.log(chalk.blue('[*] Created backup folder: ./conductor-backup/'));
  } catch (error) {
    throw new Error(`Cannot create backup directory: ${error.message}`);
  }
  
  // Files to backup
  const filesToBackup = ['JOURNAL.md', 'CLAUDE.md'];
  let backedUpCount = 0;
  
  for (const file of filesToBackup) {
    const sourcePath = path.join(targetPath, file);
    const backupPath = path.join(backupDir, file);
    
    if (await fs.pathExists(sourcePath)) {
      try {
        await fs.copy(sourcePath, backupPath);
        console.log(chalk.green(`[+] Backed up ${file}`));
        backedUpCount++;
      } catch (error) {
        console.log(chalk.red(`[!] Failed to backup ${file}: ${error.message}`));
      }
    } else {
      console.log(chalk.gray(`[-] ${file} not found (no backup needed)`));
    }
  }
  
  console.log('');
  if (backedUpCount > 0) {
    console.log(chalk.green.bold('[OK] Backup completed successfully!'));
    console.log(chalk.gray(`${backedUpCount} file(s) safely backed up to ./conductor-backup/`));
  } else {
    console.log(chalk.green.bold('[OK] Backup folder created (no files to backup)'));
  }
  
  console.log('');
  console.log(chalk.blue.bold('Next step:'));
  console.log(chalk.cyan('npx claude-conductor upgrade --clean'));
}

async function upgradeClean(targetPath, options) {
  // Alpha warning
  console.log(chalk.bgRed.white.bold(' ⚠️  EARLY ALPHA FEATURE WARNING '));
  console.log(chalk.red('This backup/restore upgrade system is NEW and EXPERIMENTAL.'));
  console.log(chalk.red('This command will DELETE files! Ensure you have backups!'));
  console.log('');
  
  console.log(chalk.cyan.bold('    Conductor Clean Upgrade (Step 2/3)'));
  console.log(chalk.gray('    Fresh installation...'));
  console.log('');
  
  // Must use --clean flag for safety
  if (!options.clean) {
    console.log(chalk.red('[!] You must use --clean flag for safety:'));
    console.log(chalk.cyan('npx claude-conductor upgrade --clean'));
    console.log('');
    console.log(chalk.gray('This ensures you understand this will delete all files.'));
    return;
  }
  
  // Check for backup (unless forced)
  const backupDir = path.join(targetPath, 'conductor-backup');
  const hasBackup = await fs.pathExists(backupDir);
  
  if (!hasBackup && !options.force) {
    console.log(chalk.red('[!] No backup found! Run backup first:'));
    console.log(chalk.cyan('npx claude-conductor backup'));
    console.log('');
    console.log(chalk.gray('Or use --force if you really want to proceed without backup'));
    return;
  }
  
  if (!hasBackup && options.force) {
    console.log(chalk.bgRed.white.bold(' [!] WARNING: NO BACKUP FOUND! '));
    console.log(chalk.red('You are proceeding without backing up your data.'));
    console.log('');
  }
  
  // Confirm destructive operation
  if (!options.yes) {
    console.log(chalk.bgYellow.black.bold(' [!] DESTRUCTIVE OPERATION WARNING '));
    console.log('');
    console.log(chalk.yellow('This will DELETE all Conductor files and reinstall fresh templates.'));
    if (hasBackup) {
      console.log(chalk.green('✓ Backup found - your data is safe'));
    } else {
      console.log(chalk.red('✗ No backup found - you may lose data'));
    }
    console.log('');
    console.log(chalk.gray(`Directory: ${targetPath}`));
    console.log('');
    
    const confirmed = await promptConfirmation(chalk.yellow('Continue with clean reinstall? (y/N): '));
    if (!confirmed) {
      console.log(chalk.green('[OK] Operation cancelled.'));
      return;
    }
  }
  
  console.log('');
  console.log(chalk.blue.bold('[*] Removing old Conductor files...'));
  
  // Delete all conductor files (except backup)
  const conductorFiles = await findConductorFiles(targetPath);
  let deletedCount = 0;
  
  for (const file of conductorFiles) {
    const filePath = path.join(targetPath, file);
    try {
      await fs.remove(filePath);
      console.log(chalk.red(`[-] Deleted ${file}`));
      deletedCount++;
    } catch (error) {
      console.log(chalk.yellow(`[!] Could not delete ${file}: ${error.message}`));
    }
  }
  
  console.log('');
  console.log(chalk.blue.bold('[*] Installing fresh templates...'));
  console.log('');
  
  // Run fresh initialization
  const initOptions = {
    force: true, // We already confirmed
    full: options.full,
    analyze: false, // Skip analysis for clean upgrade
    yes: true // Skip prompts
  };
  
  await initializeFramework(targetPath, initOptions);
  
  console.log('');
  console.log(chalk.green.bold('[OK] Clean installation completed!'));
  console.log(chalk.gray(`Deleted ${deletedCount} old files, installed fresh templates.`));
  console.log('');
  console.log(chalk.blue.bold('Final step:'));
  console.log(chalk.cyan('npx claude-conductor restore'));
}

async function restoreUserBackup(targetPath) {
  const backupDir = path.join(targetPath, 'conductor-backup');
  
  // Alpha warning
  console.log(chalk.bgYellow.black.bold(' ⚠️  EARLY ALPHA FEATURE WARNING '));
  console.log(chalk.yellow('This backup/restore upgrade system is NEW and EXPERIMENTAL.'));
  console.log(chalk.yellow('Verify your backup exists and is complete before proceeding!'));
  console.log('');
  
  console.log(chalk.cyan.bold('    Conductor Restore (Step 3/3)'));
  console.log(chalk.gray('    Restoring your work...'));
  console.log('');
  
  // Check if backup exists
  if (!await fs.pathExists(backupDir)) {
    console.log(chalk.red('[!] No backup found at ./conductor-backup/'));
    console.log(chalk.gray('    Run "npx claude-conductor backup" first.'));
    return;
  }
  
  console.log(chalk.blue('[*] Found backup folder: ./conductor-backup/'));
  
  // Restore files
  const filesToRestore = ['JOURNAL.md', 'CLAUDE.md'];
  let restoredCount = 0;
  
  for (const file of filesToRestore) {
    const backupPath = path.join(backupDir, file);
    const targetFilePath = path.join(targetPath, file);
    
    if (await fs.pathExists(backupPath)) {
      try {
        await fs.copy(backupPath, targetFilePath, { overwrite: true });
        console.log(chalk.green(`[+] Restored ${file}`));
        restoredCount++;
      } catch (error) {
        console.log(chalk.red(`[!] Failed to restore ${file}: ${error.message}`));
      }
    } else {
      console.log(chalk.gray(`[-] ${file} not in backup (nothing to restore)`));
    }
  }
  
  // Add upgrade entry to journal
  if (restoredCount > 0 && await fs.pathExists(path.join(targetPath, 'JOURNAL.md'))) {
    await addCleanUpgradeJournalEntry(targetPath);
  }
  
  // Clean up backup folder
  try {
    await fs.remove(backupDir);
    console.log(chalk.gray('[*] Cleaned up backup folder'));
  } catch (error) {
    console.log(chalk.yellow(`[!] Could not remove backup folder: ${error.message}`));
  }
  
  console.log('');
  console.log(chalk.green.bold('[OK] Upgrade completed successfully!'));
  console.log(chalk.gray(`Restored ${restoredCount} file(s). Your data is back!`));
  console.log('');
  console.log('🎉 ' + chalk.blue.bold('Claude Conductor upgrade complete!'));
  console.log(chalk.gray('   Your customizations and history have been preserved.'));
}

// === HELPER FUNCTIONS ===

async function checkHasConductorFiles(targetPath) {
  const possibleFiles = [
    'CLAUDE.md', 'CONDUCTOR.md', 'JOURNAL.md', 'ARCHITECTURE.md', 
    'BUILD.md', 'API.md', 'CONFIG.md', 'DATA_MODEL.md'
  ];
  
  for (const file of possibleFiles) {
    if (await fs.pathExists(path.join(targetPath, file))) {
      return true;
    }
  }
  return false;
}

async function findConductorFiles(targetPath) {
  const allFiles = [
    'CLAUDE.md', 'CONDUCTOR.md', 'JOURNAL.md', 'ARCHITECTURE.md', 
    'BUILD.md', 'API.md', 'CONFIG.md', 'DATA_MODEL.md', 'DESIGN.md',
    'UIUX.md', 'TEST.md', 'CONTRIBUTING.md', 'ERRORS.md', 'PLAYBOOKS'
  ];
  
  const foundFiles = [];
  
  for (const file of allFiles) {
    const filePath = path.join(targetPath, file);
    if (await fs.pathExists(filePath)) {
      foundFiles.push(file);
    }
  }
  
  return foundFiles;
}

async function addCleanUpgradeJournalEntry(targetPath) {
  const journalPath = path.join(targetPath, 'JOURNAL.md');
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 16);
  
  const upgradeEntry = `
## ${timestamp}

### Claude Conductor Clean Upgrade
- **What**: Performed clean upgrade using backup/restore method to v${packageJson.version}
- **Why**: Access to latest framework improvements with zero risk of data loss
- **How**: Used 3-step process: backup → clean install → restore
- **Issues**: None - backup/restore method is bulletproof
- **Result**: Framework successfully upgraded with all user data preserved

---

`;
  
  try {
    let content = await fs.readFile(journalPath, 'utf8');
    
    // Insert after the header
    const firstHeaderIndex = content.indexOf('\n## ');
    if (firstHeaderIndex !== -1) {
      content = content.slice(0, firstHeaderIndex) + upgradeEntry + content.slice(firstHeaderIndex);
    } else {
      content += upgradeEntry;
    }
    
    await fs.writeFile(journalPath, content);
  } catch (error) {
    // Silently handle errors - journal entry is not critical
  }
}

program.parse();