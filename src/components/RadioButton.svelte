<script lang="ts">
  export let value = "";
  export let key = "";
  export let label = "";
  export let onclick;
</script>

<button {onclick} class="flex items-center space-x-2">
  <div
    class="bg-dark-800 border border-dark-700 h-4 w-4 rounded-full flex items-center justify-center"
  >
    {#if value === key}
      <div class="bg-primary h-2 w-2 rounded-full"></div>
    {/if}
  </div>
  <span>{label}</span>
</button>
