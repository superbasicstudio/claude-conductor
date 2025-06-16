const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

describe("Claude Conductor CLI", () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "claude-conductor-test-")
    );
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  test("should initialize framework in empty directory", () => {
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });

    expect(fs.pathExistsSync(path.join(tempDir, "CLAUDE.md"))).toBe(true);
    expect(fs.pathExistsSync(path.join(tempDir, "CONDUCTOR.md"))).toBe(true);
    expect(fs.pathExistsSync(path.join(tempDir, "JOURNAL.md"))).toBe(true);
  });

  test("should respect --force flag", async () => {
    // Create existing CLAUDE.md
    await fs.writeFile(path.join(tempDir, "CLAUDE.md"), "existing content");

    execSync(`node bin/init.js ${tempDir} --force --yes`, {
      cwd: __dirname + "/..",
    });

    const content = await fs.readFile(path.join(tempDir, "CLAUDE.md"), "utf8");
    expect(content).not.toBe("existing content");
  });

  test("should skip existing files without --force", async () => {
    await fs.writeFile(path.join(tempDir, "CLAUDE.md"), "existing content");

    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });

    const content = await fs.readFile(path.join(tempDir, "CLAUDE.md"), "utf8");
    expect(content).toBe("existing content");
  });

  test("should show version", () => {
    const output = execSync("node bin/init.js --version", {
      cwd: __dirname + "/..",
      encoding: "utf8",
    });
    expect(output.trim()).toBe("1.1.1");
  });

  test("should NOT overwrite JOURNAL.md without --force", async () => {
    // Create existing JOURNAL.md with custom content
    const customJournal = "# My Custom Journal\n\nImportant entries here";
    await fs.writeFile(path.join(tempDir, "JOURNAL.md"), customJournal);

    // Run without --force
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });

    // Verify JOURNAL.md was NOT overwritten
    const content = await fs.readFile(path.join(tempDir, "JOURNAL.md"), "utf8");
    expect(content).toBe(customJournal);
  });

  test("should NOT update existing CLAUDE.md during analysis without --force", async () => {
    // Create custom CLAUDE.md with user content
    const customClaude =
      "# My Custom CLAUDE.md\n\nUser customizations here\n- **Tech Stack**: [List core technologies]";
    await fs.writeFile(path.join(tempDir, "CLAUDE.md"), customClaude);

    // Run without --force (CLAUDE.md will be skipped in copy but should NOT be modified by analysis)
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });

    // Verify CLAUDE.md was NOT modified by analysis
    const content = await fs.readFile(path.join(tempDir, "CLAUDE.md"), "utf8");
    expect(content).toBe(customClaude);
    expect(content).toContain("[List core technologies]"); // Should still have placeholder
  });

  test("should NOT update existing ARCHITECTURE.md during deepscan without --force", async () => {
    // Create custom ARCHITECTURE.md
    const customArch =
      "# My Architecture\n\n## Tech Stack\n\nCustom tech stack info";
    await fs.writeFile(path.join(tempDir, "ARCHITECTURE.md"), customArch);

    // Run with deepscan but without --force
    execSync(`node bin/init.js ${tempDir} --deepscan`, {
      cwd: __dirname + "/..",
    });

    // Verify ARCHITECTURE.md was NOT modified
    const content = await fs.readFile(
      path.join(tempDir, "ARCHITECTURE.md"),
      "utf8"
    );
    expect(content).toBe(customArch);
  });

  test("should NOT update existing BUILD.md during deepscan without --force", async () => {
    // Create custom BUILD.md
    const customBuild =
      "# My Build Process\n\n## Custom Scripts\n\nDo not modify!";
    await fs.writeFile(path.join(tempDir, "BUILD.md"), customBuild);

    // Run with deepscan but without --force
    execSync(`node bin/init.js ${tempDir} --deepscan`, {
      cwd: __dirname + "/..",
    });

    // Verify BUILD.md was NOT modified
    const content = await fs.readFile(path.join(tempDir, "BUILD.md"), "utf8");
    expect(content).toBe(customBuild);
  });

  test("SHOULD overwrite all files with --force --yes", async () => {
    // Create existing files with custom content
    const files = {
      "CLAUDE.md": "# Custom CLAUDE",
      "JOURNAL.md": "# Custom Journal",
      "ARCHITECTURE.md": "# Custom Architecture",
      "BUILD.md": "# Custom Build",
    };

    for (const [file, content] of Object.entries(files)) {
      await fs.writeFile(path.join(tempDir, file), content);
    }

    // Run with --force --yes
    execSync(`node bin/init.js ${tempDir} --force --yes`, {
      cwd: __dirname + "/..",
    });

    // Verify all files were overwritten
    for (const file of Object.keys(files)) {
      const content = await fs.readFile(path.join(tempDir, file), "utf8");
      expect(content).not.toBe(files[file]); // Should be different from custom content
      expect(content.length).toBeGreaterThan(50); // Should have actual template content
    }
  });

  test("should add version comments to newly created files", async () => {
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });

    const claudeContent = await fs.readFile(path.join(tempDir, "CLAUDE.md"), "utf8");
    const conductorContent = await fs.readFile(path.join(tempDir, "CONDUCTOR.md"), "utf8");

    expect(claudeContent).toContain("<!-- Generated by Claude Conductor v1.1.1 -->");
    expect(conductorContent).toContain("<!-- Generated by Claude Conductor v1.1.1 -->");
  });

  // === BACKUP/RESTORE UPGRADE SYSTEM TESTS ===

  test("backup should create backup folder with user files", async () => {
    // Initialize project with custom content
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });
    
    const customJournal = "# My Important History\n\n## Critical Entry\nDo not lose this!";
    const customClaude = "# My Custom Setup\n\n- **Tech Stack**: React, Node.js\n- Important customizations";
    
    await fs.writeFile(path.join(tempDir, "JOURNAL.md"), customJournal);
    await fs.writeFile(path.join(tempDir, "CLAUDE.md"), customClaude);

    // Run backup
    const output = execSync(`node bin/init.js backup ${tempDir}`, {
      cwd: __dirname + "/..",
      encoding: "utf8"
    });

    // Verify backup created
    expect(output).toContain("Conductor Backup (Step 1/3)");
    expect(output).toContain("Backed up JOURNAL.md");
    expect(output).toContain("Backed up CLAUDE.md");
    expect(output).toContain("Backup completed successfully");

    // Verify backup folder exists with correct files
    const backupDir = path.join(tempDir, "conductor-backup");
    expect(fs.pathExistsSync(backupDir)).toBe(true);
    
    const backedUpJournal = await fs.readFile(path.join(backupDir, "JOURNAL.md"), "utf8");
    const backedUpClaude = await fs.readFile(path.join(backupDir, "CLAUDE.md"), "utf8");
    
    expect(backedUpJournal).toBe(customJournal);
    expect(backedUpClaude).toBe(customClaude);
  });

  test("backup should handle missing files gracefully", async () => {
    // Create empty directory
    const output = execSync(`node bin/init.js backup ${tempDir}`, {
      cwd: __dirname + "/..",
      encoding: "utf8"
    });

    expect(output).toContain("No Conductor files found");
    expect(output).toContain("Nothing to backup");
  });

  test("backup should detect existing backup", async () => {
    // Initialize and create first backup
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });
    execSync(`node bin/init.js backup ${tempDir}`, { cwd: __dirname + "/.." });

    // Try to backup again
    const output = execSync(`node bin/init.js backup ${tempDir}`, {
      cwd: __dirname + "/..",
      encoding: "utf8"
    });

    expect(output).toContain("Backup already exists");
    expect(output).toContain("Ready for Step 2");
  });

  test("upgrade --clean should require --clean flag", async () => {
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });
    
    const output = execSync(`node bin/init.js upgrade ${tempDir}`, {
      cwd: __dirname + "/..",
      encoding: "utf8"
    });

    expect(output).toContain("You must use --clean flag");
    expect(output).toContain("npx claude-conductor upgrade --clean");
  });

  test("upgrade --clean should require backup first", async () => {
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });
    
    const output = execSync(`node bin/init.js upgrade ${tempDir} --clean`, {
      cwd: __dirname + "/..",
      encoding: "utf8"
    });

    expect(output).toContain("No backup found! Run backup first");
    expect(output).toContain("npx claude-conductor backup");
  });

  test("upgrade --clean should delete old files and reinstall", async () => {
    // Initialize project
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });
    
    // Create backup
    execSync(`node bin/init.js backup ${tempDir}`, { cwd: __dirname + "/.." });
    
    // Add some extra files to test deletion
    await fs.writeFile(path.join(tempDir, "DESIGN.md"), "custom design");
    await fs.writeFile(path.join(tempDir, "API.md"), "custom api");
    
    // Run clean upgrade
    const output = execSync(`node bin/init.js upgrade ${tempDir} --clean --yes`, {
      cwd: __dirname + "/..",
      encoding: "utf8"
    });

    expect(output).toContain("Conductor Clean Upgrade (Step 2/3)");
    expect(output).toContain("Deleted CLAUDE.md");
    expect(output).toContain("Deleted CONDUCTOR.md");
    expect(output).toContain("Clean installation completed");

    // Verify fresh files exist (but user files don't yet)
    expect(fs.pathExistsSync(path.join(tempDir, "CLAUDE.md"))).toBe(true);
    expect(fs.pathExistsSync(path.join(tempDir, "CONDUCTOR.md"))).toBe(true);
    expect(fs.pathExistsSync(path.join(tempDir, "JOURNAL.md"))).toBe(true);
    
    // Verify it's fresh content (not custom content)
    const claudeContent = await fs.readFile(path.join(tempDir, "CLAUDE.md"), "utf8");
    expect(claudeContent).toContain("[List core technologies]"); // Should have template placeholders
  });

  test("restore should restore backed up files", async () => {
    // Initialize and customize
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });
    
    const customJournal = "# My Important History\n\n## Critical Work\nDo not lose!";
    const customClaude = "# My Setup\n\n- **Tech Stack**: React, Node.js\n- Custom config";
    
    await fs.writeFile(path.join(tempDir, "JOURNAL.md"), customJournal);
    await fs.writeFile(path.join(tempDir, "CLAUDE.md"), customClaude);
    
    // Backup, clean upgrade, then restore
    execSync(`node bin/init.js backup ${tempDir}`, { cwd: __dirname + "/.." });
    execSync(`node bin/init.js upgrade ${tempDir} --clean --yes`, { cwd: __dirname + "/.." });
    
    // Before restore, verify we have fresh templates
    const preRestore = await fs.readFile(path.join(tempDir, "CLAUDE.md"), "utf8");
    expect(preRestore).toContain("[List core technologies]"); // Fresh template
    
    const output = execSync(`node bin/init.js restore ${tempDir}`, {
      cwd: __dirname + "/..",
      encoding: "utf8"
    });

    expect(output).toContain("Conductor Restore (Step 3/3)");
    expect(output).toContain("Restored JOURNAL.md");
    expect(output).toContain("Restored CLAUDE.md");
    expect(output).toContain("Upgrade completed successfully");

    // Verify user content restored
    const restoredJournal = await fs.readFile(path.join(tempDir, "JOURNAL.md"), "utf8");
    const restoredClaude = await fs.readFile(path.join(tempDir, "CLAUDE.md"), "utf8");
    
    // Journal should contain original content plus upgrade entry
    expect(restoredJournal).toContain("My Important History");
    expect(restoredJournal).toContain("Critical Work");
    expect(restoredJournal).toContain("Do not lose!");
    expect(restoredJournal).toContain("Claude Conductor Clean Upgrade"); // Added by restore
    
    // CLAUDE.md should be exactly the same
    expect(restoredClaude).toBe(customClaude);
    
    // Verify backup folder cleaned up
    expect(fs.pathExistsSync(path.join(tempDir, "conductor-backup"))).toBe(false);
  });

  test("restore should handle missing backup gracefully", async () => {
    const output = execSync(`node bin/init.js restore ${tempDir}`, {
      cwd: __dirname + "/..",
      encoding: "utf8"
    });

    expect(output).toContain("No backup found");
    expect(output).toContain("Run \"npx claude-conductor backup\" first");
  });

  test("complete backup/upgrade/restore cycle preserves data", async () => {
    // Initialize with custom content
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });
    
    const originalJournal = "# Development Log\n\n## 2024-01-01\nImportant milestone achieved";
    const originalClaude = "# Project Config\n\n- **Tech Stack**: Vue.js, Python\n- **Main File**: src/main.py (500 lines)\n- Critical setup notes";
    
    await fs.writeFile(path.join(tempDir, "JOURNAL.md"), originalJournal);
    await fs.writeFile(path.join(tempDir, "CLAUDE.md"), originalClaude);

    // Step 1: Backup
    execSync(`node bin/init.js backup ${tempDir}`, { cwd: __dirname + "/.." });
    
    // Step 2: Clean upgrade  
    execSync(`node bin/init.js upgrade ${tempDir} --clean --yes`, { cwd: __dirname + "/.." });
    
    // Step 3: Restore
    execSync(`node bin/init.js restore ${tempDir}`, { cwd: __dirname + "/.." });

    // Verify everything preserved perfectly
    const finalJournal = await fs.readFile(path.join(tempDir, "JOURNAL.md"), "utf8");
    const finalClaude = await fs.readFile(path.join(tempDir, "CLAUDE.md"), "utf8");
    
    expect(finalJournal).toContain("Development Log");
    expect(finalJournal).toContain("Important milestone achieved");
    expect(finalJournal).toContain("Claude Conductor Clean Upgrade"); // Should have upgrade entry
    
    expect(finalClaude).toBe(originalClaude); // Exact match for CLAUDE.md
    
    // Verify we have fresh templates too
    expect(fs.pathExistsSync(path.join(tempDir, "CONDUCTOR.md"))).toBe(true);
    expect(fs.pathExistsSync(path.join(tempDir, "ARCHITECTURE.md"))).toBe(true);
  });

  test("upgrade --clean with --force bypasses backup check", async () => {
    execSync(`node bin/init.js ${tempDir}`, { cwd: __dirname + "/.." });
    
    // Run clean upgrade without backup but with --force
    const output = execSync(`node bin/init.js upgrade ${tempDir} --clean --force --yes`, {
      cwd: __dirname + "/..",
      encoding: "utf8"
    });

    expect(output).toContain("WARNING: NO BACKUP FOUND!");
    expect(output).toContain("Clean installation completed");
  });
});
