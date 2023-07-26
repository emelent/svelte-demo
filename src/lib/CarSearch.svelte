<script>
    let make_model = "ford figo"

    $: model_variant = make_model
            .toLowerCase()
            .split(" ")
            .map((s) => s?`[${s[0].toUpperCase()}${s.substring(1, s.length)}]`:'')
            .join("")
    const minYear = 2010

    let min_mileage = 0
    let max_mileage = 50000

    let carsPromise = null
    let years = [...Array(new Date().getFullYear() - minYear)].map(
        (x, i) => minYear + i
    )
    let selectedYear
    function handleSearch() {
        carsPromise = fetch(
            `https://api.cars.co.za/fw/public/v3/vehicle?page[offset]=0&page[limit]=120&make_model_variant${model_variant}[All]&sort[date]=desc&mileage[0]=${min_mileage}-${max_mileage}&year[0]=${selectedYear}-${selectedYear}`,
            {
                body: null,
                method: "GET",
                mode: "cors",
                credentials: "omit",
            }
        ).then((r) => r.json())
    }

    function getAverage(cars) {
        return (
            cars.reduce((total, car) => total + car.attributes.price, 0) /
            cars.length
        )
    }

    const currencyFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "ZAR",
    })
    function formatCurrency(value) {
        return currencyFormat.format(value)
    }
</script>

<h2>Mileage (km)</h2>
<div class="w-[400px]">
    <label class="label">
        <span class="label-text">Min</span>
        <span class="label-text-alt">Max</span>
    </label>
    <div class="join">
        <input
            type="number"
            bind:value={min_mileage}
            class="input input-bordered join-item"
        />
        <input
            type="number"
            bind:value={max_mileage}
            class="input input-bordered join-item"
        />
    </div>
</div>
<div>
    <label class="label">
        <span class="label-text">Search Car {model_variant}</span>
    </label>
    <div class="join">
        <input
            bind:value={make_model}
            class="input input-bordered join-item"
            placeholder="e.g. Ford Figo"
        />

        <select
            class="select select-bordered join-item"
            bind:value={selectedYear}
        >
            <option disabled selected>Year</option>
            {#each years as year}
                <option value={year}>
                    {year}
                </option>
            {/each}
        </select>
        <div class="indicator">
            <button on:click={handleSearch} class="btn join-item btn-primary"
                >Search</button
            >
        </div>
    </div>
</div>

{#if carsPromise}
    {#await carsPromise}
        <p>...waiting</p>
    {:then cars}
        {#if cars.data.length > 0}
            <p>Average price is R {formatCurrency(getAverage(cars.data))}</p>
        {:else}
            <p>No cars found</p>
        {/if}
    {:catch error}
        <h3>Failed</h3>
    {/await}
{/if}
