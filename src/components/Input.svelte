<script lang="ts">
  import { twMerge } from "tailwind-merge";
  export let disabled: boolean = false;
  export let value: string | number;
</script>

<input
  {...$$restProps}
  {disabled}
  bind:value
  class={twMerge(
    $$props.class,
    "bg-dark-800 border border-dark-700 focus:border-dark-600 py-1 px-3",
    disabled && "opacity-50 cursor-not-allowed",
  )}
/>
