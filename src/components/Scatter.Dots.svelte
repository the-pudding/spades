<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { getContext } from "svelte";
  import Dot from "./Scatter.Dot.svelte";

  import forceCollideRect from "../utils/forceCollideRect.js";

  export let r;
  export let active;

  const { data, xGet, yGet } = getContext("LayerCake");
</script>

{#each $data as d}
  <Dot
    r="{r}"
    d="{d}"
    on:enter="{({ detail }) => (active = detail)}"
    on:exit="{({ detail }) => (active = null)}"
  />
{/each}
