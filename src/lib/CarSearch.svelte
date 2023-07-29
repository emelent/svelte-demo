<script>
    import CarMileage from "./CarMileage.svelte"

    const mileage_upper_limit = 500_000
    const mileage_step = 5000
    const minYear = 2010
    const provinces = [
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

    let min_mileage = 0
    let max_mileage = 50_000

    let carsPromise = null
    let years = [...Array(new Date().getFullYear() - minYear + 1)].map(
        (x, i) => minYear + i
    )


    let selectedYear = 2021
    let selectedProvince
    let search

    function capitalizeEachWord(s) {
        return s
            .split(" ")
            .map((s) => (s ? `${s[0].toUpperCase()}${s.slice(1)}` : ""))
            .join(" ")
            .trim()
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
            (car, prevCar) =>
                car.attributes.price < prevCar.attributes.price ? car : prevCar,
            cars[0]
        )
    }

    function getMaxCar(cars) {
        return cars.reduce(
            (car, prevCar) =>
                car.attributes.price > prevCar.attributes.price ? car : prevCar,
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

    function getCarImageUrl(car) {
        const image = car.attributes.image
        const slug =
            car.attributes.title.replaceAll(" ", "-").replaceAll(".", "") +
            image.extension
        return `https://img-ik.cars.co.za/ik-seo/${image.path}/${image.name}/${slug}`
    }
</script>

    <CarMileage 
        upper_limit={mileage_upper_limit}
        step={mileage_step}
        bind:max_mileage={max_mileage}
        bind:min_mileage={min_mileage}
    />

    <h2 class="mb-3 font-bold">Car</h2>
    <div class="join w-full">
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
<select class="select select-bordered my-8 block w-full" bind:value={selectedProvince}>
    <option selected value="">Any province</option>
    {#each provinces as province}
        <option value={province}>
            {province}
        </option>
    {/each}
</select>

<button on:click={handleSearch} class="btn block m-auto join-item btn-primary">Search</button
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

                <a
                    href={maxCar.attributes.website_url}
                    target="_blank"
                    class="stat"
                >
                    <div class="stat-title">Highest</div>
                    <div class="stat-value text-2xl text-neutral-content">
                        {formatCurrency(maxCar.attributes.price)}
                    </div>
                    <div class="stat-figure text-secondary">
                        <div class="avatar">
                            <div class="w-16 rounded-full">
                                <img src={getCarImageUrl(maxCar)} alt="Car" />
                            </div>
                        </div>
                    </div>
                </a>

                <a
                    href={minCar.attributes.website_url}
                    target="_blank"
                    class="stat"
                >
                    <div class="stat-title">Lowest</div>
                    <div class="stat-value text-2xl text-neutral-content">
                        {formatCurrency(minCar.attributes.price)}
                    </div>
                    <div class="stat-figure text-secondary">
                        <div class="avatar">
                            <div class="w-16 rounded-full">
                                <img src={getCarImageUrl(minCar)} alt="Car" />
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
