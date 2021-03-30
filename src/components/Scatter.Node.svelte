<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let d;
  export let r = 4;

  const dispatch = createEventDispatcher();
  const { xGet, yGet, custom } = getContext("LayerCake");
  const { title, spotifyName, topRank } = d;

  $: w = r / $custom.aspectRatio;
  $: h = w;

  $: left = d.x;
  $: top = d.y;
  $: style = `transform: translate3d(${left}px, ${top}px, 0);`;

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
  <p class="scatter-node-text"><span>#{topRank}</span> {title}</p>
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    will-change: transform;
    border: 1px solid var(--gray-light);
    transition: transform 1000ms ease-in-out, opacity 1000ms ease-in-out;
    white-space: nowrap;
    box-shadow: 0 0 3px 0 var(--gray);
    backface-visibility: hidden;
  }

  p {
    display: block;
    position: relative;
    background-color: var(--off-white);
    color: var(--gray-light);
    transition: all 1000ms ease-in-out;
  }

  .active {
    opacity: 1;
    z-index: 1;
    border: 1px solid var(--off-black);
    box-shadow: 0 0 6px 0 var(--off-black);
    cursor: crosshair;
  }

  .active:hover {
    z-index: 2;
  }

  .active p {
    color: var(--off-black);
  }

  .node-0.active p {
    background-color: var(--node-0);
    color: var(--white);
  }

  .node-1.active p {
    background-color: var(--node-1);
  }

  .node-2.active p {
    background-color: var(--node-2);
  }

  .node-3.active p {
    background-color: var(--node-3);
  }

  .node-4.active p {
    background-color: var(--node-4);
  }

  .node-5.active p {
    background-color: var(--node-5);
    color: var(--white);
  }
</style>
