const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

describe('Claude Conductor CLI', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'claude-conductor-test-'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  test('should initialize framework in empty directory', () => {
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + '/..' });
    
    expect(fs.pathExistsSync(path.join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(fs.pathExistsSync(path.join(tempDir, 'CONDUCTOR.md'))).toBe(true);
    expect(fs.pathExistsSync(path.join(tempDir, 'JOURNAL.md'))).toBe(true);
  });

  test('should respect --force flag', async () => {
    // Create existing CLAUDE.md
    await fs.writeFile(path.join(tempDir, 'CLAUDE.md'), 'existing content');
    
    execSync(`node bin/init.js ${tempDir} --force --yes`, { cwd: __dirname + '/..' });
    
    const content = await fs.readFile(path.join(tempDir, 'CLAUDE.md'), 'utf8');
    expect(content).not.toBe('existing content');
  });

  test('should skip existing files without --force', async () => {
    await fs.writeFile(path.join(tempDir, 'CLAUDE.md'), 'existing content');
    
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + '/..' });
    
    const content = await fs.readFile(path.join(tempDir, 'CLAUDE.md'), 'utf8');
    expect(content).toBe('existing content');
  });

  test('should show version', () => {
    const output = execSync('node bin/init.js --version', { 
      cwd: __dirname + '/..',
      encoding: 'utf8'
    });
    expect(output.trim()).toBe('1.0.0');
  });

  test('should NOT overwrite JOURNAL.md without --force', async () => {
    // Create existing JOURNAL.md with custom content
    const customJournal = '# My Custom Journal\n\nImportant entries here';
    await fs.writeFile(path.join(tempDir, 'JOURNAL.md'), customJournal);
    
    // Run without --force
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + '/..' });
    
    // Verify JOURNAL.md was NOT overwritten
    const content = await fs.readFile(path.join(tempDir, 'JOURNAL.md'), 'utf8');
    expect(content).toBe(customJournal);
  });

  test('should NOT update existing CLAUDE.md during analysis without --force', async () => {
    // Create custom CLAUDE.md with user content
    const customClaude = '# My Custom CLAUDE.md\n\nUser customizations here\n- **Tech Stack**: [List core technologies]';
    await fs.writeFile(path.join(tempDir, 'CLAUDE.md'), customClaude);
    
    // Run without --force (CLAUDE.md will be skipped in copy but should NOT be modified by analysis)
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + '/..' });
    
    // Verify CLAUDE.md was NOT modified by analysis
    const content = await fs.readFile(path.join(tempDir, 'CLAUDE.md'), 'utf8');
    expect(content).toBe(customClaude);
    expect(content).toContain('[List core technologies]'); // Should still have placeholder
  });

  test('should NOT update existing ARCHITECTURE.md during deepscan without --force', async () => {
    // Create custom ARCHITECTURE.md
    const customArch = '# My Architecture\n\n## Tech Stack\n\nCustom tech stack info';
    await fs.writeFile(path.join(tempDir, 'ARCHITECTURE.md'), customArch);
    
    // Run with deepscan but without --force
    execSync(`node bin/init.js ${tempDir} --deepscan`, { cwd: __dirname + '/..' });
    
    // Verify ARCHITECTURE.md was NOT modified
    const content = await fs.readFile(path.join(tempDir, 'ARCHITECTURE.md'), 'utf8');
    expect(content).toBe(customArch);
  });

  test('should NOT update existing BUILD.md during deepscan without --force', async () => {
    // Create custom BUILD.md
    const customBuild = '# My Build Process\n\n## Custom Scripts\n\nDo not modify!';
    await fs.writeFile(path.join(tempDir, 'BUILD.md'), customBuild);
    
    // Run with deepscan but without --force
    execSync(`node bin/init.js ${tempDir} --deepscan`, { cwd: __dirname + '/..' });
    
    // Verify BUILD.md was NOT modified
    const content = await fs.readFile(path.join(tempDir, 'BUILD.md'), 'utf8');
    expect(content).toBe(customBuild);
  });

  test('SHOULD overwrite all files with --force --yes', async () => {
    // Create existing files with custom content
    const files = {
      'CLAUDE.md': '# Custom CLAUDE',
      'JOURNAL.md': '# Custom Journal',
      'ARCHITECTURE.md': '# Custom Architecture',
      'BUILD.md': '# Custom Build'
    };
    
    for (const [file, content] of Object.entries(files)) {
      await fs.writeFile(path.join(tempDir, file), content);
    }
    
    // Run with --force --yes
    execSync(`node bin/init.js ${tempDir} --force --yes`, { cwd: __dirname + '/..' });
    
    // Verify all files were overwritten
    for (const file of Object.keys(files)) {
      const content = await fs.readFile(path.join(tempDir, file), 'utf8');
      expect(content).not.toBe(files[file]); // Should be different from custom content
      expect(content.length).toBeGreaterThan(50); // Should have actual template content
    }
  });
});