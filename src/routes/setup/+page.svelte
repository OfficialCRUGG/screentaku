<script>
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import { open, save } from "@tauri-apps/plugin-dialog";
  import { Command } from "@tauri-apps/plugin-shell";
  import { formatTime } from "$lib/formatting";
  import { twMerge } from "tailwind-merge";
  import RadioButton from "$components/RadioButton.svelte";
  import { activeProject } from "$lib/state";
  import { get } from "svelte/store";
  import { saveProject } from "$lib/projects";
  import { goto } from "$app/navigation";
  import Loader from "$components/Loader.svelte";

  let videoFile = $state("");
  let videoDuration = $state(-1);
  let loading = $state(false);
  let mode = $state("interval");
  let intervalInput = $state(5);
  let frameInput = $state(100);
  let calculatedFrames = $state(0);
  let calculatedInterval = $state(0);

  $effect(() => {
    if (mode === "interval") {
      calculatedFrames = Math.floor(videoDuration / intervalInput);
    } else {
      calculatedInterval = Math.floor(videoDuration / frameInput);
    }
  });

  async function chooseVideo() {
    const file = await open({
      title: "Select a video file",
      multiple: false,
      filters: [{ name: "Videos", extensions: ["mp4", "webm", "mkv"] }],
    });

    if (file) {
      videoFile = file;
      loading = true;

      const command = Command.create("ffprobe", [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "format=duration",
        "-of",
        "csv=p=0",
        file,
      ]);

      const result = await command.execute();

      if (result.code === 0) {
        videoDuration = parseFloat(result.stdout);
        loading = false;
      } else {
        console.error(result.stderr);
      }
    }
  }

  async function beginProcessing() {
    const project = get(activeProject);
    activeProject.set({
      status: "processing",
      videoFile,
      dir: project?.dir ?? "",
    });
    await saveProject();
    goto(
      `/process?interval=${mode === "interval" ? intervalInput : calculatedInterval}`,
    );
  }
</script>

<div class="mt-[25vh] max-w-3xl mx-auto text-white/75">
  <h1 class="text-4xl font-bold text-white">Set up project</h1>
  <hr />
  <span>Video File</span>
  <div class="flex space-x-2">
    <Input
      type="text"
      readonly
      disabled
      bind:value={videoFile}
      class="w-full"
    />
    <Button onclick={chooseVideo}>Choose...</Button>
  </div>
  <p
    class={twMerge(
      "text-sm text-white/50 mt-0.5",
      videoDuration >= 0 ? "opacity-100" : "opacity-0",
    )}
  >
    Video Duration: <b>{formatTime(videoDuration)}</b>
  </p>
  {#if loading}
    <hr />
    <div class="flex items-center justify-center pt-4">
      <Loader />
    </div>
  {:else if videoFile}
    <hr />
    <div class="flex space-x-4">
      <RadioButton
        onclick={() => (mode = "interval")}
        bind:value={mode}
        key="interval"
        label="by interval"
      />
      <RadioButton
        onclick={() => (mode = "frames")}
        bind:value={mode}
        key="frames"
        label="by frame count"
      />
    </div>
    <div class="mt-4">
      {#if mode === "interval"}
        <span>Create a screencap every x seconds</span>
        <Input
          bind:value={intervalInput}
          class="w-full"
          type="number"
          label="Interval"
        />
        <p class="text-sm text-white/50 mt-0.5">
          This will result in aproximately {calculatedFrames} frames
        </p>
      {:else}
        <span>Create x screencaps</span>
        <Input
          bind:value={frameInput}
          class="w-full"
          type="number"
          label="Frames"
        />
        <p class="text-sm text-white/50 mt-0.5">
          This will result in a screencap being made approximately every {calculatedInterval}
          seconds.
        </p>
      {/if}
    </div>
    <Button onclick={beginProcessing} class="mt-2">Next</Button>
  {/if}
</div>
