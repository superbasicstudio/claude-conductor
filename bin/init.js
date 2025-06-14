#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const chalk = require('chalk');
const readline = require('readline');

const program = new Command();

program
  .name('claude-conductor')
  .description('Initialize Claude Code documentation framework in your project')
  .version('1.0.0')
  .argument('[target-dir]', 'Target directory (defaults to current directory)', '.')
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
      await initializeFramework(targetDir, options);
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
  await copyTemplates(templatesDir, targetPath, options.force, options.full, newlyCreatedFiles);
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
  
  // Filter templates based on --full flag
  if (!full) {
    // Core templates only
    const coreTemplates = ['CONDUCTOR.md', 'CLAUDE.md', 'ARCHITECTURE.md', 'BUILD.md'];
    templateFiles = templateFiles.filter(file => coreTemplates.includes(path.basename(file)));
  }
  
  for (const file of templateFiles) {
    const sourcePath = path.join(templatesDir, file);
    const targetFilePath = path.join(targetPath, file);
    
    if (await fs.pathExists(targetFilePath)) {
      if (!force) {
        console.log(chalk.yellow(`[=] Skipping ${file} (already exists)`));
        continue;
      } else {
        console.log(chalk.red(`[!] Overwriting ${file}`));
      }
    } else {
      // Track newly created files
      if (newlyCreatedFiles) {
        newlyCreatedFiles.add(file);
      }
    }
    
    await fs.ensureDir(path.dirname(targetFilePath));
    await fs.copy(sourcePath, targetFilePath);
    console.log(chalk.green(`[+] Created ${file}`));
  }
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

program.parse();