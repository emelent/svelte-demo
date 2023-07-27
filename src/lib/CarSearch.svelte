<script>
    let search = "swift"

    function capitalizeEachWord(s) {
        return s
            .split(" ")
            .map((s) => (s ? `${s[0].toUpperCase()}${s.slice(1)}` : ""))
            .join(" ").trim()
    }

    function createModelVariantParam(s) {
        return (
            "&make_model_variant" +
            s
                .toLowerCase()
                .split(";")
                .map(capitalizeEachWord)
                .map(encodeURIComponent)
                .map((s) =>
                    s
                        ? `[${s[0].toUpperCase()}${s.substring(1, s.length)}]`
                        : ""
                )
                .join("") +
            "[All]"
        )
    }

    function createKeywordParam(s) {
        return "&keyword=" + encodeURIComponent(s.trim())
    }

    function isKeywordSearch(s) {
        return s.indexOf(";") == -1
    }

    const minYear = 2010
    const mileage_limit = 500_000

    let min_mileage = 0
    let max_mileage = 50_000
    let mileage_step = 5000

    let carsPromise = null
    let years = [...(Array(new Date().getFullYear() - minYear) + 1)].map(
        (x, i) => minYear + i
    )
    let provinces = [
        "Gauteng",
        "Limpopo",
        "Northern Cape",
        "Eastern Cape",
        "Western Cape",
        "North West Province",
        "Mpumalanga",
        "Kwazulu Natal",
        "Free State",
    ]

    let selectedYear = 2021
    let selectedProvince

    function handleSearch() {
        // &keyword=figo
        const searchParam = isKeywordSearch(search)
            ? createKeywordParam(search)
            : createModelVariantParam(search)
        console.log(searchParam)
        carsPromise = fetch(
            `https://api.cars.co.za/fw/public/v3/vehicle?page[offset]=0&page[limit]=120${searchParam}&sort[date]=desc&mileage[0]=${min_mileage}-${max_mileage}&year[0]=${selectedYear}-${selectedYear}${
                selectedProvince
                    ? "&province[0]=" + encodeURIComponent(selectedProvince)
                    : ""
            }`,
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
        return cars.reduce(
            (x, car) => (car.attributes.price < x ? car.attributes.price : x),
            cars[0].attributes.price
        )
    }

    function getMax(cars) {
        return cars.reduce(
            (x, car) => (car.attributes.price > x ? car.attributes.price : x),
            cars[0].attributes.price
        )
    }

    function getMinCar(cars) {
        return cars.reduce(
            (car, prevCar) => (car.attributes.price < prevCar.attributes.price ? car : prevCar),
            cars[0]
        )
    }

    function getMaxCar(cars) {
        return cars.reduce(
            (car, prevCar) => (car.attributes.price > prevCar.attributes.price ? car : prevCar),
            cars[0]
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

    function handleMinMileageChange(event){
        min_mileage = parseInt(event.target.value)
        if(min_mileage >= max_mileage) {
            max_mileage = Math.min(min_mileage + mileage_step, mileage_limit)
        }
    }

    function getCarImageUrl(car) {
        const image = car.attributes.image
        const slug = car.attributes.title
            .replaceAll(" ", "-")
            .replaceAll(".", "") + image.extension
        return `https://img-ik.cars.co.za/ik-seo/${image.path}/${image.name}/${slug}`
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
        on:input={handleMinMileageChange}
        value={min_mileage}

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
        min={min_mileage + mileage_step}
        max={mileage_limit}
        step={mileage_step}
        bind:value={max_mileage}
        class="range"
    />
</div>
<div>
    <h2 class="mb-3 font-bold">Car</h2>

    <div class="join">
        <input
            bind:value={search}
            class="input input-bordered join-item"
            placeholder="e.g. swift"
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
<select class="select select-bordered my-8" bind:value={selectedProvince}>
    <option selected value="">Any province</option>
    {#each provinces as province}
        <option value={province}>
            {province}
        </option>
    {/each}
</select>

<button on:click={handleSearch} class="btn join-item btn-primary">Search</button
>

{#if carsPromise}
    {#await carsPromise}
        <span class="loading loading-spinner loading-lg" />
    {:then cars}
        <p>{cars.data.length} cars found</p>
        {#if cars.data.length > 0}
            {@const maxCar = getMaxCar(cars.data)}
            {@const minCar = getMinCar(cars.data)}
            <div class="stats stats-vertical lg:stats-horizontal shadow">

                <div class="stat">
                    <div class="stat-title">Average</div>
                    <div class="stat-value">
                        {formatCurrency(getAverage(cars.data))}
                    </div>
                </div>

                <a href={maxCar.attributes.website_url} target="_blank" class="stat">
                    <div class="stat-title">Highest</div>
                    <div class="stat-value text-neutral-content">
                        {formatCurrency(maxCar.attributes.price)}
                    </div>
                    <div class="stat-figure text-secondary">
                        <div class="avatar">
                            <div class="w-16 rounded-full">
                            <img src={getCarImageUrl(maxCar)} />
                            </div>
                        </div>
                    </div>
                </a>

                <a href={minCar.attributes.website_url} target="_blank" class="stat">
                    <div class="stat-title">Lowest</div>
                    <div class="stat-value text-neutral-content">
                        {formatCurrency(minCar.attributes.price)}
                    </div>
                    <div class="stat-figure text-secondary">
                        <div class="avatar">
                            <div class="w-16 rounded-full">
                            <img src={getCarImageUrl(minCar)} />
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        {/if}
    {:catch error}
        <h3>Failed</h3>
    {/await}
{/if}
