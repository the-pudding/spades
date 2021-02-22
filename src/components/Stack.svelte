<script>
  import { scaleSymlog, scaleLog, scalePow } from "d3-scale";
  import { LayerCake, Html } from "layercake";
  import Dots from "./Scatter2.Dots.svelte";
  import bands from "../data/bands.csv";
  import members from "../data/members.csv";

  const prop = "followers";

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
  // const memberData = members.map(clean);
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
  const yScale = scalePow().exponent(0.25);
</script>

<div class="chart-container">
  <figure style="padding-bottom: {100 / fixedAspectRatio}%">
    <p class="line"></p>
    <LayerCake
      data="{memberData}"
      x="bandFollowers"
      y="followers"
      xDomain="{yDomain}"
      yDomain="{yDomain}"
      yScale="{yScale}"
      xScale="{yScale}"
      xRange="{[0, ratioX * 100]}"
      yRange="{[ratioY * 100, 0]}"
      position="absolute"
      ssr="{true}"
      percentRange="{true}"
      custom="{{ fixedAspectRatio }}"
    >
      <Html>
        <Dots r="{6}" />
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
    background: tan;
  }

  p {
    position: absolute;
    top: 100%;
    left: 0;
    width: 141%;
    height: 1px;
    border-top: 1px dashed black;
    margin: 0;
    transform-origin: 0 0;
    transform: rotate(-45deg);
  }
</style>
