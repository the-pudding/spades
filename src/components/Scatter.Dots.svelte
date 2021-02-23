<script>
  import { getContext } from "svelte";
  import Dot from "./Scatter.Dot.svelte";

  export let r;
  export let active;

  const { data } = getContext("LayerCake");
</script>

{#each $data as d}
  <Dot
    r="{r}"
    d="{d}"
    on:enter="{({ detail }) => (active = detail)}"
    on:exit="{({ detail }) => (active = null)}"
  />
{/each}
