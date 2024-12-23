<div class="h-6 flex space-x-1 items-end">
  {#each Array(3) as _, i}
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <div class="bg-dark-600 w-2 loader" style="animation-delay:{i * 200}ms;" />
  {/each}
</div>

<style>
  .loader {
    height: 0%;
    animation: loading 1s infinite alternate;
  }

  @keyframes loading {
    0% {
      height: 0%;
    }
    100% {
      height: 100%;
    }
  }
</style>
