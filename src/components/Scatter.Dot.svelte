<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";

  export let d;
  export let r = 4;

  const dispatch = createEventDispatcher();
  const { xScale, yScale, custom, width, height } = getContext("LayerCake");
  const pos = tweened(null, { duration: 500, easing: cubicInOut });
  const { name, band, imageUrl1 } = d;

  $: w = r / $custom.fixedAspectRatio;
  $: h = w;
  $: active = $custom.active === band;
  $: propX = active ? "rank" : "bandRank";
  $: propY = active ? "followers" : "bandFollowers";
  $: pos.set([d[propX] || d.rank, d[propY] || d.followers]);
  $: x = ($xScale($pos[0]) / 100) * $width;
  $: y = ($yScale($pos[1]) / 100) * $height;

  const onEnter = () => {
    dispatch("enter", name);
  };
  const onExit = () => {
    dispatch("exit");
  };
</script>

<div
  class="outer"
  class:band="{$custom.type === 'band'}"
  class:highlight="{active}"
  style="transform: translate({x}px, {y}px);"
  on:mouseenter="{onEnter}"
  on:mouseout="{onExit}"
>
  <!-- <div class="inner" style="background-image: url({d.imageUrl1});">
    <span>{d.spotifyName}</span>
  </div> -->
  <p>{d.spotifyName}</p>
</div>

<style>
  .outer {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
  }
  .outer.highlight {
    opacity: 1;
  }
  .outer.band {
    opacity: 1;
    pointer-events: auto;
  }
  .inner {
    background: gray;
    border-radius: 50%;
    border: 2px solid white;
    background-size: cover;
    background-position: center center;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    transition: all 250ms ease-in-out;
    transform-origin: 50% 50%;
  }

  /* .outer:hover {
    z-index: 1000;
  }

  .outer:hover .inner {
    transform: translate(-50%, -50%) scale(4);
  } */
  p {
    font-size: 1em;
    background: yellow;
    margin: 0;
    border: 1px solid black;
    padding: 0 0.25em;
  }
  span {
    display: none;
    width: 10em;
    text-align: center;
    transform: translate(0, -100%);
    text-shadow: 0 0 4px white;
    font-weight: bold;
    display: none;
    color: red;
  }
</style>
