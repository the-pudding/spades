<script>
  export let copy;
</script>

<div>
  <h1>{copy.description}</h1>
</div>

<div>
  {#each copy.intro as { type, value }}
    {#if type === "text"}
      <p>{@html value}</p>
    {:else if type === "quote"}
      <blockquote><p>{value}</p></blockquote>
    {/if}
  {/each}
</div>

<style>
  h1 {
    font-size: 42px;
    line-height: 1.125;
    margin-bottom: 1em;
  }
  div {
    max-width: 40em;
    margin: 0 auto;
  }
</style>
