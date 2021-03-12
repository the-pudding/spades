<script>
  import { scaleLinear, scalePow, scaleTime } from "d3-scale";
  import { min, max, extent, groups } from "d3-array";
  import { LayerCake, Html } from "layercake";
  import viewport from "../stores/viewport.js";
  import cleanData from "../utils/cleanData.js";
  import Sets from "./Scatter.Sets.svelte";
  import AxisY from "./Scatter.AxisY.svelte";
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

  const getActiveDates = (band) => {
    if (!band) return null;
    const [key, data] = groupedData.find(([key]) => key === band);
    const flatDates = [].concat(...data.map((d) => d.dates));
    return extent(flatDates);
  };

  const memberClean = members.map(cleanData);
  const bandClean = bands.map(cleanData);

  const bandData = bandClean.filter(hasMemberHit);
  const memberData = memberClean.filter((d) => d.hits);
  const flatData = bandData.concat(memberData);
  const groupedData = groups(flatData, (d) => d.band);

  const getMin = (prop) => min(flatData, (d) => d[prop]);
  const getMax = (prop) => max(flatData, (d) => d[prop]);

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

  const yProp = "topDate";
  const xProp = "topRank";
  const xDomain = domains[xProp];
  const yDomain = domains[yProp];
  const xScale = scales[xProp];
  const yScale = scales[yProp];

  let activeBand = null;

  $: ratioX = $viewport.width || 1;
  $: ratioY = $viewport.height || 1;
  $: aspectRatio = ratioX / ratioY;
  $: xRange = [0, 100];
  $: yRange = [5, 95];
  $: activeDates = getActiveDates(activeBand);
</script>

<div class="chart-container">
  <figure style="padding-bottom: {100 / aspectRatio}%">
    {#each groupedData as [key, data]}
      <LayerCake
        data="{data}"
        x="{xProp}"
        y="{yProp}"
        xDomain="{xDomain}"
        yDomain="{activeDates || yDomain}"
        xScale="{xScale}"
        yScale="{yScale}"
        xRange="{xRange}"
        yRange="{yRange}"
        position="absolute"
        ssr="{true}"
        percentRange="{true}"
        custom="{{ aspectRatio, xProp, yProp, activeBand }}"
      >
        <Html>
          <AxisY />
          <Sets r="{4}" />
        </Html>
      </LayerCake>
    {/each}
  </figure>
  <nav>
    <select bind:value="{activeBand}">
      <option value="">Show all</option>
      {#each groupedData as [key]}
        <option>{key}</option>
      {/each}
    </select>
    <select bind:value="{activeBand}">
      <option value="">Show all</option>
      {#each memberData as { spotifyName, band }}
        <option value="{band}">{spotifyName}</option>
      {/each}
    </select>
  </nav>
</div>

<style>
  .chart-container {
    width: 100%;
    margin: 0;
  }

  figure {
    position: relative;
    width: 100%;
  }

  nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
</style>
