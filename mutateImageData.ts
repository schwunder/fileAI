import { $ } from "bun";

export default async function mutateImageData(
  absPath: string,
  comment: string,
  tags: string[]
) {
  Bun.spawnSync([
    "osascript",
    "-e",
    `
      set filepath to POSIX file "${absPath}"
      set the_File to filepath as alias
      tell application "Finder" to set the comment of the_File to "${comment}"
    `.replace(/'/g, "'\\''"),
  ]);
  await $`tag -a "${tags.join(",")}" ${absPath}`;
}
