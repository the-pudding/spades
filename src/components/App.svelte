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
  import { onMount, tick } from "svelte";

  let mounted;
  let innerSwiperIndex;
  let countInner;

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


  function getSuit(index) {
    if(index < +innerSwiperIndex ) {
      return suit[Math.floor(index/13)]
    }
    if(countInner){
      return suit[Math.floor((index + countInner)/13)]
    }
    return "hi";
  }

  function getSuitColor(index) {
    if(index < +innerSwiperIndex ) {
      return suitColor[Math.floor(index/13)]
    }
    if(countInner){
      return suitColor[Math.floor((index + countInner)/13)]
    }
    return "hi";
  }


  function getCardOrder(index) {
    if(index < +innerSwiperIndex ) {
      return cardOrder[(index) % 13]
    }
    if(countInner){
      return cardOrder[(index + countInner) % 13]  
    }
    return "hi";
  }

  function getInnerCardOrder(index) {
    return cardOrder[(+innerSwiperIndex + index) % 13]
  }

  function getInnerSuit(index) {
    return suit[Math.floor((+innerSwiperIndex + index)/13)]
  }

  function getInnerSuitColor(index) {
    return suitColor[Math.floor((+innerSwiperIndex + index)/13)]
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
      swiper.slideTo(22);
  }

  onMount(async() => {
    mounted = true;

    console.log("mounted")

    
    await tick();

    for (let item in copy.cards) {

      let props = Object.keys(copy.cards[item]);
      if(props.indexOf("nested") > -1){
        innerSwiperIndex = item;
        countInner = copy.cards[item].cardText.length - 1;
      }      
    }
    
    select("#content").selectAll("a").attr("target","_blank");
    select(".nested-swiper").node().parentNode.classList.add('card-style-none');

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
      direction="{'vertical'}" grabCursor="{true}" slideToClickedSlide="{false}" slidesPerView="{'auto'}" spaceBetween="{convertRemToPixels(.5)}" mousewheel="{{forceToAxis:true, sensitivity: .1}}" breakpoints='{{
        "640": {
          "direction": 'horizontal'
        }
      }}'
      on:slideChange={() => console.log('slide change')}
      on:swiper={onSwiper} 
    >

      {#each copy.cards as card, index}

        {#if card.background}
          <div class="pop-off-wrapper">
            <div class="pop-off card-slide" on:click={pivotPopOff}>
              <p class="pop-off-hed">{@html card.backgroundHed}</p>
              <div class="text-wrapper">
                <p class="pop-off-para">{@html card.background}</p>
              </div>
            </div>
          </div>
          
        {/if}


        <SwiperSlide class="card-slide">
          {#if card.nested}
            <Swiper class="nested-swiper"
              direction="{'horizontal'}" pagination='{{"clickable": true }}' grabCursor="{true}" slideToClickedSlide="{false}" slidesPerView="{'auto'}" spaceBetween="{convertRemToPixels(-1.5)}" mousewheel="{{forceToAxis:true, sensitivity: .1}}" breakpoints='{{
                "640": {
                  "direction": 'vertical'
                }
              }}'
              on:slideChange={() => console.log('slide change')}
              on:swiper={onSwiper} 
            >
              {#each card.cardText as cardText, indexInner}
                

                  <SwiperSlide class="card-slide">
                    {#if innerSwiperIndex}
                      <div class="card-symbol card-color-{getInnerSuitColor(indexInner)}">
                        <p class="card-num"> { getInnerCardOrder(indexInner)} </p>
                        <p class="card-suit">{ getInnerSuit(indexInner) }</p>
                      </div>
                    {/if}
                    {#each cardText.innerCardText as innerCardText }
                      <p>{@html innerCardText.value}</p>
                    {/each}
                  </SwiperSlide>

              {/each}
            </Swiper>
          
            
          {:else}
            <div class="card-wrapper">
              {#if innerSwiperIndex}
                <div class="card-symbol card-color-{getSuitColor(index)}">
                  <p class="card-num"> { getCardOrder(index)} </p>
                  <p class="card-suit">{ getSuit(index) }</p>
                </div>
              {/if}
              

              {#if card.cardTitle}
                <p class="card-title">{ card.cardTitle }</p>
              {/if}
              {#if card.img}
                <img class="{card.imgSize}" class:full-width-image={card.imgSetting == 'full-width'} src="assets/{card.img}" alt={card.altText}>
              {/if}

              <div class="text-wrapper" class:half-text-wrapper={!!card.img}>
                {#each card.cardText as cardText}
                  <p class="para">{@html cardText.value}</p>
                {/each}
              </div>
            </div>
          {/if}
          
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

  .card-title {
    font-size: 1.5rem;
    text-align: center;
    max-width: 250px;
    margin: 0 auto;
    line-height: 1.2;
    margin-top: 1rem;
    font-weight: 600;
  }


  .half-text-wrapper::-webkit-scrollbar-track {
    background: #fbf7f0;
  }

  .half-text-wrapper::-webkit-scrollbar-corner {
    background: #fbf7f0;
  }

  .half-text-wrapper::-webkit-resizer {
    background: #fbf7f0;
  }

  


  .card-container {
    background-color: var(--bg);
  }

  .card-title-hidden {
    display: none;
  }

  .pop-off-wrapper {
    position:relative;
    z-index: 100;
    height: 1px;
  }

  .pop-off {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    transform: translate(calc(-100% + 120px), calc(0% - 150px)) rotate(25deg);
    transition: transform 0.3s; 
    max-height: none;
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

  .pop-off-hed {
    pointer-events: none;
    text-align: right;
    width: 150px;
    margin: 0;
    margin-right: 1rem;
    margin-left: auto;
    margin-top: 1rem;
    font-size: 1.2rem;  
    font-weight: 600;
    line-height: 1.2;
  }

  .card-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height:100%;
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

  .para {
    user-select: none;
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
    height: 1px;
    object-fit: contain;
    flex-grow: 1;
  }

  .half-text-wrapper {
    height: calc(50% - 1rem);
    margin-bottom: 1rem;
    overflow-y: scroll;
    padding-bottom: 3rem;
  }

  .half-text-wrapper:after {
    content: '';
    height: 3rem;
    position: absolute;
    bottom: 1rem;
    left: 0;
    right: 0;
    width: 100%;
    background: linear-gradient(180deg, rgba(255,255,255,0) 10%, #fbf7f0 63%);
  }

  .full-width-image {
    width: 100%;
    height: auto;
  }

  .nested-swiper {
    background: red;
  }


  @media only screen and (min-width: 640px) {

    .pop-off-wrapper {
      height: 100%;
      z-index: 1000;
      pointer-events: all;
      cursor: pointer;
      cursor: hand;
    }

    .pop-off {
      min-width:450px;
      transform: translate(calc(-100% - 50px), calc(50% - 30px)) rotate(-5deg);
      top: 50%;
    }

    .pop-off-centered {
      min-width:450px;
      transform: translate(calc(-100% - 0px), calc(-50% - 0px)) rotate(0deg);
      top: 50%;
    }

  }

    


  

</style>
