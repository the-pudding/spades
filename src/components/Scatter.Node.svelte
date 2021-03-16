<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let d;
  export let r = 4;

  const dispatch = createEventDispatcher();
  const { xGet, yGet, custom, width, height } = getContext("LayerCake");
  // const pos = tweened(null, { duration: 750, easing: cubicOut });
  const { title, spotifyName, topRank } = d;

  $: w = r / $custom.aspectRatio;
  $: h = w;

  // $: pos.set([d.x, d.y]);
  $: pos = [d.x, d.y];
  $: left = (pos[0] / 100) * $width;
  $: top = (pos[1] / 100) * $height;
  $: style = `transform: translate(${left}px, ${top}px);`;
  // $: style = `left: ${100 - $pos[0]}%; top: ${$pos[1]}%;`;
  // $: style = "";

  const onEnter = () => {
    dispatch("enter", name);
  };
  const onExit = () => {
    dispatch("exit");
  };
</script>

<div
  class="node-{d.i}"
  class:band="{d.name === d.band}"
  class:active="{d.band === $custom.activeBand}"
  style="{style}"
  on:mouseenter="{onEnter}"
  on:mouseout="{onExit}"
>
  <p class="scatter-node-text">#{topRank} {title}</p>
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    will-change: transform, opacity;
    border: 1px solid var(--gray-light);
    transition: transform 1000ms ease-in-out, opacity 1000ms ease-in-out;
    white-space: nowrap;
    box-shadow: 0 0 3px 0 var(--gray);
  }

  p {
    position: relative;
    background-color: var(--off-white);
    color: var(--gray-light);
    transition: all 1000ms ease-in-out;
    will-change: background-color, color;
  }

  .active {
    opacity: 1;
    filter: grayscale(0);
    z-index: 1;
    border: 1px solid var(--off-black);
  }

  .active p {
    color: var(--off-black);
  }

  .node-0.active p {
    background-color: #aff05b;
  }

  .node-1.active p {
    background-color: #6e40aa;
    color: var(--off-white);
  }

  .node-2.active p {
    background-color: #b23cb2;
    color: var(--off-white);
  }

  .node-3.active p {
    background-color: #ee4395;
  }

  .node-4.active p {
    background-color: #ff5e63;
  }

  .node-5.active p {
    background-color: #ff8c38;
  }
</style>
