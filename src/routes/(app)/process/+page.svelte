<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Loader from "$components/Loader.svelte";
  import { saveProject } from "$lib/projects";
  import { activeProject } from "$lib/state";
  import { Command } from "@tauri-apps/plugin-shell";
  import { Pane, PaneGroup, PaneResizer } from "paneforge";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  let status = $state<"init" | "processing" | "error">("init");
  let consoleLog = $state<string[]>([]);
  let args = $state<string[]>([]);
  let consoleDiv = $state<HTMLDivElement | null>(null);

  onMount(async () => {
    const interval = page.url.searchParams.get("interval");
    const project = get(activeProject);
    if (!project) return;
    runCommand(interval ?? 5, project);
  });

  async function runCommand(interval: string | number, project: any) {
    interval = parseInt(interval as string);
    const argsToUse = [
      "-i",
      `${project.videoFile}`,
      "-vf",
      `fps=1/${interval}`,
      `${project.dir}/frames/frame%06d.png`,
    ];
    args = argsToUse;
    const command = Command.create("ffmpeg", argsToUse);
    command.stdout.on("data", (data) => {
      console.log(data);
      console.log(consoleDiv);
      consoleLog = [...consoleLog, data];
      consoleDiv?.scrollTo(0, consoleDiv.scrollHeight);
    });
    command.stderr.on("data", (data) => {
      console.error(data);
      consoleLog = [...consoleLog, data];
      consoleDiv?.scrollTo(0, consoleDiv.scrollHeight);
    });
    command.on("close", (ctx) => {
      if (ctx.code === 0) {
        const project = get(activeProject);
        activeProject.set({
          status: "finished",
          videoFile: project?.videoFile ?? "",
          dir: project?.dir ?? "",
        });
        saveProject();
        goto("/editor");
      } else {
        status = "error";
      }
    });
    consoleLog = [
      "$ ffmpeg " +
        args
          .map((arg) => {
            if (arg.includes(" ")) return `"${arg}"`;
            return arg;
          })
          .join(" "),
    ];
    status = "processing";
    command.spawn();
  }
</script>

<PaneGroup class="h-full" direction="vertical">
  <Pane defaultSize={70}>
    <div class="h-full flex items-center justify-center flex-col">
      {#if status !== "error"}
        <Loader />
      {/if}
      <p class="text-white/50 mt-4">
        {#if status === "init"}
          Initializing...
        {:else if status === "processing"}
          Rendering Frames... This may take a while.
        {:else if status === "error"}
          Something went wrong.
        {/if}
      </p>
    </div>
  </Pane>
  {#if status !== "init"}
    <PaneResizer class="h-3 bg-transparent hover:bg-dark-800"></PaneResizer>
    <Pane
      defaultSize={30}
      class="bg-black font-mono border-t border-dark-800 pb-8"
    >
      <div
        bind:this={consoleDiv}
        class="max-h-full overflow-y-scroll py-1 px-2 text-white/75"
      >
        {#each consoleLog as log}
          <p>{@html log}</p>
        {/each}
      </div>
    </Pane>
  {/if}
</PaneGroup>
