<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { clickoutside } from "@svelte-put/clickoutside";
  import { closeProject, newProject, openProject } from "../lib/projects";

  const menus = [
    {
      name: "Screencap",
      items: [
        { id: "about", name: "About Screencap", action: () => {} },
        { id: "quit", name: "Quit", action: () => {} },
      ],
    },
    {
      name: "File",
      items: [
        { id: "newProject", name: "New Project...", action: newProject },
        { id: "openProject", name: "Open Project...", action: openProject },
        { id: "closeProject", name: "Close Project", action: closeProject },
      ],
    },
  ];

  let activeMenu = $state<null | number>(null);
</script>

<div class="bg-dark-800 w-full flex justify-between z-9999">
  <div class="flex">
    {#each menus as { name, items }, i}
      <div
        use:clickoutside
        onclickoutside={() => {
          if (activeMenu === i) activeMenu = null;
        }}
        class="relative"
      >
        <button
          class={twMerge(
            "px-4 py-1 text-white",
            activeMenu === i ? "bg-dark-700" : "hover:bg-dark-700",
          )}
          onclick={() =>
            activeMenu === i ? (activeMenu = null) : (activeMenu = i)}
          onmouseenter={() => {
            if (activeMenu !== null) activeMenu = i;
          }}
        >
          {name}
        </button>
        {#if activeMenu === i}
          <div class="absolute top-full left-0 bg-dark-800">
            {#each items as item, j}
              <button
                class="w-full px-4 py-1 text-white hover:bg-dark-700 whitespace-nowrap text-left"
                onclick={() => {
                  activeMenu = null;
                  if (item.action) item.action();
                }}
              >
                {item.name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
