<script>
    let make_model = ""

    $: model_variant = make_model
            .toLowerCase()
            .split(";")
            .map((s) => s?`[${s[0].toUpperCase()}${s.substring(1, s.length)}]`:'')
            .join("")
    const minYear = 2010

    const mileage_limit = 500000
    let min_mileage = 0
    let max_mileage = 50000
    let mileage_step = 5000

    let carsPromise = null
    let years = [...Array(new Date().getFullYear() - minYear) + 1].map(
        (x, i) => minYear + i
    )
    let provinces = [
        'Gauteng',
        'Limpopo',
        'Northern Cape',
        'Eastern Cape',
        'Western Cape',
        'North West Province',
        'Mpumalanga',
        'Kwazulu Natal',
        'Free State'
    ]

    let selectedYear
    let selectedProvince

    function handleSearch() {
        carsPromise = fetch(
            `https://api.cars.co.za/fw/public/v3/vehicle?page[offset]=0&page[limit]=120&make_model_variant${model_variant}[All]&sort[date]=desc&mileage[0]=${min_mileage}-${max_mileage}&year[0]=${selectedYear}-${selectedYear}${selectedProvince? "&province[0]=" + encodeURIComponent(selectedProvince):""}`,
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

    function getMin(cars) {
        return (
            cars.reduce((x, car) => car.attributes.price < x? car.attributes.price:x, cars[0].attributes.price)
        )
    }

    function getMax(cars) {
        return (
            cars.reduce((x, car) => car.attributes.price > x? car.attributes.price:x, cars[0].attributes.price)
        )
    }


    const currencyFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "ZAR",
    })

    function formatCurrency(value) {
        return currencyFormat.format(value)
    }

    const kmFormat = new Intl.NumberFormat("en-ZA", {
    style: "unit",
    unit: "kilometer",
    })
    function formatKm(value) {
        return kmFormat.format(value)
    }

</script>

<h2 class="font-bold">Mileage</h2>
<div class="">
    <label class="label">
        <span class="label-text">Minimum</span>
        <span class="label-text-alt font-bold">{formatKm(min_mileage)}</span>
        
    </label>
    <input
        type="range"
        min={0}
        max={mileage_limit - mileage_step}
        step={mileage_step}
        bind:value={min_mileage}
        class="range"
    />
</div>
<div>
    <label class="label">
        <span class="label-text">Maximum</span>
        <span class="label-text-alt font-bold">{formatKm(max_mileage)}</span>
    </label>
    <input
        type="range"
        min={min_mileage}
        max={mileage_limit}
        step={mileage_step}
        bind:value={max_mileage}
        class="range"
    />
</div>
<br/>
<div>
    <h2 class="mb-3 font-bold">Car</h2>
    
    <div class="join">
        <input
            bind:value={make_model}
            class="input input-bordered join-item"
            placeholder="e.g. Ford;Figo"
        />

        <select
            class="select select-bordered join-item"
            bind:value={selectedYear}
        >
            <option selected>Year</option>
            {#each years as year}
                <option value={year}>
                    {year}
                </option>
            {/each}
        </select>
    </div>
</div>
<select
    class="select select-bordered my-8"
    bind:value={selectedProvince}
>
    <option selected value="">Any province</option>
    {#each provinces as province}
        <option value={province}>
            {province}
        </option>
    {/each}
</select>

<button on:click={handleSearch} class="btn join-item btn-primary">Search</button>

<br/>
<br/>
<br/>
{#if carsPromise}
    {#await carsPromise}
        <span class="loading loading-spinner loading-lg"></span>
    {:then cars}
        <p>{cars.data.length} cars found</p><br/>
        {#if cars.data.length > 0}
            <h4>Average price is <b>{formatCurrency(getAverage(cars.data))}</b></h4>
            <h4>Highest price is <b>{formatCurrency(getMax(cars.data))}</b></h4>
            <h4>Lowest price is <b>{formatCurrency(getMin(cars.data))}</b></h4>
        {/if}
    {:catch error}
        <h3>Failed</h3>
    {/await}
{/if}
