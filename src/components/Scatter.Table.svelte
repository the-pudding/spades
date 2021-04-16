<script>
  export let data = [];
</script>

<table>
  <thead>
    <th>Name</th>
    <th>Top 100s</th>
    <th>#1 Hits</th>
  </thead>
  <tbody
    >{#each data as { spotifyName, ranks, isBand }}
      <tr class:isBand>
        <td>{spotifyName}</td>
        <td>{ranks.length}</td>
        <td>{ranks.filter((d) => d === 1).length}</td>
      </tr>
    {/each}</tbody
  >
</table>

<style>
  tr {
    background-color: var(--off-white);
    border-bottom: 1px solid var(--bg);
  }

  .isBand {
    background-color: var(--primary);
    color: var(--bg);
  }
</style>
