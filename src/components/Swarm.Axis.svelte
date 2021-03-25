<script>
  import { format } from "d3-format";
  import { getContext } from "svelte";
  import Icon from "./helpers/Icon.svelte";
  const { xScale, rRange, width, custom } = getContext("LayerCake");
  $: ratio = $custom.aspectRatio;
  $: left = $xScale(0) / ratio;
  $: ticks = [
    -20000000,
    -10000000,
    -5000000,
    -1000000,
    1000000,
    5000000,
    10000000,
    20000000,
  ].map((value) => {
    const f = format(".2s")(value).replace(".0", "");
    const prefix = value < 0 ? "" : "+";
    const text = `${prefix}${f}`;
    return { value, text };
  });
  $: pad = ((($rRange[0] / 100) * $width) / ratio) * 2;
</script>

<div class="axis" style="transform: translateX({pad}px);">
  <div class="more" style="left: {left}%; width:{100 - left}%;"></div>

  <div class="labels" style="left: {left}%; ">
    <!-- <p class="label"><Icon name="arrow-left" /> Fewer Followers</p>
  <p class="label">
    More Followers <Icon name="arrow-right" />
  </p> -->
  </div>

  <div class="ticks">
    {#each ticks as { value, text }}
      <div class="tick" style="left: {$xScale(value) / ratio}%">
        <p>{text}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .axis {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .labels {
    position: absolute;
    top: 0;
  }

  .label {
    position: absolute;
    margin: 0;
    padding: 0;
    top: 0;
    left: 0;
    font-size: 12px;
    line-height: 1;
    text-transform: uppercase;
    font-weight: bold;
    color: var(--gray-dark);
    display: flex;
    /* white-space: nowrap; */
  }

  /* .label:first-of-type {
    transform: translate(-100%, -100%);
    text-align: right;
  }

  .label:last-of-type {
    transform: translate(0, -100%);
    padding-left: 1em;
  } */

  .ticks {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .tick {
    position: absolute;
    top: 0;
    height: 100%;
    border-left: 1px dashed var(--gray-light);
  }

  .tick p {
    transform: translate(-50%, -100%);
    font-size: 12px;
    margin: 0;
    padding: 0;
    line-height: 1;
    font-weight: bold;
    color: var(--gray-dark);
  }

  .more {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: var(--off-white);
  }
</style>
