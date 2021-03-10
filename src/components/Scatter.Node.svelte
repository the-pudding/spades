<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let d;
  export let r = 4;

  const dispatch = createEventDispatcher();
  const { xGet, yGet, custom, width, height } = getContext("LayerCake");
  const pos = tweened(null, { duration: 750, easing: cubicOut });
  const { title, spotifyName, topRank } = d;

  $: w = r / $custom.aspectRatio;
  $: h = w;

  $: pos.set([d.x, d.y]);
  $: left = ($pos[0] / 100) * $width;
  $: top = ($pos[1] / 100) * $height;
  $: style = `transform: translate(${left}px, ${top}px);`;
  // $: style = `left: ${$pos[0]}%; top: ${$pos[1]}%;`;

  const onEnter = () => {
    dispatch("enter", name);
  };
  const onExit = () => {
    dispatch("exit");
  };
</script>

<div
  class:band="{$custom.type === 'band'}"
  class:green="{spotifyName === 'Kelly Rowland'}"
  style="{style}"
  on:mouseenter="{onEnter}"
  on:mouseout="{onExit}"
>
  <p>#{topRank} {title.split("(")[0].trim()}</p>
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    pointer-events: none;
    /* transform: translate(-50%, -50%); */
    will-change: transform;
    width: 50px;
    height: 50px;
    overflow: hidden;
  }

  .band {
    /* opacity: 1; */
    pointer-events: auto;
  }

  p {
    font-size: 1em;
    margin: 0;
    padding: 0 0.25em;
    text-align: center;
    position: relative;
    background: yellow;
    border: 1px solid black;
  }

  .green p {
    background: yellowgreen;
  }

  .band p {
    background: cyan;
  }
</style>
