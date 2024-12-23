<script lang="ts">
  import MenuBar from "$components/MenuBar.svelte";
  import StatusBar from "$components/StatusBar.svelte";

  import "../app.css";
</script>

<div class="bg-dark-900 text-white h-screen flex flex-col overflow-hidden">
  <div class="flex flex-col h-full overflow-hidden">
    <MenuBar />
    <div class="flex-1 overflow-y-auto">
      <slot />
    </div>
  </div>
  <StatusBar />
</div>
