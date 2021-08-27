

<script>

import { onMount, tick } from "svelte";
import {selectAll, select} from 'd3-selection';
import { transition } from 'd3-transition';
import backCardOne from "../svg/card_back_1_2.svg";
import backCardTwo from "../svg/data.svg";
import Prose from "./Prose.svelte";


let mounted;
let toChange = {};
let backCardSvg;
let backCardSvgTwo;
let moved = false;
let updated = false;
let flipped;

// let wordsToMove = [
//     "love","play","good","fun","competitive","feel","black","happy","spade","game","excite","love",
//     "family","great","friend","lol","win","connect","relaxed","home","know","amaze","community"
// ]


function toggleData(){

    select(this).style("transform","rotateY(180deg)");

    // console.log(toChange)

    // let newData = backCardSvg.select("#card_back")
    //     .selectAll("g")
    //     .datum(function(d,i){

    //         if(!updated){
    //             let key = select(this).attr("id");
    //             return {key:key,i:i}
    //         }
    //         return d;

    //     })
    //     .filter(function(d,i){
    //         return i < 20 && wordsToMove.indexOf(d.key) > -1;
    //     })
    //     .selectAll("path")
    //     .datum(function(d,i){

    //         if(!updated){
    //             let parent = select(this.parentNode).datum();

    //             let newString = null;

    //             let id = select(this).node().parentNode.id

    //             // console.log(id,i)
    //             if(Object.keys(toChange).indexOf(id) > -1){
    //                 // console.log(toChange[id],i)

    //                 newString = toChange[id][i][0];
    //             }

    //             return {start:select(this).attr("d"),end: newString, id: id, dOfI: parent.i};
    //         }

    //         if(updated){
    //             let start = d.start;
    //             let end = d.end;
    //             d.start = end;
    //             d.end = start;
    //         }
    //         return d;          

    //     })
    //     // .each(function(d){
    //     //     console.log(d.start, d.end)
    //     // })
    //     .transition()
    //     .duration(3000)
    //     .attrTween("d", function(d,i) {

    //         return function(t) {
    //             let time = t.round(1);
    //             return interpolate(
    //             d.start, 
    //             d.end, 
    //                 {maxSegmentLength: 10}
    //             );
    //         }

            
    //     }).end();

    // backCardSvg.select("#card_back")
    //     .selectAll("g")
    //     .filter(function(d,i){
    //         return wordsToMove.indexOf(d.key) == -1;
    //     })
    //     .style("opacity",0);

    // updated = true;
    // moved = !moved;

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

<div class:flipped class="back-card-wrapper" on:click={() => flipped = !flipped }>
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
    transform: rotate(-2deg);
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
    transform: rotateY(180deg);
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