<script lang="ts">
  import Loader from "$components/Loader.svelte";
  import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
  import {
    arch,
    family,
    locale,
    platform,
    version,
  } from "@tauri-apps/plugin-os";
  import { onMount } from "svelte";
  import appLogo from "../../assets/applogo.png";

  let loading = $state(true);

  let appVersion = $state<string | null>(null);
  let tauriVersion = $state<string | null>(null);

  let osArch = $state<string | null>(null);
  let osFamily = $state<string | null>(null);
  let osLocale = $state<string | null>(null);
  let osPlatform = $state<string | null>(null);
  let osVersion = $state<string | null>(null);

  let container: HTMLDivElement | null = null;

  const promises: Promise<void>[] = [];

  const platforms: Record<string, string> = {
    linux: "Linux",
    macos: "macOS",
    ios: "iOS",
    freebsd: "FreeBSD",
    dragonfly: "DragonFly BSD",
    netbsd: "NetBSD",
    openbsd: "OpenBSD",
    android: "Android",
    windows: "Windows",
  };

  function run(cb: () => Promise<any>) {
    promises.push(cb());
  }

  onMount(() => {
    run(async () => (appVersion = await getVersion()));
    run(async () => (tauriVersion = await getTauriVersion()));
    osArch = arch();
    osFamily = family();
    run(async () => (osLocale = await locale()));
    osPlatform = platform();
    osVersion = version();

    Promise.all(promises).then(() => {
      console.log("All promises resolved");
      console.log("uwu");
      loading = false;
    });

    // Loop over all child elements of container recursively and add the "data-tauri-drag-region" attribute
    function addDragRegion(element: Element) {
      element.setAttribute("data-tauri-drag-region", "");
      element.childNodes.forEach((child: Node) => {
        if (child instanceof Element) {
          addDragRegion(child);
        }
      });
    }

    if (container) {
      addDragRegion(container);
    }
  });
</script>

<div
  class="flex flex-col px-4 items-center h-full text-center justify-between"
  data-tauri-drag-region
  bind:this={container}
>
  <div class="flex flex-col pt-16 items-center">
    <img src={appLogo} class="h-32 w-32 flex-shrink-0" alt="" />
    <h1 class="text-2xl font-bold mt-6">Screentaku</h1>
    <p class="text-lg text-white/75 text-balance">
      A tool for creating and filtering screencaps from videos
    </p>
    <p class="text-sm text-white/50 mt-4">Developed by CRUGG</p>
  </div>
  <div class="flex flex-col space-y-1 text-sm text-white/50 py-4">
    {#if loading}
      <Loader />
    {:else}
      <p>Screentaku {appVersion} | Tauri {tauriVersion}</p>
      <div class="flex flex-col text-xs text-white/25">
        <p>
          {osPlatform ? platforms[osPlatform] ?? osPlatform : osPlatform}
          {osVersion} ({osFamily}) | {osArch} | {osLocale}
        </p>
      </div>
    {/if}
  </div>
</div>
