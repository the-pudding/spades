<script>
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

  let scatterActiveBand;
  let scatterBands = [];
  $: postSelect = scatterActiveBand ? "and its members" : "and members";
  const shorten = (name) => {
    if (name === "The Pussycat Dolls") return "Pussycat Dolls";
    else if (name === "New Kids On The Block") return "NKOTB";
    return name;
  };
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
  <Swarm />
  <FigureSource source="{copy.popularitySource}" />
  <Prose grafs="{copy.popularityAfter}" />
</section>

<section>
  <FigureInfo hed="{copy.successHed}">
    <select bind:value="{scatterActiveBand}">
      <option value="">all bands</option>
      {#each scatterBands as name}
        <option value="{name}">{shorten(name)}</option>
      {/each}
    </select>
    <span>{postSelect}</span>
  </FigureInfo>
  <Scatter bind:scatterBands activeBand="{scatterActiveBand}" />
  <FigureSource source="{copy.successSource}" />
  <Prose grafs="{copy.successAfter}" />
</section>

<!-- <Footer /> -->
<style>
  section {
    margin: 0 auto;
    padding: 0 1em;
  }
  select {
    display: inline-block;
    font-size: 0.85em;
    padding: 0.25em;
    padding-right: 1.25em;
    text-align: center;
    color: var(--fg);
    background-color: var(--node-0);
  }
</style>
