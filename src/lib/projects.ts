import { message, open } from "@tauri-apps/plugin-dialog";
import {
  mkdir,
  readDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { activeProject, statusbar } from "./state";
import { goto } from "$app/navigation";
import { get } from "svelte/store";

export async function newProject() {
  const dir = await open({
    title: "Create a new Screencap project",
    multiple: false,
    directory: true,
    recursive: true,
    canCreateDirectories: true,
  });

  if (!dir) return;

  const files = await readDir(dir);
  if (files.length > 0) {
    await message(
      "Can't create project here! A project must be created in an empty directory",
      {
        kind: "error",
      },
    );
  } else {
    const projectConfig = {
      status: "new",
      videoFile: "",
    };

    await writeTextFile(
      `${dir}/project.scr`,
      JSON.stringify(projectConfig),
      {},
    );

    loadProject(dir);
  }
}

export async function openProject() {
  const dir = await open({
    title: "Open a Screencap project",
    multiple: false,
    directory: true,
    recursive: true,
    canCreateDirectories: false,
  });

  if (!dir) return;

  const files = await readDir(dir);
  if (!files.find((file) => file.name === "project.scr")) {
    await message(
      "Can't open project! This directory isn't a valid Screencap project.",
      {
        kind: "error",
      },
    );
  } else {
    loadProject(dir);
  }
}

export async function loadProject(dir: string) {
  const files = await readDir(dir);
  const projectFile = files.find((file) => file.name === "project.scr");
  if (!projectFile) return;
  const projectData = JSON.parse(await readTextFile(`${dir}/project.scr`, {}));

  if (projectData.status === "processing") {
    await message(
      "Can't open project! This project is in the processing state. This either means it is currently active in another window, or Screencap was closed during processing, in which case you need to delete the project and create a new one.",
      {
        kind: "error",
      },
    );
    return;
  }

  // Create "frames" directory if it doesn't exist
  const framesDir = files.find((file) => file.name === "frames");
  if (!framesDir) {
    await mkdir(`${dir}/frames`, { recursive: true });
  }

  // Create "favorites" directory if it doesn't exist
  const outputDir = files.find((file) => file.name === "screeencaps");
  if (!outputDir) {
    await mkdir(`${dir}/favorites`, { recursive: true });
  }

  projectData.dir = dir;

  // Save the project data to the store
  activeProject.set(projectData);

  if (projectData.status === "new") {
    goto("/setup");
  } else if (projectData.status === "finished") {
    goto("/editor");
  }
}

export async function saveProject() {
  const projectData = get(activeProject);
  await writeTextFile(
    `${projectData?.dir}/project.scr`,
    JSON.stringify({
      ...projectData,
      dir: undefined,
    }),
    {},
  );
}

export async function closeProject() {
  const projectData = get(activeProject);
  if (projectData?.status === "processing") {
    await message(
      "Can't close project! This project is in the processing state.",
      {
        kind: "error",
      },
    );
    return;
  }

  activeProject.set(null);
  statusbar.set({
    framesSize: null,
    framesAmount: null,
    favoritesSize: null,
    favoritesAmount: null,
  });
  goto("/");
}
