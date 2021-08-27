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
	import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';
	import {cubicOut} from 'svelte/easing';
  import { transition } from 'd3-transition';

  import viewport from "../stores/viewPort.js";
  import Age from './Age.svelte'

  import CardBack from './CardBack.svelte'

  import { onMount, tick } from "svelte";
  import tableTalk from "../svg/table2.svg";
  import ageAint from "../svg/ageaint2.svg";
  import feelTitle from "../svg/feel_title.svg";

  import puddingLogo from "../svg/pudding/wordmark.svg";

  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import SwiperCore, {
    Controller,Mousewheel,Pagination
  } from 'swiper/core';

  let disableStartEvents = false;
  $: $viewport.width, updateIsMobile();

  function updateIsMobile() {
    if($viewport.width > 640){
      disableStartEvents = true;
    }
    else {
      disableStartEvents = false;
    }
  }


  let started = false;
  let startingSlide = 0;
  let mounted;
  let innerSwiperIndex;
  let countInner;

  let suit = {
    0: "\u2660",
    1: "\u2665",
    2: "\u2666",
    3: "\u2663"
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


  const changedSlideStart = (e) => {

    const [swiper] = e.detail[0];

    if(swiper.activeIndex > 1 && !disableStartEvents){

      select(".card-container").classed("not-started", true);

      selectAll(".open-box")
          .transition()
          .duration(500)
          .delay(2000)
          .style("width","100%")
          .style("left","0px")
          .style("top",null)

      }
  }


  const changedSlideEnd = (e) => {

    const [swiper] = e.detail[0];

      if(swiper.activeIndex > 1 && !disableStartEvents){

        select(".card-container").classed("not-started", true);

        selectAll(".open-box")
            .transition()
            .duration(500)
            .delay(2000)
            .style("width","100%")
            .style("left","0px")
            .style("top",null)

      }



      if(swiper.activeIndex == 1 && started && !disableStartEvents){
        select(".card-container").classed("not-started", false);
        
        selectAll(".open-box")
          .style("display","none")

      }


      if(swiper.activeIndex == 1 && !started && !disableStartEvents){


        // if(mainSwiper.activeIndex == 1 && !started){
        //   window.setTimeout(function(d){
        //   },2000)
        // }

        started = true;

        select(".card-container").classed("not-started", false);

        selectAll(".open-box")
          .style("width","100%")
          .style("left","0px")
          .transition()
          .duration(500)
          .delay(1000)
          // .style("width","110%")
          // .style("left","-16px")
          // .style("top","0px")


        select(".first-slide")
          .style("opacity",1)
          .transition()
          .duration(1000)
          .delay(750)
          .style("transform","translate(0,0) scale(.95)")
          .on("end",function(){

            selectAll(".open-box")
              .transition()
              .duration(500)
              .style("opacity",0)

            select(".first-slide")
              .transition()
              .duration(500)
              .delay(500)
              .style("transform","translate(0,0) scale(1)")
              swiper.enable();
          })
          ;
      }
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

  let mainSwiper = null;

  // let controlledSwiper = null;
  const onSwiper = (e) => {
      [mainSwiper] = e.detail;
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

<!-- svelte-ignore missing-declaration -->
{#if mounted}
  <section class="card-container not-started">

    <div class="open-box-top open-box">
        <img src="assets/top_open.png" alt="">
    </div>
    <div class="open-box-bottom open-box">
      <img src="assets/bottom_open.png" alt="">
    </div>

    <div class="start-wrapper">

    </div>

    <Swiper
      direction="{'vertical'}" initialSlide="{startingSlide}" grabCursor="{true}" slideToClickedSlide="{false}" slidesPerView="{'auto'}" mousewheel="{{forceToAxis:true, sensitivity: 1}}" breakpoints='{{
        "640": {
          "direction": 'horizontal',
          "freeMode": true,
          centeredSlides: true
        }
      }}'

      on:slideChangeTransitionEnd={changedSlideEnd}
      on:slideChangeTransitionStart={changedSlideStart}
    >

    <SwiperSlide class="starting-slide card-slide">
      <div class="masthead">
        <a href="/" target="_blank">
          {@html puddingLogo}
        </a>
      </div>

      <div class="byline">By 
        <a href="https://pudding.cool/author/gabrielle-hickmon" target="_blank">
          Gabrielle Ione Hickmon
        </a>
      </div>

      <p class="title">How You play spades is how you play life<span>Spades in the African-American Community</span></p>

      <!-- <img src="assets/card_back_2.png" alt=""> -->
    </SwiperSlide>

      {#each copy.cards as card, index}


      {#if card.background}
        <div class="pop-off-wrapper">
          <div class="pop-off card-slide" on:click={pivotPopOff}>
            <div class="top-loop">
              <div class="top-loop-svg">
              </div>
            </div>

            <div class="internal-text-wrapper">
              <p class="pop-off-hed">{@html card.backgroundHed}</p>
              <div class="text-wrapper">
                <p class="pop-off-para">{@html card.background}</p>
              </div>
            </div>
            
          </div>
        </div>
        
      {/if}

      

        <SwiperSlide class="card-slide { !!card.trifold ? "trifold-slide-"+card.trifold : ""} { !!card.agecard ? "age-slide" : ""} { !!card.trifold ? "trifold-slide" : ""} { index == 0 ? "first-slide" : ""}">

          {#if card.nested}
            <Swiper class="nested-swiper"
              direction="{'horizontal'}" pagination='{{"clickable": true }}' grabCursor="{true}" slideToClickedSlide="{false}" slidesPerView="{'auto'}" spaceBetween="{convertRemToPixels(-1.5)}" mousewheel="{{forceToAxis:true, sensitivity: .1}}" breakpoints='{{
                "640": {
                  "direction": 'horizontal',
                }
              }}'
              on:slideChange={() => console.log('slide change')}
            >
              {#each card.cardText as cardText, indexInner}
                

                  <SwiperSlide class="card-slide">
                    {#if innerSwiperIndex}
                      <div class="card-symbol card-color-{getInnerSuitColor(indexInner)}">
                        <p class="card-num"> { getInnerCardOrder(indexInner)} </p>
                        <p class="card-suit">{ getInnerSuit(indexInner) }</p>
                      </div>
                    {/if}

                    {#if cardText.text}
                      <p class="para para-center para-no-margin">{@html cardText.text}</p>
                      
                    {/if}
                    {#if cardText.hed}
                      <p class="card-title">{@html cardText.hed}</p>
                    {/if}

                    {#if cardText.img}
                      <div class="img-wrapper">
                        <img style="min-width:{cardText.imgMinWidth !== undefined, cardText.imgMinWidth}px; width:{cardText.imgWidth !== undefined, cardText.imgWidth}%;" src="assets/{cardText.img}">
                        {#if cardText.imgTwo}
                          <div class="svg-wrapper" style="min-width:{cardText.imgMinWidth !== undefined, cardText.imgMinWidth}px; width:{cardText.imgWidth !== undefined, cardText.imgWidth}%;">
                            {#if cardText.imgTwo == "table2.svg"}
                              {@html tableTalk}
                            {/if}
                          </div>
                        {/if}
                      </div>
                    {/if}

                    {#if cardText.html}
                      {@html cardText.html}
                    {/if}
                    {#each cardText.innerCardText as innerCardText }
                      <div class="text-wrapper text-wrapper-inner">
                        <p class="para">{@html innerCardText.value}</p>
                      </div>
                    {/each}
                    {#if cardText.pagination}
                      <div class="pagination-wrapper">
                        <div class="pagination-label" class:pagination-label-hidden={indexInner == card.cardText.length - 1}>
                          <p class="pagination-label-text">{@html cardText.pagination}</p>
                          <div class="pagination-label-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15" fill="none">
                              <path d="M22.9229 8.31355C23.3135 7.92303 23.3135 7.28986 22.9229 6.89934L16.559 0.535379C16.1684 0.144855 15.5353 0.144854 15.1448 0.535379C14.7542 0.925903 14.7542 1.55907 15.1448 1.94959L20.8016 7.60645L15.1448 13.2633C14.7542 13.6538 14.7542 14.287 15.1448 14.6775C15.5353 15.068 16.1684 15.068 16.559 14.6775L22.9229 8.31355ZM0.21582 8.60645L22.2158 8.60645L22.2158 6.60645L0.21582 6.60645L0.21582 8.60645Z" fill="black"/>
                              </svg>
                          </div>
                        </div>
                        <div class="pagination-count">
                          <p>{indexInner+1} of {card.cardText.length}</p>
                        </div>
                      </div>
                      
                    {/if}
                  </SwiperSlide>

              {/each}
            </Swiper>
          
            
          {:else}
            <div class="card-wrapper" class:text-only-wrapper="{!!card.textOnlyCard}">
              {#if innerSwiperIndex}
                <div class="card-symbol card-color-{getSuitColor(index)}">
                  <p class="card-num"> { getCardOrder(index)} </p>
                  <p class="card-suit">{ getSuit(index) }</p>
                </div>
              {/if}
              

              {#if card.agecard}
                <Age></Age>
              {/if}

              {#if card.cardTitle}
                <p class:order-very-bottom="{!!card.titleBottom}" class:order-bottom="{!!card.textPosition}" class="card-title">{ card.cardTitle }</p>
              {/if}
              {#if card.img}
                <img class:flex-grow="{!!card.imgFlex}" class:order-bottom="{!!card.textPosition}" alt={card.altText} class="{card.imgSize} {card.class}" class:full-width-image={card.imgSetting == 'full-width'} style="margin-bottom:{card.bottomSpacing !== undefined, card.bottomSpacing}; max-height:{card.imgMaxHeight !== undefined, card.imgMaxHeight}px;  max-width:{card.imgMaxWidth !== undefined, card.imgMaxWidth+'%'}; min-width:{card.imgMinWidth !== undefined, card.imgMinWidth}px; width:{card.imgWidth !== undefined, card.imgWidth}%;" src="assets/{card.img}">
              {/if}

              {#if card.imgTwo}
              <div class="img-wrapper">
                <div alt={card.altText} class="svg-wrapper" style="min-width:{card.imgMinWidth !== undefined, card.imgMinWidth}px; width:{card.imgWidth !== undefined, card.imgWidth}%;">
                  {#if card.imgTwo == "ageaint2.svg"}
                    {@html ageAint}
                  {/if}
                  {#if card.imgTwo == "feel_title.svg"}
                    {@html feelTitle}
                  {/if}
                </div>
              </div>

              {/if}


              {#if card.backgroundFill}
                <div class="card-background-fill">
                  {#if card.backgroundImageFill}

                    <div class="background-image-fill {card.backgroundFillWidthMax}" style="{card.styling} background-image: url('assets/{$viewport.width < 640 ? card.backgroundFillMobile : card.backgroundFill}')">
                    </div>
                  
                  {:else}
                    <img src="assets/{card.backgroundFill}" alt="">
                  {/if}
                  
                </div>
              {/if}




              <div class:half-text-wrapper="{card.imgSize == "half"}" class:order-top="{!!card.textPosition}" class:text-center="{!!card.textCenter}" style="max-width:{card.textWidthMax !== undefined, card.textWidthMax}px;" class="text-wrapper">
                {#each card.cardText as cardText}
                  <p class:tight-text="{!!card.tightText}" class="para">{@html cardText.value}</p>
                {/each}
              </div>

              {#if card.imageSource}
                <p class="image-source image-source-single-line">{@html card.imageSource}</p>
              {/if}


              {#if card.backCard}
                <CardBack>

                </CardBack>
              {/if}

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

  .title {
    position: absolute;
    left: 0;
    top: 0;
    color: white;
    top: 5rem;
    /* font-family: 'Lyon Text Web'; */
    font-size: 1.4rem;
    width: 154px;
    transform: translate(-100%,0);
    margin: 0 auto;
    text-align: right;
    font-family: 'Ohno Blazeface';
    text-transform: uppercase;
    -webkit-font-smoothing: antialiased;
    line-height: 1.3;
    display: none;
  }

  .title span {
    font-size: 1rem;
    font-family: 'Lyon Text Web', serif;
    display: block;
    text-transform: none;
    margin-top: .5rem;
  }

  .byline {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5px;
    margin: 0 auto;
    width: 100%;
    transform: translate(0,100%);
    color: white;
    text-align:center;
    -webkit-font-smooth:antialiased;
    font-family: 'Lyon Text Web', serif;
    font-size: 14px;
    display: none;
  }

  .byline a {
    color: white;
  }

  .masthead {
    position: absolute;
    width: 110px;
    height: 41px;
    top: 0px;
    left: 0;
    right: 0;
    margin: 0 auto;
    transform: translate(0,0%);
    padding-top: .5rem;
    fill: white;
  }

  .masthead svg path {
    fill: white;
  }

  .masthead:after {
    content: 'presents';
    position: absolute;
    bottom: 14px;
    left: 0;
    right: 0;
    margin: 0 auto;
    transform: translate(0,100%);
    font-family: 'Lyon Text Web';
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.8;
    display: none;
  }




  .card-background-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    overflow: hidden;
    border-radius: 20px;
  }

  .card-background-fill img {
    height: 100%;
  }

  .image-source {
    font-family: 'Lyon Text Web', serif;
    font-size: .9rem;
    width: calc(100% - 2rem);
    margin: 0 auto;
    opacity: .8;
  } 

  .image-source-single-line {
    margin-top: 1rem;
  }


  p {
    font-size:1rem;
  }

  .tight-text {
    margin: .5rem auto;
    line-height: 1.2;
  }

  .card-title {
    font-size: 1.5rem;
    text-align: center;
    max-width: 250px;
    margin: 0 auto;
    line-height: 1.2;
    margin-top: 1rem;
    font-weight: 300;
    font-family: 'Ohno Blazeface';
    text-transform: uppercase;
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

  
.flex-grow {
  height: 1px;
  flex-grow: 1;
  object-fit: contain;
  max-width: calc(100% - 10px);
}

  .card-container {
    background-color: #05051f;
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
    transform: translate(calc(-100% + 270px), calc(0% - 130px)) rotate(10deg);
    transition: transform 0.3s; 
    max-height: none;
  }

  .pop-off:after {
    content: 'INSTRUCTIONS';
    width: 100%;
    position: absolute;
    top: -6px;
    right: 0px;
    left: 0;
    margin: 0 auto;
    font-family: 'Lyon Text Web';
    text-align: center;
    transform: translate(0, -100%);
  }

  .pop-off:before {
    content: '';
    width: 42px;
    height: 43px;
    position: absolute;
    top: -6px;
    right: -25px;
    background: url('../assets/hand.png');
    background-repeat: no-repeat;
    background-size: contain;
    transform: rotate(-17deg);
  }

  .pop-off .text-wrapper {
    pointer-events: none;
    text-align: right;
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

  .top-loop {
    height: 100%;
    margin: 0;
    width: 100%;
    position: absolute;
    overflow: hidden;
    pointer-events: none;
  }

  .top-loop-svg {
    background: url('../assets/loop-big.svg');
    transform: translate3d(0,0,0);
    background-repeat: no-repeat;
    margin-left: auto;
    position: absolute;
    right: .5rem;
    top: .5rem;
    width: 513px;
    height: 785px;
    pointer-events: none;
  }

  .internal-text-wrapper {
    pointer-events:none;
    margin-right: calc(38px + 1.5rem);
    position: relative;
    margin-top: calc(38px + 1.5rem);
    pointer-events: none;
  }

  .pop-off-hed {
    pointer-events: none;
    text-align: right;
    width: 250px;
    margin: 0;
    margin-right: 1rem;
    margin-left: auto;
    margin-top: 1rem;
    font-size: 1.8rem; 
    font-weight: 300;
    line-height: 1.2;
    font-family: 'Ohno Blazeface';
    text-transform: uppercase;
    -webkit-font-smoothing: antialiased;
    font-size: 28px;
    margin-bottom: 1rem;

  }

  .card-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height:100%;
    padding-bottom: .5rem;
    padding-top: .5rem;
  }

  .card-wrapper img{
    margin: 0 auto;
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

  .text-only-wrapper {
    justify-content: flex-start;
    padding-top: 5.5rem;
  }

  .text-only-wrapper .text-wrapper .para {
    line-height: 1.4;
  }

  .text-wrapper p:first-of-type {
    margin-top: 0;
  }
  
  .text-only-wrapper .text-wrapper p:first-of-type::first-letter {
    color: #000;
    float: left;
    font-family: 'Ohno Blazeface';
    font-size: 75px;
    line-height: 44px;
    padding-top: 5px;
    padding-right: 8px;
    padding-left: 3px;
    font-weight: 300;
  }

  .text-wrapper p:last-of-type {
    margin-bottom: 0;
  }

  .text-wrapper a {
    color: black;
  }

  .text-wrapper-inner {
    width: calc(100% - 3rem);
    margin-right: 2rem;
  }

  .para-no-margin {
   margin: 0 auto; 
  }

  .para {
    user-select: none;
    line-height: 1.4;
  }

  .para-center {
    text-align:center;
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
    font-family: 'Ohno Blazeface'
  }

  .card-num {
    margin-bottom: .5rem;
  }

  .card-suit {
    font-size: 2rem;
  }

  .full {
    width: 100%;
  }

  .background-image-fill {
    background-size: 200%;
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;
    width: 100%;
  }

  .card-wrapper .half {
    /* height: 1px; */
    /* object-fit: contain; */
    /* flex-grow: 1; */
    margin-bottom: 1rem;
  }

  .half-text-wrapper {
    /* height: calc(50% - 1rem); */
    /* margin-bottom: 1rem; */
    /* overflow-y: scroll; */
    /* padding-bottom: 3rem; */
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
    display: none;
  }

  .full-width-image {
    width: 100%;
    height: auto;
  }

  .nested-swiper {
    background: red;
  }


  .pagination-label {
    display: flex;
    justify-content: center;
  }

  .pagination-label-hidden {
    display: none;
  }


  .pagination-label-arrow {
    align-self: center;
  }

  .pagination-label-arrow svg {
    display: block;
    width: 25px;
  }

  .pagination-label-text {
    text-transform: uppercase;
    margin: 0;
    display: block;
    margin-right: 10px;
  }

  .pagination-count{
    display: flex;
    margin: 0;
    justify-content: center;
  }

  .pagination-count p{
    margin: 0;
  }

  .pagination-wrapper {
    position: absolute;
    bottom: 2rem;
    left: 0;
    right: 0;
  }

  .img-wrapper img{
    margin: 0 auto;
  }

  .img-wrapper .svg-wrapper {
    margin: 0 auto;
  }

  .img-wrapper .svg-wrapper svg{
    width: 100%;
  }

  .order-bottom {
    order: 2;
  }

  .text-center {
    text-align: center;
    max-width: 330px;
  }

  .order-top {
    order: 1;
    margin-bottom: 1rem;
    max-width: calc(100% - 8rem);
  }

  

  .order-very-bottom {
    order: 3;
  }

  .start-wrapper {
    position: absolute;
    z-index: 10000;
    pointer-events: all;
    width: 100%;
    height: 100vh;
    display: none;
  }

  .not-started .open-box-top {
    transform: translate(0, calc(-100% + 0px)) rotate(180deg);
    top: -10px;
    
  }

  .not-started .open-box-bottom {
    transform: translate(0, calc(-100% + -169px)) rotate(180deg); 
  }

  .open-box {
    transform: translate(0,-76%) rotate(180deg);
    position: fixed;
    z-index: 10000;
    transition: transform .5s;
    width: 100%;
    left: 0;
    top: 0;
  }

  .open-box-bottom {
    z-index: 10000;
    transform: translate(0, calc(-100% + 8vw)) rotate(180deg);
  }

  .open-box-top {
    z-index: 0;
    transform: translate(0, calc(-100% + 49vw)) rotate(180deg);
    top: -10px;
  }



  @media only screen and (min-width: 640px) {

    .byline {
      font-size: 1rem;
    width: 100px;
    transform: translate(-100%, 0);
    bottom: 2rem;
    right: auto;
    display: block;
    }

    .title {
      display: block;
    }

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

    .masthead {
    position: absolute;
    width: 145px;
    height: 50px;
    top: 14px;
    left: 0;
    right: 0;
    margin: 0 auto;
    transform: translate(0,-100%);
    padding-top: .5rem;
    right: auto;
    transform: translate(-100%,0);
    display: block;
  }



  .card-wrapper .flex-grow {
    max-height: 300px;
    margin-bottom: 1rem;
  }

  }

  @media only screen and (max-width: 350px) {

    .text-only-wrapper .text-wrapper p:first-of-type::first-letter {
      font-size: 60px;
      line-height: 38px;
    }

    .text-only-wrapper .text-wrapper .para {
      line-height: 1.3;
    }

    .para {
      font-size: 14px;
      line-height: 1.3;
    }

    .card-title {
      font-size: 1.2rem;
      max-width: 210px;
    }

    .pop-off {
      transform: translate(calc(-100% + 241px), calc(0% - 110px)) rotate(10deg);
    }

    .pop-off-para {
      font-size: 14px;
    }

    .pop-off-hed {
      font-size: 18px;
    }
}
    


  

</style>
