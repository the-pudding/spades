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
  import ButtonSet from "./helpers/ButtonSet.svelte";
  import Footer from "./pudding/Footer.svelte";
  import copy from "../data/doc.json";
  import mq from "../stores/mq.js";
  import {selectAll} from 'd3-selection';
  import { onMount } from "svelte";

  let mounted;


  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import SwiperCore, {
    Mousewheel,Pagination
  } from 'swiper/core';

  // install Swiper modules
  SwiperCore.use([Mousewheel,Pagination]);
  
  onMount(() => {
    mounted = true;

    selectAll("a").attr("target","_blank").each(d => {
      console.log("here");
    });
  });

  

</script>

<Meta copy="{copy}" />

<!-- <section>
  <Header />
</section> -->

<!-- svelte-ignore missing-declaration -->
{#if mounted}
  <section>
    <Swiper
      direction="{'vertical'}" slidesPerView="{1}" spaceBetween="{30}" mousewheel="{true}"
      on:slideChange={() => console.log('slide change')}
      on:swiper={(e) => console.log(e.detail[0])}
    >

      {#each copy.cards as card}
        <SwiperSlide>
          {#each card.cardText as cardText}
            <p>{@html cardText.value}</p>
          {/each}
        </SwiperSlide>
      {/each}
    </Swiper>

  </section>
{/if}



<section>
</section>



<!-- <section>
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
</section> -->

<!-- <section bind:this="{scatterEl}">
  {#if mobileScatter || selectedScatter === "table"}
    <FigureInfo hed="{copy.successHed}" />
  {:else}
    <FigureInfo hed="{copy.successHedBig}">
      <select
        aria-label="Band"
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
  <div class="scatter-view">
    <ButtonSet
      options="{[{ value: 'chart' }, { value: 'table' }]}"
      legend="View as"
      legendPosition="{isSmall ? 'left' : 'top'}"
      bind:selected="{selectedScatter}"
    />
  </div>
  <Scatter
    bind:scatterBands
    activeBand="{scatterActiveBand}"
    bind:downloadData="{downloadScatterData}"
    showTable="{selectedScatter === 'table'}"
  />
  <FigureSource
    source="{copy.successSource}"
    data="{downloadScatterData}"
    filename="billboard-hits.csv"
  />
  <Prose grafs="{copy.successAfter}" />
</section>

<section id="method">
  <Prose className="small" grafs="{copy.method}" />
</section> -->

<!-- <Footer /> -->

<style>
  section {
    margin: 0 auto;
    padding: 0 1em;
  }

  p {
    font-size:16px;
  }

</style>
