<script lang="ts">
  import { twMerge } from "tailwind-merge";
  export let el: "button" | "a" = "button";
  export let disabled: boolean = false;
</script>

<svelte:element
  this={el}
  {...$$restProps}
  class={twMerge(
    $$props.class,
    "bg-dark-800 border border-dark-700 hover:border-dark-600 focus:border-dark-600 py-1 px-3",
    disabled && "opacity-50 cursor-not-allowed",
  )}
>
  <slot />
</svelte:element>
