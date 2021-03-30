<script>
  import { descending } from "d3-array";
  import Meta from "./Meta.svelte";
  import Header from "./pudding/Header.svelte";
  import Intro from "./Intro.svelte";
  import Swarm from "./Swarm.svelte";
  import Scatter from "./Scatter.svelte";
  import Prose from "./Prose.svelte";
  import FigureInfo from "./FigureInfo.svelte";
  import FigureSource from "./FigureSource.svelte";
  import Footer from "./pudding/Footer.svelte";
  import copy from "../data/doc.json";
  import mq from "../stores/mq.js";

  let scatterActiveBand;
  let scatterBands = [];
  let scatterEl;
  let downloadSwarmData;
  let downloadScatterData;

  const setMemberText = (band) => {
    const post = band ? "" : "and members";

    if (!band) return post;
    const people = scatterBands
      .find((d) => d[0].name === scatterActiveBand)
      .slice(1);
    people.sort((a, b) => descending(a.count, b.count));
    const names = people.map(
      (d, i) => `<span class="node node-${i + 1}">${d.name}</span>`
    );

    if (names.length > 1) return `${post}, ${names.join(", ")}`;

    // const joined = names.join(", ");
    // const i = joined.lastIndexOf(", ");
    // const before = joined.substring(0, i);
    // const after = joined.substring(i + 1, joined.length);
    return `${post} and ${names[0]}`;
  };

  const shorten = (name) => {
    if (name === "The Pussycat Dolls") return "Pussycat Dolls";
    else if (name === "New Kids On The Block") return "NKOTB";
    return name;
  };

  const scrollToInfo = () => {
    if (!scatterEl) return;
    const { top } = scatterEl.getBoundingClientRect();
    const y = window.scrollY;
    window.scrollTo(0, y + top);
  };

  $: membersText = setMemberText(scatterActiveBand);
  $: mobileScatter = !$mq.lg;
  $: scatterActiveBand, scrollToInfo();
</script>

<Meta />

<section>
  <Header />
</section>

<section>
  <Intro copy="{copy}" />
</section>

<section>
  <Prose grafs="{copy.popularityBefore}" />
  <FigureInfo hed="{copy.popularityHed}" />
  <div class="swarm swarm-horizontal">
    <Swarm bind:downloadData="{downloadSwarmData}" />
  </div>
  <div class="swarm swarm-vertical">
    <Swarm orientation="{'vertical'}" bind:downloadData="{downloadSwarmData}" />
  </div>
  <FigureSource
    source="{copy.popularitySource}"
    data="{downloadSwarmData}"
    filename="solo-artist-followers.csv"
  />
  <Prose grafs="{copy.popularityAfter}" />
</section>

<section bind:this="{scatterEl}">
  {#if mobileScatter}
    <FigureInfo hed="{copy.successHed}" />
  {:else}
    <FigureInfo hed="{copy.successHedBig}">
      <select
        bind:value="{scatterActiveBand}"
        class:selected="{!!scatterActiveBand}"
      >
        <option value="">all bands</option>
        {#each scatterBands as names}
          <option value="{names[0].name}">{shorten(names[0].name)}</option>
        {/each}
      </select>
      <span>{@html membersText}</span>
    </FigureInfo>
  {/if}
  <Scatter
    bind:scatterBands
    activeBand="{scatterActiveBand}"
    bind:downloadData="{downloadScatterData}"
  />
  <FigureSource
    source="{copy.successSource}"
    data="{downloadScatterData}"
    filename="billboard-hits.csv"
  />
  <Prose grafs="{copy.successAfter}" />
</section>

<!-- <Footer /> -->
<style>
  section {
    margin: 0 auto;
    padding: 0 1em;
  }

  .swarm-horizontal {
    display: none;
  }

  .swarm-vertical {
    padding-top: 10%;
  }

  select {
    display: inline-block;
    /* font-size: 0.85em; */
    padding: 0 0.25em;
    margin: 0;
    line-height: 1.2;
    padding-right: 1.25em;
    text-align: center;
    color: var(--fg);
    border-bottom: 6px solid var(--gray);
    border-radius: 0;
  }

  select.selected {
    border-bottom: 6px solid var(--node-0);
  }

  @media only screen and (min-width: 1024px) {
    .swarm-vertical {
      display: none;
    }
    .swarm-horizontal {
      display: block;
    }
  }
</style>
