<script>
  import { scaleSymlog, scaleLog, scalePow } from "d3-scale";
  import { LayerCake, Html } from "layercake";
  import Dots from "./Swarm.Dots.svelte";
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

  const ratioX = 2;
  const ratioY = 1;
  const fixedAspectRatio = ratioX / ratioY;
</script>

<div class="chart-container">
  <figure style="padding-bottom: {100 / fixedAspectRatio}%">
    <LayerCake
      data="{data}"
      x="delta"
      r="followers"
      rRange="{[2, 8]}"
      xScale="{scalePow().exponent(0.5)}"
      yDomain="{[0, ratioY * 100]}"
      xRange="{[0, ratioX * 100]}"
      position="absolute"
      ssr="{true}"
      percentRange="{true}"
      custom="{{ fixedAspectRatio }}"
    >
      <Html>
        <Dots r="{4}" />
      </Html>
    </LayerCake>
  </figure>
</div>

<style>
  .chart-container {
    width: 90%;
    /* max-width: 960px; */
    margin: 0 auto;
  }

  figure {
    position: relative;
    width: 100%;
    /* background: pink; */
  }
</style>
