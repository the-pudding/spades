<script>
  import { Delaunay } from "d3-delaunay";
  import { polygonCentroid } from "d3-polygon";
  import { getContext } from "svelte";
  import { uniques } from "layercake";

  export let data = [];

  const { width, height, custom } = getContext("LayerCake");

  $: points = data.map((d) => {
    const point = [
      ((d.x / 100) * $width) / $custom.aspectRatio,
      (d.y / 100) * $height,
    ];
    point.data = d;
    return point;
  });

  $: uniquePoints = uniques(points, (d) => d.join(), false);

  $: voronoi = Delaunay.from(points).voronoi([0, 0, $width, $height]);
  $: cells = data.map((d, i) => [d, voronoi.cellPolygon(i)]);
  $: centers = cells.map(([d, cell]) => polygonCentroid(cell));
</script>

{#each uniquePoints as point, i}
  <path class="voronoi-cell" d="{voronoi.renderCell(i)}"></path>
{/each}

{#each centers as c}
  <circle cx="{c[0]}" cy="{c[1]}" r="2"></circle>
{/each}

{#each centers as c, i}
  <path d="M{c.join(',')}L{points[i].join(',')}"></path>
{/each}

{#each points as p, i}
  <text text-anchor="middle" transform="translate({centers[i].join(',')})"
    >{p.data.spotifyName}</text
  >
{/each}

<style>
  .voronoi-cell {
    fill: none;
    stroke: #000;
    stroke: none;
  }
  path {
    fill: none;
    stroke: none;
  }
</style>
