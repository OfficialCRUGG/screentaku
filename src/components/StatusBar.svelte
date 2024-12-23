<script>
  import { statusbar } from "$lib/state";
</script>

<div class="bg-dark-800 border-dark-700 border-t text-sm flex justify-between">
  <div class="flex divide-x divide-dark-600">
    {#if $statusbar.framesAmount !== null}
      <div class="px-4 py-1">
        {$statusbar.framesAmount} frames
        {#if $statusbar.framesSize}
          ({$statusbar.framesSize})
        {/if}
      </div>
    {/if}
    {#if $statusbar.favoritesAmount !== null}
      <div class="px-4 py-1">
        {$statusbar.favoritesAmount} favorites
        {#if $statusbar.favoritesSize}
          ({$statusbar.favoritesSize})
        {/if}
      </div>
    {/if}
  </div>
  <div class="py-1 pr-4">Screencap v0.1.0</div>
</div>
