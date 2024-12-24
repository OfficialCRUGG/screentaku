<script lang="ts">
  import MenuBar from "$components/MenuBar.svelte";
  import StatusBar from "$components/StatusBar.svelte";
</script>

<div class="flex flex-col h-full overflow-hidden">
  <MenuBar />
  <div class="flex-1 overflow-y-auto">
    <slot />
  </div>
</div>
<StatusBar />
