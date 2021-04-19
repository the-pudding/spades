<script>
  export let copy;
</script>

<svelte:head>
  <title>{copy.title}</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="description" content="{copy.description}" />
  <meta name="author" content="Russell Goldenberg" />
  <meta name="news_keywords" content="solo, bands, boy bands, girl groups" />

  <meta property="og:title" content="{copy.title}" />
  <meta property="og:site_name" content="The Pudding" />
  <meta property="og:url" content="{copy.url}" />
  <meta property="og:description" content="{copy.description}" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="en_US" />

  <meta property="og:image" content="{copy.url}assets/social-facebook.jpg" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="600" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="https://pudding.cool" />
  <meta name="twitter:creator" content="@codenberg" />
  <meta name="twitter:title" content="{copy.title}" />
  <meta name="twitter:description" content="{copy.description}" />
  <meta
    name="twitter:image:src"
    content="{copy.url}assets/social-twitter.jpg"
  />

  <meta name="robots" content="max-image-preview:large" />

  <link rel="canonical" href="{copy.url}" />
</svelte:head>
