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
  class:band="{d.name === d.band}"
  class:active="{d.band === $custom.activeBand}"
  style="{style}"
  on:mouseenter="{onEnter}"
  on:mouseout="{onExit}"
>
  <p>#{topRank} {title}</p>
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    z-index: 0;
    will-change: transform;
    border: 1px solid var(--gray-light);
    /* transform: translateX(-100%); */
    transition: all 1000ms ease-in-out;
    white-space: nowrap;
  }

  p {
    font-size: 16px;
    margin: 0;
    padding: 0;
    line-height: 1;
    position: relative;
    background: transparent;
    background: var(--off-white);
    padding: 2px 4px;
    color: var(--gray-light);
    transition: all 1000ms ease-in-out;
  }

  .active {
    opacity: 1;
    filter: grayscale(0);
    z-index: 1;
    border: 1px solid var(--off-black);
    box-shadow: 0 0 3px 0 var(--off-black);
  }

  .active p {
    background: yellow;
    color: var(--off-black);
  }

  .active.band p {
    background: cyan;
  }
</style>
