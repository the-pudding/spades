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
  import {selectAll, select} from 'd3-selection';
  import { onMount } from "svelte";

  let mounted;

  let suit = {
    0: "♠",
    1: "♥",
    2: "♦",
    3: "♣"
  }

  let suitColor = {
    0: "black",
    1: "red",
    2: "red",
    3: "black"
  }

  let cardOrder = {
    0:2,
    1:3,
    2:4,
    3:5,
    4:6,
    5:7,
    6:8,
    7:9,
    8:10,
    9:"J",
    10:"Q",
    11:"K",
    12:"A"
  }

  function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }


  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import SwiperCore, {
    Controller,Mousewheel,Pagination
  } from 'swiper/core';

  // install Swiper modules
  SwiperCore.use([Mousewheel,Pagination,Controller]);
  
  function pivotPopOff(e){
    let el = select(e.srcElement);
    if(!el.classed("pop-off-centered")){
      el.classed("pop-off-centered",true);
    }
    else {
      el.classed("pop-off-centered",false);
    }

  }

  // let controlledSwiper = null;
  const onSwiper = (e) => {
      const [swiper] = e.detail;
      console.log(swiper);
      swiper.slideTo(4);
  }

  onMount(() => {
    mounted = true;

    console.log("mounted")

    let thing = select("#content").selectAll("a");
    console.log(thing.size())

  });

  

</script>

<Meta copy="{copy}" />

<!-- <section>
  <Header />
</section> -->

<!-- svelte-ignore missing-declaration -->
{#if mounted}
  <section class="card-container">
    <Swiper
      direction="{'vertical'}" slidesPerView="{'auto'}" spaceBetween="{convertRemToPixels(.5)}" mousewheel="{{forceToAxis:true}}"
      on:slideChange={() => console.log('slide change')}
      on:swiper={onSwiper}
    >

      {#each copy.cards as card, index}

        {#if card.background}
          <div class=pop-off-wrapper>
            <div class="pop-off card-slide" on:click={pivotPopOff}>
              <div class="text-wrapper">
                <p>{@html card.background}</p>
              </div>
            </div>
          </div>
          
        {/if}
        <SwiperSlide class="card-slide">
          <div class="card-wrapper">

            <div class="card-symbol card-color-{suitColor[Math.floor(index/13)]}">
              <p class="card-num">{ cardOrder[(index) % 13] }</p>
              <p class="card-suit">{ suit[Math.floor(index/13)] }</p>
            </div>

            {#if card.cardTitle}
              <p class="card-title card-title-hidden">{ card.cardTitle }</p>
            {/if}
            {#if card.img}
              <img class="{card.imgSize}" src="assets/{card.img}" alt={card.altText}>
            {/if}

            <div class="text-wrapper">
              {#each card.cardText as cardText}
                <!-- <p>{@index}</p> -->
                <p>{@html cardText.value}</p>
              {/each}
            </div>
          </div>
          
          
        </SwiperSlide>
      {/each}
    </Swiper>

  </section>
{/if}

<style>
  section {
    margin: 0 auto;
  }


  p {
    font-size:1rem;
  }

  .card-container {
    background-color: var(--bg);
  }

  .card-title-hidden {
    display: none;
  }

  .pop-off-wrapper {
    height: 1px;
    position:relative;
    z-index: 100;
  }

  .pop-off {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    z-index: 1000;
    transform: translate(calc(-100% + 120px), calc(0% - 150px)) rotate(25deg);
    transition: transform 0.3s; 
  }

  .pop-off:before {
    content: '';
    width: 42px;
    height: 43px;
    position: absolute;
    top: -6px;
    right: -25px;
    background: url(assets/hand.png);
    background-repeat: no-repeat;
    background-size: contain;
    transform: rotate(-17deg);
  }

  .pop-off .text-wrapper {
    pointer-events: none;
  }

  .pop-off .text-wrapper a{
    pointer-events: all;
  }

  .pop-off-centered {
    transform: translate(0, calc(-100vh + 3rem)) rotate(0deg);
  }

  .pop-off-centered:before {
    display: none;
  }

  .card-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .card-symbol {
    position: absolute;
    top: 1rem;
    left: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 36px;
  }

  .text-wrapper {
    width: calc(100% - 2rem);
    margin: 0 auto;
  }

  .card-color-black {
    color: var(--black);
  }

  .card-color-red {
    color: var(--red);
  }



  .card-num, .card-suit {
    font-size: 1.7rem;
    margin: 0;
    line-height: .9;
    text-align: center;
  }

  .card-suit {
    font-size: 2rem;
  }

  .full {
    width: 100%;
  }

  .half {
    width: 100%;
  }

  

</style>
