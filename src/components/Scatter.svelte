<script>
  import { scaleLinear, scalePow } from "d3-scale";
  import { LayerCake, Html } from "layercake";
  import viewport from "../stores/viewport.js";
  import Dots from "./Scatter.Dots.svelte";
  import bands from "../data/bands.csv";
  import members from "../data/members.csv";

  const clean = (d) => ({
    ...d,
    followers: +d.followers,
    rank: d.rank ? +d.rank : 100,
  });

  const getBandData = (name) => {
    const match = bandData.find((d) => d.name === name);
    return { bandfollowers: match.followers, bandrank: match.rank };
  };
  const bandData = bands.map(clean);
  const memberData = members.map(clean).map((d) => ({
    ...d,
    ...getBandData(d.band),
  }));

  const maxFollowers = Math.max(
    ...memberData.map((d) => d.followers),
    ...bandData.map((d) => d.followers)
  );

  const domains = {
    followers: [0, maxFollowers],
    rank: [1, 100],
  };
  const scales = {
    followers: scalePow().exponent(0.25),
    rank: scaleLinear(),
  };

  const xProp = "rank";
  const yProp = "followers";
  const xDomain = domains[xProp];
  const yDomain = domains[yProp];
  const xScale = scales[xProp];
  const yScale = scales[yProp];

  let active = false;
  let ratioX = 1;
  let ratioY = 1;

  $: ratioX = $viewport.width;
  $: ratioY = $viewport.height;
  $: fixedAspectRatio = ratioX / ratioY;
  $: xRange = [0, 100];
  $: yRange = [100, 0];
</script>

<div class="chart-container">
  <figure style="padding-bottom: {100 / fixedAspectRatio}%">
    <LayerCake
      data="{memberData}"
      x="{xProp}"
      y="{yProp}"
      xDomain="{xDomain}"
      yDomain="{yDomain}"
      xScale="{xScale}"
      yScale="{yScale}"
      xRange="{xRange}"
      yRange="{yRange}"
      position="absolute"
      ssr="{true}"
      percentRange="{true}"
      custom="{{ fixedAspectRatio, active, xProp, yProp }}"
    >
      <Html>
        <Dots r="{8}" />
      </Html>
    </LayerCake>
    <LayerCake
      data="{bandData}"
      x="{xProp}"
      y="{yProp}"
      xDomain="{xDomain}"
      yDomain="{yDomain}"
      xScale="{xScale}"
      yScale="{yScale}"
      xRange="{xRange}"
      yRange="{yRange}"
      position="absolute"
      ssr="{true}"
      percentRange="{true}"
      custom="{{ fixedAspectRatio, active, xProp, yProp, type: 'band' }}"
    >
      <Html>
        <Dots r="{4}" bind:active />
      </Html>
    </LayerCake>
  </figure>
</div>

<style>
  .chart-container {
    width: 100%;
    /* max-width: 100%; */
    margin: 0 auto;
    overflow: hidden;
  }

  figure {
    position: relative;
    width: 100%;
    border-bottom: 2px dashed gray;
    border-right: 2px dashed gray;
  }
</style>
