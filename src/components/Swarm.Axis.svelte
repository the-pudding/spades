<script>
  import { getContext } from "svelte";
  import Icon from "./helpers/Icon.svelte";
  const { xScale, custom } = getContext("LayerCake");
  $: left = $xScale(0) / $custom.aspectRatio;
</script>

<div style="left: {left}%;">
  <p><Icon name="arrow-left" /> Fewer Followers</p>
  <p>More Followers <Icon name="arrow-right" /></p>
</div>

<style>
  div {
    position: absolute;
    top: 0;
  }

  p {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 12px;
    line-height: 1;
    width: 14em;
    padding-left: 4em;
    text-transform: uppercase;
    font-weight: bold;
    color: var(--gray-dark);
    display: flex;
  }

  p:first-of-type {
    transform: translateX(-100%);
    text-align: right;
    padding: 0;
  }
</style>
