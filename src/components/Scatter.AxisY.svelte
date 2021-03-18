<script>
  import { timeFormat } from "d3-time-format";
  import { getContext } from "svelte";
  const { yScale } = getContext("LayerCake");

  $: ticks = $yScale.ticks(5);
  $: format = "%Y";
</script>

<div>
  {#each ticks as tick}
    <p style="transform: translate(0, {$yScale(tick)}px)">
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
    transition: transform 1000ms ease-in-out;
    font-size: 32px;
    font-weight: bold;
    color: var(--gray-light);
  }
</style>
