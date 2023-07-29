<script>
    import { capitalizeEachWord } from "../../utils/strings"
    import { getCurrentYear } from "../../utils/time"
    import CarMileage from "../components/CarMileage.svelte"
    import CarModel from "../components/CarModel.svelte"

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

    let model_year = getCurrentYear() - 1
    let selectedProvince
    let model_search


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
        const searchParam = isKeywordSearch(model_search)
            ? createKeywordParam(model_search)
            : createModelVariantParam(model_search)
        console.log(searchParam)
        carsPromise = fetch(
            `https://api.cars.co.za/fw/public/v3/vehicle?page[offset]=0&page[limit]=120${searchParam}&sort[date]=desc&mileage[0]=${min_mileage}-${max_mileage}&year[0]=${model_year}-${model_year}${
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

    <h2 class="font-bold">Mileage</h2>
    <CarMileage 
        bind:max_mileage={max_mileage}
        bind:min_mileage={min_mileage}
    />

    <h2 class="mb-3 font-bold">Car</h2>
    <CarModel 
        bind:search={model_search}
        bind:year={model_year}
    />

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
