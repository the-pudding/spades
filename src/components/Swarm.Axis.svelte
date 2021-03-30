<script>
  import { format } from "d3-format";
  import { getContext } from "svelte";
  import Icon from "./helpers/Icon.svelte";
  const { xScale, rRange, width, height, custom } = getContext("LayerCake");

  $: ratio = $custom.aspectRatio;
  $: vertical = ratio < 1;
  $: x = vertical ? 1 / ratio : ratio;
  $: offset = $xScale(0) / x;
  $: moreSize = 100 - offset;
  $: styleMore = vertical
    ? `top: 0; height: ${moreSize}%;`
    : `right: 0; width: ${moreSize}%; left: auto;`;
  $: pad = ((($rRange[0] / 100) * $width) / ratio) * (vertical ? -1 : 2);
  $: styleAxis = `transform: translate${vertical ? "Y" : "X"}(${pad}px);`;
  $: ticks = [-20, -10, -5, -1, 1, 5, 10, 20].map((t) => {
    const value = t * 1000000;
    const f = format(".2s")(value).replace(".0", "");
    const prefix = value < 0 ? "" : "+";
    const text = `${prefix}${f}`;
    return { value, text };
  });

  $: getOffset = (value) => {
    return vertical
      ? `top: ${$xScale(value) / x}%;`
      : `left: ${$xScale(value) / x}%;`;
  };
</script>

<div class="axis" style="{styleAxis}">
  <div class="more" style="{styleMore}"></div>

  <div class="ticks">
    {#each ticks as { value, text }}
      <div class="tick" class:vertical style="{getOffset(value)}">
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

  .tick.vertical {
    border-left: none;
    height: 0;
    width: 100%;
    border-top: 1px dashed var(--gray-light);
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

  .tick.vertical p {
    transform: translate(-100%, -100%);
    text-align: right;
    padding-right: 0.5em;
  }

  .more {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--off-white);
  }
</style>
