<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let d;
  export let r = 4;

  const dispatch = createEventDispatcher();
  const { xScale, yScale, custom, width, height } = getContext("LayerCake");
  // const pos = tweened(null, { duration: 500, easing: cubicOut });
  const { name, band, imageUrl1 } = d;

  $: w = r / $custom.fixedAspectRatio;
  $: h = w;
  // $: x = $custom.xProp;
  // $: y = $custom.yProp;
  $: active = $custom.active === band;
  // $: propX = active ? x : `band${x}`;
  // $: propY = active ? y : `band${y}`;

  // $: pos.set(d.x, d.y);
  // $: left = $pos[0];
  // $: top = $pos[1];
  $: style = `transform: translate(${d.x}px, ${d.y}px);`;
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
  class:highlight="{active}"
  style="{style}"
  on:mouseenter="{onEnter}"
  on:mouseout="{onExit}"
>
  <p>{d.name}</p>
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
    /* transform: translate(-50%, -50%); */
    will-change: transform;
  }

  div.highlight {
    opacity: 1;
  }

  div.band {
    opacity: 1;
    pointer-events: auto;
  }

  p {
    font-size: 1em;
    line-height: 1;
    background: white;
    margin: 0;
    border: 1px solid black;
    /* padding: 0 0.25em; */
    width: 100px;
    height: 22px;
  }
</style>
