<script>
  export let hed;
</script>

<div>
  <h2>
    {@html hed}
    <slot />
  </h2>
</div>

<style>
  div {
    margin: 4em auto 2em auto;
    max-width: 44em;
  }

  h2 {
    font-size: 32px;
    line-height: 1.4;
    user-select: none;
  }
</style>
