<script>
  import { scaleSymlog, scaleLog, scalePow } from "d3-scale";
  import { LayerCake, Html } from "layercake";
  import viewport from "../stores/viewport.js";
  import Nodes from "./Swarm.Nodes.svelte";
  import Labels from "./Swarm.Labels.svelte";
  import bands from "../data/bands.csv";
  import members from "../data/members.csv";

  const prop = "followers";

  const getBandAmount = (name) => {
    const match = bands.find((d) => d.name === name);
    return +match[prop];
  };

  const getDelta = (d) => {
    const comp = getBandAmount(d.band);
    return +d[prop] - comp;
  };

  const data = members
    .filter((d) => d.id)
    .map((d) => ({
      ...d,
      followers: +d.followers,
      delta: getDelta(d),
    }));

  $: ratioX = $viewport.width || 2;
  $: ratioY = $viewport.height || 1;
  $: aspectRatio = 2 / 1;
</script>

<div class="chart-container">
  <figure style="padding-bottom: {100 / aspectRatio}%">
    <LayerCake
      data="{data}"
      x="delta"
      r="followers"
      rRange="{[4, 16]}"
      xScale="{scalePow().exponent(0.5)}"
      xRange="{[0, aspectRatio * 100]}"
      yRange="{[0, 100]}"
      position="absolute"
      ssr="{true}"
      percentRange="{true}"
      custom="{{ aspectRatio }}"
    >
      <Html>
        <Nodes r="{4}" />
      </Html>
    </LayerCake>
  </figure>
</div>

<style>
  .chart-container {
    max-width: 80%;
    margin: 0 auto;
  }

  figure {
    position: relative;
    width: 100%;
  }
</style>
