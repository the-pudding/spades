<script>
  import { scaleSymlog, scaleLog, scalePow } from "d3-scale";
  import { LayerCake, Html } from "layercake";
  import Dots from "./Scatter.Dots.svelte";
  import bands from "../data/bands.csv";
  import members from "../data/members.csv";

  let active = false;

  const clean = (d) => ({
    ...d,
    followers: +d.followers,
    rank: d.rank ? +d.rank : 100,
  });

  const getBandData = (name) => {
    const match = bandData.find((d) => d.name === name);
    return { bandFollowers: match.followers, bandRank: match.rank };
  };

  const bandData = bands.map(clean);
  const memberData = members.map(clean).map((d) => ({
    ...d,
    ...getBandData(d.band),
  }));

  const ratioX = 1;
  const ratioY = 1;
  const fixedAspectRatio = ratioX / ratioY;

  const max = Math.max(
    ...memberData.map((d) => d.followers),
    ...bandData.map((d) => d.followers)
  );
  const yDomain = [0, max];
  const xDomain = [0, 100];
  const xRange = [0, ratioX * 100];
  const yRange = [ratioY * 100, 0];
  const yScale = scalePow().exponent(0.25);
</script>

<div class="chart-container">
  <figure style="padding-bottom: {100 / fixedAspectRatio}%">
    <LayerCake
      data="{memberData}"
      x="rank"
      y="followers"
      yDomain="{yDomain}"
      xDomain="{xDomain}"
      yScale="{yScale}"
      xRange="{xRange}"
      yRange="{yRange}"
      position="absolute"
      ssr="{true}"
      percentRange="{true}"
      custom="{{ fixedAspectRatio, active }}"
    >
      <Html>
        <Dots r="{8}" />
      </Html>
    </LayerCake>
    <LayerCake
      data="{bandData}"
      x="rank"
      y="followers"
      xDomain="{xDomain}"
      yScale="{yScale}"
      yDomain="{yDomain}"
      xRange="{xRange}"
      yRange="{yRange}"
      position="absolute"
      ssr="{true}"
      percentRange="{true}"
      custom="{{ fixedAspectRatio, active, type: 'band' }}"
    >
      <Html>
        <Dots r="{4}" bind:active />
      </Html>
    </LayerCake>
  </figure>
</div>

<style>
  .chart-container {
    width: 90%;
    max-width: 640px;
    margin: 0 auto;
  }

  figure {
    position: relative;
    width: 100%;
    border-bottom: 2px dashed gray;
    border-right: 2px dashed gray;
  }
</style>
