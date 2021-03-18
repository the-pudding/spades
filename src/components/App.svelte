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
</script>

<Meta />

<Header />

<Intro copy="{copy}" />

<section>
  <Prose grafs="{copy.popularityBefore}" />
  <FigureInfo hed="{copy.popularityHed}" />
  <Swarm />
  <FigureSource source="{copy.popularitySource}" />
  <Prose grafs="{copy.popularityAfter}" />
</section>

<section>
  <Prose grafs="{copy.successBefore}" />
  <FigureInfo hed="{copy.successHed}" dek="{copy.successDek}" />
  <Scatter />
  <FigureSource source="{copy.successSource}" />
  <Prose grafs="{copy.successAfter}" />
</section>

<!-- <Footer /> -->
<style>
  section {
    margin: 0 auto;
  }
</style>
