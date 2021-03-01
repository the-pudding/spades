<script>
  import Meta from "./Meta.svelte";
  import Header from "./pudding/Header.svelte";
  import Intro from "./Intro.svelte";
  import Swarm from "./Swarm.svelte";
  import Scatter from "./Scatter.svelte";
  import Scatter2 from "./Scatter2.svelte";
  import Footer from "./pudding/Footer.svelte";
  import copy from "../data/doc.json";
</script>

<Meta />

<!-- <Header /> -->

<!-- <Intro copy="{copy}" /> -->

<!-- <section>
  <Swarm />
</section> -->
<section>
  <Scatter />
</section>
<!-- <section>
  <Scatter2 />
</section> -->

<!-- <Footer /> -->
<style>
  section {
    margin: 0 auto;
  }
</style>
