import { ZXB_PATHS } from "./config.mjs";
import { binfo } from "./sources.mjs"

export async function create(path, content) {
	await fs.ensureDir(ZXB_PATHS.bins);
	await fs.writeFileSync(path, content, "utf8");
	await $`chmod +x ${path}`;
}

export function template(filename, path) {
	return `#!/bin/bash
  ${path}/${filename} $@
  `.split("\n").map(s => s.trim()).join("\n")
}

export async function get() {
	return await globby([`${ZXB_PATHS.bins}/*`, `!${ZXB_PATHS.bins}/zxb`]);
}


export async function link({ filename, slug, bin, directory }) {
	if (argv.force === true && (await fs.pathExists(bin)) === true) {
		console.log(`\nRemoving ${chalk.bold(slug)} bin file\n${chalk.gray(`rm ${bin}`)}`)
		await $`rm ${bin}`;
	}

	if (false !== await fs.pathExists(bin)) {
		return false;
	}
	const content = template(filename, directory);
	await create(bin, content);
	console.log(`Created new link: ${bin}`);
	return true;
}

export async function relink() {
	let count = 0;
	for (const script of await binfo()) {
		if (await link(script)) {
			count++;
		}
	}
	return count > 0;
}