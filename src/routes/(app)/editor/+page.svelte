<script lang="ts">
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import { formatFileSize } from "$lib/formatting";
  import { activeProject, statusbar } from "$lib/state";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { copyFile, readDir, remove, size } from "@tauri-apps/plugin-fs";
  import { Pane, PaneGroup, PaneResizer } from "paneforge";
  import { onMount } from "svelte";
  import { Grid } from "svelte-virtual";
  import { get } from "svelte/store";
  import { twMerge } from "tailwind-merge";
  import { open } from "@tauri-apps/plugin-shell";

  let container = $state<HTMLDivElement | null>(null);
  let gridHeight = $state(500);
  let activeIndex = $state(-1);
  let grid = $state<any>(null);
  let assetCache = $state<Map<string, string>>(new Map());
  let baseDir = $state("");

  let frames = $state<{ frame: string; path: string; size: number }[]>([]);
  let favoritedFrames = $state<string[]>([]);

  onMount(() => {
    updateGridHeight();
    loadData();
  });

  function updateGridHeight() {
    gridHeight = container?.clientHeight ?? 200;
  }

  function keypress(event: KeyboardEvent) {
    console.log(event.key);
    if (event.key === "ArrowRight") {
      activeIndex = Math.min(activeIndex + 1, frames.length - 1);
      grid.scrollToIndex(activeIndex, "smooth");
    } else if (event.key === "ArrowLeft") {
      activeIndex = Math.max(activeIndex - 1, 0);
      grid.scrollToIndex(activeIndex, "smooth");
    } else if (event.key === "f") {
      favorite(frames[activeIndex]);
    }
  }

  async function loadData() {
    const project = get(activeProject);
    const dir = project?.dir;
    if (!dir) return;
    baseDir = dir;
    const framesDir = await readDir(`${dir}/frames`);
    const favoritedFramesDir = await readDir(`${dir}/favorites`);
    framesDir.forEach(async (frame) => {
      // match frame([0-9]+).png
      const match = frame.name.match(/frame(\d+)\.png/);
      if (match) {
        frames.push({
          frame: match[1],
          path: `${dir}/frames/${frame.name}`,
          size: await size(`${dir}/frames/${frame.name}`),
        });
      }
    });
    favoritedFramesDir.forEach((frame) => {
      // match frame([0-9]+).png
      const match = frame.name.match(/frame(\d+)\.png/);
      if (match) {
        favoritedFrames.push(match[1]);
      }
    });
  }

  function lazyloadAsset(path: string) {
    if (assetCache.has(path)) return assetCache.get(path);
    const assetUrl = convertFileSrc(path);
    assetCache.set(path, assetUrl);
    return assetUrl;
  }

  function favorite(frame: { frame: string; path: string }) {
    if (favoritedFrames.includes(frame.frame)) {
      favoritedFrames = favoritedFrames.filter((f) => f !== frame.frame);
      remove(`${baseDir}/favorites/frame${frame.frame}.png`);
    } else {
      favoritedFrames = [...favoritedFrames, frame.frame];
      copyFile(frame.path, `${baseDir}/favorites/frame${frame.frame}.png`);
    }
  }

  $effect(() => {
    statusbar.set({
      framesSize: formatFileSize(
        frames.reduce((acc, frame) => acc + frame.size, 0),
      ),
      framesAmount: frames.length,
      favoritesSize: formatFileSize(
        favoritedFrames.reduce(
          (acc, frame) =>
            acc + (frames.find((f) => f.frame === frame)?.size ?? 0),
          0,
        ),
      ),
      favoritesAmount: favoritedFrames.length,
    });
  });

  $effect(() => {
    frames = frames.sort((a, b) => parseInt(a.frame) - parseInt(b.frame));
  });

  function openProjectDirectory() {
    open(baseDir);
  }

  function openFramesDirectory() {
    open(`${baseDir}/frames`);
  }

  function openFavoritesDirectory() {
    open(`${baseDir}/favorites`);
  }
</script>

<svelte:window onresize={updateGridHeight} onkeydown={keypress} />

<div bind:this={container} class="h-full">
  <PaneGroup direction="horizontal" class="h-full">
    <Pane defaultSize={70}>
      <Grid
        bind:this={grid}
        itemCount={frames.length}
        itemHeight={150}
        itemWidth={150 * (16 / 9)}
        height={gridHeight}
        scrollBehavior="smooth"
        class="scrollbar"
      >
        {#snippet item({ index, style })}
          <button
            {style}
            class={twMerge(
              activeIndex === index
                ? "border-2 border-primary"
                : "border-2 border-dark-800",
            )}
            onclick={() => (activeIndex = index)}
            aria-label={`Frame ${frames[index].frame}`}
          >
            {#if favoritedFrames.includes(frames[index].frame)}
              <div
                class="bg-amber-500/50 absolute h-3 w-3 z-99 rounded-br-full"
              ></div>
            {/if}
            <img
              src={lazyloadAsset(frames[index].path)}
              alt={`Frame ${frames[index].frame}`}
              class={twMerge(
                "h-full w-full object-contain",
                activeIndex === index ? "opacity-100" : "opacity-75",
              )}
            />
          </button>
        {/snippet}
      </Grid>
    </Pane>
    <PaneResizer class="w-3 bg-transparent hover:bg-dark-800"></PaneResizer>
    <Pane defaultSize={30} class="border-l border-dark-800">
      {#if activeIndex >= 0}
        <div class="flex flex-col justify-between h-full">
          <div class="flex flex-col space-y-2">
            <img src={lazyloadAsset(frames[activeIndex]?.path)} alt="" />
            <div class="flex flex-col space-y-2 px-2">
              <Input value={frames[activeIndex]?.frame} readonly disabled />
              <Input value={frames[activeIndex]?.path} readonly disabled />
              <Input
                value={formatFileSize(frames[activeIndex]?.size)}
                readonly
                disabled
              />
              <Button onclick={() => favorite(frames[activeIndex])}>
                {#if favoritedFrames.includes(frames[activeIndex]?.frame)}
                  Unfavorite
                {:else}
                  Favorite
                {/if}
              </Button>
            </div>
          </div>
          <div class="flex flex-col space-y-2 p-2">
            <Button onclick={openProjectDirectory}>
              Open Project Directory
            </Button>
            <Button onclick={openFramesDirectory}>Open Frames Directory</Button>
            <Button onclick={openFavoritesDirectory}>
              Open Favorites Directory
            </Button>
          </div>
        </div>
      {:else}
        <div class="flex items-center justify-center h-full w-full">
          <p class="text-sm text-white/50">No frame selected</p>
        </div>
      {/if}
    </Pane>
  </PaneGroup>
</div>
