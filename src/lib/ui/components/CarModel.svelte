<script>
export let search
export let year


const minYear = 2010

let years = [...Array(new Date().getFullYear() - minYear + 1)].map(
        (x, i) => minYear + i
    )

</script>

<div class="join w-full">
    <input
        bind:value={search}
        class="input input-bordered join-item flex-1"
        placeholder="e.g. figo"
    />

    <select
        class="select select-bordered join-item"
        bind:value={year}
    >
        <option selected>Year</option>
        {#each years as year}
            <option value={year}>
                {year}
            </option>
        {/each}
    </select>
</div>