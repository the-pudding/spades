

<script>

import { onMount, tick } from "svelte";
import { select } from 'd3-selection';
import backCardOne from "../svg/card_back_1_2.svg";
import backCardTwo from "../svg/data.svg";

let mounted;
let toChange = {};
let backCardSvg;
let backCardSvgTwo;
let moved = false;
let updated = false;
let flipped;


function toggleData(){

    select(this).style("transform","rotateY(180deg)");

}

onMount(async() => {
    mounted = true;
    await tick();

    backCardSvg = select(".back-card-svg").select("svg")
    backCardSvgTwo = select(".back-card-svg-2").select("svg")

    backCardSvgTwo.selectAll("g")
        .each(function(d){

            let paths = [];

            select(this).selectAll("path").each(function(d){
                paths.push([select(this).attr("d"),"white"]);
            })

            toChange[select(this).attr("id")] = paths;

        });


})

</script>

<div aria-label="Word cloud of commonly used phrases from the question on the survey of How Does Spades Make You Fee. The common responses include Play, 51x, Good 44x, Fun 43x, Competitive 41x, Feel 41x, Black 36x, Happy 33x, Spade 31x, Game 27x, Excite 25x, Love 23x, Family 20x, Great 17x, Friend 17x, LOL 14x, Win 12x Connect 12x, Relaxed 10x Home 7x, Know 7x, Amaze 6x, Community 6x" class:flipped class="back-card-wrapper swiper-no-swiping" on:click={() => flipped = !flipped }>
    <div class="back-card card-slide back-card-front">
      <div class="back-card-svg">
        {@html backCardOne}
      </div>
    </div>
    <div class="back-card card-slide">
        <div class="back-card-svg-2">
            {@html backCardTwo}
        </div>
    </div>
</div>

<style>
  .back-card-wrapper {
    height: 1px;
    flex-grow: 1;
    position: relative;
    margin-top: .5rem;
    transform-style: preserve-3d;
    transition: transform 0.8s;
    z-index: 100000;
    transform: translate3d(0,0,951px) rotateX(-2deg);
  }

  .back-card {
    height: calc(100% + 5rem);
    max-height: none;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    border: none;
    box-shadow: 0px -11px 34px rgba(0,0,0,.14);
    backface-visibility: hidden;
    transform: rotateY(180deg);
    pointer-events: none;
    max-width: 100%;
  }

  .flipped {
    transform: translate3d(0,0,100px) rotateY(180deg);
  }

  .back-card-front {
    transform: rotateY(0deg);
    background: #222;
  }

  .back-card-svg-2 {
    height: calc(100% - 1.5rem);
    width: calc(100% - 40px);
    margin: 0 auto;
    position: absolute;
    pointer-events: none;
    top: .5rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .back-card-svg-2 svg {
    align-self: flex-start;
  }

  .back-card-front .back-card-svg {
    height: calc(100% - 4rem);
    width: calc(100% - 4rem);
    margin: 0 auto;
    margin-top: 1.5rem;
    position: absolute;
    top: 2rem;
    pointer-events: none;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /* background: url('../assets/back-black.svg') no-repeat; */
  }

  .back-card-svg svg {

    align-self: flex-start;
  }


  .back-card-wrapper:before {
    content: '';
    background: url('../assets/hand-2.svg') no-repeat center;
    width: 100px;
    position: absolute;
    top: -1rem;
    right: 0px;
    pointer-events: none;
    height: 100px;
    transform: translate(0, -50%);
    z-index: 1000;
  }

  .back-card-front:after {
    content: '';
    width: calc(100% - 2rem);
    height: calc(100% - 1.9rem);
    border: 2px solid #9A75C3;
    border: 2px solid #FFF;
    position: absolute;
    border-radius: 20px;
    right: 0;
    top: 1rem;
    pointer-events: none;
    left: 0;
    margin: 0 auto;
  }

</style>
