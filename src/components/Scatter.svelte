<script>
  import { scaleLinear, scalePow, scaleTime } from "d3-scale";
  import { min, max } from "d3-array";
  import { LayerCake, Html } from "layercake";
  import viewport from "../stores/viewport.js";
  import cleanData from "../utils/cleanData.js";
  import Sets from "./Scatter.Sets.svelte";
  import bands from "../data/bands.csv";
  import members from "../data/members.csv";

  const getBandData = (name) => {
    const match = bandData.find((d) => d.name === name);
    return { bandfollowers: match.followers, bandrank: match.rank };
  };

  // filter out bands with no member hits
  const hasMemberHit = ({ name }) => {
    const m = memberClean.filter((d) => d.band === name);
    const hasHit = m.find((d) => d.hits);
    return !!hasHit;
  };

  const memberClean = members.map(cleanData);
  const bandClean = bands.map(cleanData);

  const bandData = bandClean.filter(hasMemberHit);

  const memberData = memberClean.filter((d) => d.hits);

  const getMin = (prop) => {
    return min([
      ...memberData.map((d) => d[prop]),
      ...bandData.map((d) => d[prop]),
    ]);
  };

  const getMax = (prop) => {
    return max([
      ...memberData.map((d) => d[prop]),
      ...bandData.map((d) => d[prop]),
    ]);
  };

  const maxFollowers = getMax("followers");
  const maxHits = getMax("hits");
  const maxYear = getMax("topYear");
  const minYear = getMin("topYear");
  const maxDate = getMax("topDate");
  const minDate = getMin("topDate");

  const domains = {
    followers: [0, maxFollowers],
    hits: [0, maxHits],
    topRank: [1, 100],
    topYear: [minYear, maxYear],
    topDate: [minDate, maxDate],
  };
  const scales = {
    followers: scalePow().exponent(0.25),
    hits: scaleLinear(),
    topRank: scaleLinear(),
    topYear: scaleLinear(),
    topDate: scaleTime(),
  };

  const xProp = "topDate";
  const yProp = "topRank";
  const xDomain = domains[xProp];
  const yDomain = domains[yProp];
  const xScale = scales[xProp];
  const yScale = scales[yProp];

  let active = false;

  $: ratioX = $viewport.width || 1;
  $: ratioY = $viewport.height || 1;
  $: aspectRatio = 1 / 1;
  $: xRange = [0, 100];
  $: yRange = [0, 100];
</script>

<div class="chart-container">
  <p>{yProp} vs {xProp}</p>
  <figure style="padding-bottom: {100 / aspectRatio}%">
    <LayerCake
      data="{memberData.filter((d) => d.band === "Destiny's Child")}"
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
      custom="{{ aspectRatio, active, xProp, yProp }}"
    >
      <Html>
        <Sets r="{4}" />
      </Html>
    </LayerCake>
  </figure>
</div>

<style>
  .chart-container {
    width: 90%;
    margin: 2em auto;
    /* overflow: hidden; */
  }

  figure {
    position: relative;
    width: 100%;
    border-bottom: 2px dashed gray;
    border-left: 2px dashed gray;
  }
</style>
