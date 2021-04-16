<script>
  export let grafs;
  export let className = "";
</script>

<div class="{className}">
  {#each grafs as { type, value }}
    <p>{@html value}</p>
  {/each}
</div>

<style>
  div {
    max-width: 40em;
    margin: 0 auto;
  }

  .small {
    margin-top: 4em;
    border-top: 1px solid var(--fg);
  }
  .small p {
    font-size: 1em;
  }
</style>
