#!/usr/bin/env bun

import { confirm, intro, outro, select, spinner, text } from "@clack/prompts";
import degit from "degit";
import pc from "picocolors";
import { parseArgs } from "util";

async function main() {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      name: { type: "string", short: "n" },
    },
  });

  console.log(""); 
  intro(`${pc.bgMagenta(pc.black(" CARATS "))} ${pc.dim("— Precision TypeScript Scaffolding")}`);

  let projectName = values.name;
  if (!projectName) {
    projectName = await text({
      message: "Define your project name",
      placeholder: "diamond-cut-app",
      validate: (value) => {
        if (!value) return "A project name is required.";
        if (!/^[a-zA-Z0-9-_]+$/.test(value)) return "Use only alphanumeric characters, hyphens, or underscores.";
      },
    }) as string;
  }

  if (typeof projectName === 'symbol') {
    outro(pc.dim("Operation suspended."));
    process.exit(0);
  }

  const architecture = await select({
    message: "Select your architectural clarity",
    options: [
      { 
        value: "ssr", 
        label: "Server-Side Rendering", 
        hint: "Fullstack hydration for maximum performance" 
      },
      { 
        value: "spa", 
        label: "Client-Side Only", 
        hint: "Lightweight, high-speed single page application" 
      },
    ],
  });

  if (typeof architecture === 'symbol') process.exit(0);

  const repo = architecture === 'ssr' ? 'ufukbakan/vite-jjsx-ssr#carats' : 'ufukbakan/vite-jjsx#carats';
  
  const s = spinner();
  s.start(pc.magenta("✧") + pc.dim(` Faceting your project into ./${projectName}...`));

  try {
    const emitter = degit(repo, { cache: false, force: true, verbose: true });
    await emitter.clone(projectName);
    s.stop(pc.green(`✅ ${projectName} has been successfully cut and polished.`));

    const wantsAutoInstall = await confirm({
      message: "Initialize workspace and install dependencies?",
      initialValue: true,
    });

    if (typeof wantsAutoInstall === 'symbol') process.exit(0);

    if (wantsAutoInstall) {
      const installSpinner = spinner();
      installSpinner.start(pc.cyan("Forging environment..."));
      
      const { $ } = await import('bun');
      await $`cd ${projectName} && bun install`.quiet();
      
      installSpinner.stop(pc.green("Dependencies integrated."));
      
      // PRESTIGE FINISH (Auto)
      outro(
        pc.magenta(`\n🎉 Your Carats masterpiece is ready.`) +
        pc.dim(`\n   Execute: `) + pc.cyan(`cd ${projectName} && bun dev`)
      );
    } else {
      // PRESTIGE FINISH (Manual)
      // This version uses a vertical "timeline" style to make manual steps feel like a high-end ritual.
      outro(
        pc.magenta(`✧ The foundation is set.`) + 
        pc.dim(`\n\n  Follow these steps to finalize the build:`) +
        `\n  ${pc.magenta("1.")} ${pc.white(`cd ${projectName}`)}` +
        `\n  ${pc.magenta("2.")} ${pc.white(`bun install`)}` +
        `\n  ${pc.magenta("3.")} ${pc.white(`bun dev`)}` +
        `\n\n${pc.dim("The architecture is yours to command.")}`
      );
    }
  } catch (error) {
    s.stop(pc.red("The forge encountered an error."));
    outro(pc.red(`Error: ${(error as Error).message}`));
    if ((error as Error).stack) {
      outro(pc.red((error as Error).stack!.split('\n').map(line => '  ' + line).join('\n')));
    }
    process.exit(1);
  }
}

main();