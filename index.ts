#!/usr/bin/env bun

import { parseArgs } from "util";
import { intro, text, outro } from "@clack/prompts";
import pc from "picocolors";
import { $ } from "bun";

async function main() {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      name: {
        type: "string",
        short: "n",
        description: "Name of the project",
      },
    },
  });

  intro(pc.magenta("� Crafting your Carats masterpiece..."));

  let projectName = values.name;
  if (!projectName) {
    const response = await text({
      message: "What is the name of your project?",
      placeholder: "diamond-cut-app",
      validate: (value) => {
        if (!value) return "Project name is required";
        if (!/^[a-zA-Z0-9-_]+$/.test(value)) return "Project name can only contain letters, numbers, hyphens, and underscores";
      },
    });
    projectName = response as string;
  }

  if (!projectName) {
    outro(pc.red("❌ Project name is required"));
    process.exit(1);
  }

  console.log(pc.yellow(`� Polishing your Carats gem into ${projectName}...`));

  try {
    await $`npx degit ufukbakan/vite-jjsx-ssr#carats ${projectName}`;
    outro(pc.green(`✅ Successfully created ${projectName}!`));
    console.log(pc.cyan("\nNext steps:"));
    console.log(pc.cyan(`  cd ${projectName}`));
    console.log(pc.cyan(`  bun install`));
    console.log(pc.cyan(`  bun run dev`));
  } catch (error) {
    outro(pc.red(`❌ Failed to create project: ${(error as Error).message}`));
    process.exit(1);
  }
}

main();