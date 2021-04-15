<script>
  import { timeFormat } from "d3-time-format";
  import { getContext } from "svelte";
  import mq from "../stores/mq.js";

  const { yScale } = getContext("LayerCake");

  $: ticks = $yScale.ticks(5);
  $: format = "%Y";
  $: dur = $mq.reducedMotion ? 0 : 1000;
</script>

<div>
  {#each ticks as tick}
    <p style="--dur: {dur}ms; transform: translate(0, {$yScale(tick)}px);">
      {timeFormat(format)(tick)}
    </p>
  {/each}
</div>

<style>
  p {
    --dur: 1000ms;
    position: absolute;
    right: 0;
    top: 0;
    margin: 0;
    line-height: 1;
    transition: transform var(--dur) ease-in-out;
    font-size: 32px;
    font-weight: bold;
    color: var(--gray);
  }
</style>
