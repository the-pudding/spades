


<script>
	export let content;
	
    import { onMount, tick } from "svelte";

    onMount(async() => {
        
        await tick();

    
    })


</script>

<div class="trifold-wrapper">
    {#each content.cardText as cardText, indexInner}
        <div class="page">
            <p>hi</p>
        </div>
    {/each}    
</div>

<style>
    .trifold-wrapper {
        display: flex;
        height: 100%;
    }

    .page {
        width: 400px;
        height: 100%;
    }
</style>

