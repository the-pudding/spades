<script>
  import { onMount } from "svelte";
  import { timeFormat } from "d3-time-format";
  import { scaleLinear, scalePow, scaleTime } from "d3-scale";
  import { min, max, extent, groups, ascending, descending } from "d3-array";
  import { csvParse } from "d3-dsv";
  import { LayerCake, Html } from "layercake";
  import mq from "../stores/mq.js";
  import viewport from "../stores/viewport.js";
  import cleanData from "../utils/cleanData.js";
  import Shadow from "./Scatter.Shadow.svelte";
  import Sets from "./Scatter.Sets.svelte";
  import AxisY from "./Scatter.AxisY.svelte";
  import Table from "./Scatter.Table.svelte";
  import scatterDimensions from "../data/scatterDimensions.csv";

  export let scatterBands;
  export let activeBand;
  export let downloadData;
  export let showTable;

  let mounted = false;
  let groupedWithPreviewData = [];
  let flatData = [];
  let audioEl;
  let xDomain;
  let yDomain;
  let xScale;
  let yScale;
  let maxFollowers;
  let maxHits;
  let maxDate;
  let minDate;
  let domains;

  const PAD = 16;
  const MAX_SONG_WIDTH = max(scatterDimensions, (d) => +d.width);

  const getMin = (data, prop) => min(data, (d) => d[prop]);
  const getMax = (data, prop) => max(data, (d) => d[prop]);

  const shorten = (name) => {
    if (name === "The Pussycat Dolls") return "Pussycat Dolls";
    else if (name === "New Kids On The Block") return "NKOTB";
    return name;
  };

  // filter out bands with no member hits
  const hasMemberHit = (data, name) => {
    const m = data.filter((d) => d.band === name);
    const hasHit = m.find((d) => d.hits);
    return !!hasHit;
  };

  const getActiveDates = (datas, band) => {
    if (!band || !datas.length) return null;
    const [key, data] = datas.find(([key]) => key === band);
    const flatDates = [].concat(...data.map((d) => d.dates));
    return extent(flatDates);
  };

  const onPreview = ({ detail }) => {
    if (detail) {
      audioEl.volume = 0.3;
      audioEl.src = detail;
      audioEl.play();
    }
  };

  const stopAudio = () => {
    if (audioEl && audioEl.src) audioEl.pause();
  };

  const scales = {
    followers: scalePow().exponent(0.25),
    hits: scaleLinear(),
    topRank: scaleLinear(),
    topDate: scaleTime(),
  };

  const yProp = "topDate";
  const xProp = "topRank";

  $: mobile = !$mq.lg;
  $: ratioX = $viewport.width || 1;
  $: ratioY = $viewport.height || 1;
  $: aspectRatio = ratioX / ratioY;
  $: xRange = [PAD, ratioX - MAX_SONG_WIDTH - PAD];
  $: yRange = [PAD * 6, ratioY - PAD * 10];
  $: activeDates = getActiveDates(groupedWithPreviewData, activeBand);
  $: currentBand = groupedWithPreviewData.find(([key]) => key === activeBand);
  $: currentBand, stopAudio();

  onMount(async () => {
    const members = await fetch("assets/members.csv");
    const membersText = await members.text();
    const memberClean = csvParse(membersText).map(cleanData);
    const bands = await fetch("assets/bands.csv");
    const bandsText = await bands.text();
    const bandClean = csvParse(bandsText).map(cleanData);

    const bandData = bandClean.filter((d) => hasMemberHit(memberClean, d.name));
    const memberData = memberClean.filter((d) => d.hits);

    flatData = bandData.concat(memberData);

    const groupedData = groups(flatData, (d) => d.band);

    groupedData.sort((a, b) => ascending(a[0], b[0]));
    groupedData.forEach(([key, artists]) => {
      artists.sort(
        (c, d) =>
          descending(c.name === key, d.name === key) ||
          descending(c.dates.length, d.dates.length)
      );
    });

    maxFollowers = getMax(flatData, "followers");
    maxHits = getMax(flatData, "hits");
    maxDate = getMax(flatData, "topDate");
    minDate = getMin(flatData, "topDate");

    domains = {
      followers: [0, maxFollowers],
      hits: [0, maxHits],
      topRank: [1, 100],
      topDate: [minDate, maxDate],
    };

    xDomain = domains[xProp];
    yDomain = domains[yProp];
    xScale = scales[xProp];
    yScale = scales[yProp];

    flatData.sort((a, b) => ascending(a.band, b.band));
    downloadData = flatData.reduce((previous, current) => {
      const rows = current.dates.map((d, i) => ({
        name: current.spotifyName,
        band: current.band === current.name ? null : current.band,
        title: current.titles[i],
        peak_date: timeFormat("%Y-%m-%d")(d),
        peak_rank: current.ranks[i],
      }));
      return previous.concat(rows);
    }, []);
    scatterBands = groupedData.map(([key, data]) =>
      data.map((d) => ({
        name: d.spotifyName,
        count: d.ranks.length,
      }))
    );

    const response = await fetch("assets/tracks.csv");
    const text = await response.text();
    const tracks = csvParse(text);

    const getPreviews = (d) => {
      const previews = d.titles.map((title) => {
        const match = tracks.find(
          (t) => t.name === d.spotifyName && t.title === title
        );
        return match ? match.preview : null;
      });
      return previews;
    };

    groupedWithPreviewData = groupedData.map(([key, data]) => {
      const dataWithTrack = data.map((d) => ({
        ...d,
        previews: getPreviews(d),
      }));
      return [key, dataWithTrack];
    });

    mounted = true;
  });
</script>

<!-- <Shadow data="{flatData}" /> -->

{#if mounted}
  <div class="chart-container" class:is-visible="{!showTable}">
    {#if mobile}
      <figure class="bars">
        {#each flatData as { spotifyName, ranks, isBand }}
          <div class="artist" class:isBand>
            <div class="info">
              <span class="name">{shorten(spotifyName)}</span>
            </div>
            <div class="bar">
              <div
                class="inner"
                data-name="{spotifyName}"
                style="width: {(ranks.length / maxHits) * 100}%"
              >
                <span>{ranks.length}</span>
              </div>
            </div>
          </div>
        {/each}
      </figure>
    {:else}
      <figure style="padding-bottom: {100 / aspectRatio}%">
        {#each groupedWithPreviewData as [key, data]}
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
              <Sets key="{key}" on:preview="{onPreview}" />
            </Html>
          </LayerCake>
        {/each}
      </figure>
    {/if}
  </div>
  <div class="table-container" class:is-visible="{showTable}">
    <Table data="{flatData}" />
  </div>
{/if}

<audio bind:this="{audioEl}" src=""> </audio>

<style>
  .chart-container {
    width: 100%;
    margin: 0;
    display: none;
  }

  .table-container {
    display: none;
    max-width: 40em;
    margin: 0 auto;
  }

  .is-visible {
    display: block;
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

  figure.bars:before,
  figure.bars:after {
    display: none;
  }

  figure.bars .artist {
    display: flex;
    margin-bottom: 0.25em;
    align-items: center;
  }

  .bars .info {
    width: 9em;
    text-align: right;
    padding-right: 0.5em;
    line-height: 1;
  }

  .isBand {
    margin-top: 1em;
  }

  .isBand .info {
    font-weight: bold;
    color: var(--node-0);
  }

  .bars .bar {
    flex: 1;
    height: 1.5em;
  }

  .bars .inner {
    position: relative;
    height: 100%;
    text-align: right;
    line-height: 1;
    background: var(--gray-light);
  }

  .bars .isBand .inner {
    background: var(--node-0);
  }

  .inner[data-name="Beyoncé"] span {
    transform: translate(0, -50%);
    right: 0.5em;
  }

  .inner span {
    display: block;
    position: absolute;
    top: 50%;
    right: -0.5em;
    transform: translate(100%, -50%);
    white-space: nowrap;
  }

  @media only screen and (min-width: 1024px) {
    .chart-container {
      padding: 0 2em;
    }
  }
</style>
