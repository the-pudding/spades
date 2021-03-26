<script>
  import { onMount } from "svelte";
  import { scaleLinear, scalePow, scaleTime } from "d3-scale";
  import { min, max, extent, groups, ascending } from "d3-array";
  import { LayerCake, Html } from "layercake";
  import mq from "../stores/mq.js";
  import viewport from "../stores/viewport.js";
  import cleanData from "../utils/cleanData.js";
  import Shadow from "./Scatter.Shadow.svelte";
  import Sets from "./Scatter.Sets.svelte";
  import AxisY from "./Scatter.AxisY.svelte";
  import Legend from "./Scatter.Legend.svelte";
  import bands from "../data/bands.csv";
  import members from "../data/members.csv";
  import scatterDimensions from "../data/scatterDimensions.csv";

  export let scatterBands;
  export let activeBand;

  let mounted = false;

  const PAD = 16;
  const MAX_SONG_WIDTH = max(scatterDimensions, (d) => +d.width);

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

  groupedData.sort((a, b) => ascending(a[0], b[0]));

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

  flatData.sort((a, b) => ascending(a.band, b.band));

  $: mobile = !$mq.lg;
  $: ratioX = $viewport.width || 1;
  $: ratioY = $viewport.height || 1;
  $: aspectRatio = ratioX / ratioY;
  $: xRange = [PAD, ratioX - MAX_SONG_WIDTH - PAD];
  $: yRange = [PAD * 6, ratioY - PAD * 10];
  $: activeDates = getActiveDates(activeBand);
  $: currentBand = groupedData.find(([key]) => key === activeBand);

  onMount(() => {
    mounted = true;
    scatterBands = groupedData.map(([key, data]) =>
      data.map((d) => ({
        name: d.spotifyName,
        count: d.ranks.length,
      }))
    );
  });
</script>

<!-- <Shadow data="{flatData}" /> -->

{#if mounted}
  <div class="chart-container">
    {#if mobile}
      <table>
        <thead>
          <th>Name</th>
          <th>Top 100s</th>
          <th>#1 Hits</th>
        </thead>
        <tbody
          >{#each flatData as { spotifyName, ranks, isBand }}
            <tr class:isBand>
              <td>{spotifyName}</td>
              <td>{ranks.length}</td>
              <td>{ranks.filter((d) => d === 1).length}</td>
            </tr>
          {/each}</tbody
        >
      </table>
    {:else}
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
            custom="{{ aspectRatio, xProp, yProp, activeBand }}"
          >
            <Html>
              <AxisY />
              <Sets key="{key}" />
            </Html>
          </LayerCake>
        {/each}
      </figure>
    {/if}
  </div>
{/if}

<style>
  .chart-container {
    width: 100%;
    margin: 0;
  }

  figure {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  figure:before {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 2rem;
    background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 0) 0,
      var(--bg) 67%,
      var(--bg) 100%
    );
    content: "";
    z-index: var(--z-top);
  }

  figure:after {
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 2rem;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0,
      var(--bg) 67%,
      var(--bg) 100%
    );
    content: "";
    z-index: var(--z-top);
  }

  td,
  th {
    text-align: right;
  }

  td:first-of-type,
  th:first-of-type {
    text-align: left;
  }

  tr.isBand td {
    background: var(--off-white);
  }

  td {
    background: var(--white);
  }

  td:first-of-type {
    padding-left: 1em;
  }

  tr.isBand td:first-of-type {
    padding-left: 0.25em;
  }

  @media only screen and (min-width: 1024px) {
    .chart-container {
      padding: 2em;
    }
  }
</style>
