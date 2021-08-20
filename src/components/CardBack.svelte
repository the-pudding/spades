

<script>

import { onMount, tick } from "svelte";
import {selectAll, select} from 'd3-selection';

import backCardOne from "../svg/card_back_4.svg";
import backCardTwo from "../svg/card_back_5.svg";


let mounted;

onMount(async() => {
    mounted = true;    
    await tick();

    let backCardSvg = select(".back-card-svg").select("svg")
    let backCardSvgTwo = select(".back-card-svg-2").select("svg")

    let know = backCardSvg.select("#know")

    let newPaths = [];
    let knowTwo = backCardSvgTwo.select("#know").selectAll("path").each(function(d){
      newPaths.push(select(this).attr("d"));
    });

    console.log(newPaths)
    
    know.selectAll("path")
      .attr("d",function(d,i){
        //want transition here.
        return newPaths[i];
      });
})
  
</script>

<div class="back-card-wrapper">
    <div class="back-card card-slide">
      <div class="back-card-svg">
        {@html backCardOne}
      </div>
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
  }

  .back-card {
    height: calc(100vh - 50px);
    max-height: none;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    background: #222;
    border: none;
    box-shadow: 0px 0px 3px 3px rgba(0,0,0,.35), 0px -11px 34px rgba(0,0,0,.24);
  }

  .back-card-svg {
    height: calc(100% - 3rem);
    width: calc(100% - 3rem);
    margin: 0 auto;
    margin-top: 1.5rem;
    /* background: url('../assets/back-black.svg') no-repeat; */
  }

  .back-card-svg:before {
    content: '';
    background: url('../assets/hand-2.svg') no-repeat center;
    width: 100px;
    position: absolute;
    top: -15px;
    right: -10px;
    height: 100px;
    transform: translate(0, -50%);
    z-index: 100;
  }

  .back-card-svg-2 {
    display: none;
  }

  .back-card-svg:after {
    content: '';
    width: calc(100% - 1.5rem);
    height: calc(100% - 1.5rem);
    border: 2px solid #9A75C3;
    border: 2px solid #FFF;
    position: absolute;
    border-radius: 20px;
    right: 0;
    top: 0.75rem;
    left: 0;
    margin: 0 auto;
  }

</style>