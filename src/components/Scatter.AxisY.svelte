<script>
  import { timeFormat } from "d3-time-format";
  import { getContext } from "svelte";
  const { yScale, height } = getContext("LayerCake");

  $: ticks = $yScale.ticks(5);
  $: uniqueCount = [...new Set(ticks.map((d) => d.getFullYear()))].length;
  $: yearLevel = ticks.length === uniqueCount;
  $: format = yearLevel ? "%Y" : "%b %Y";
</script>

<div>
  {#each ticks as tick}
    <p style="transform: translate(0, {($yScale(tick) / 100) * $height}px)">
      {timeFormat(format)(tick)}
    </p>
  {/each}
</div>

<style>
  p {
    position: absolute;
    right: 0;
    top: 0;
    margin: 0;
    line-height: 1;
    transition: transform 500ms ease-out;
    font-size: 32px;
    font-weight: bold;
    color: var(--gray-light);
  }
</style>
