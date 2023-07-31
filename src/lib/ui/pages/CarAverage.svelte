<script lang="ts">
    import { fetchCars } from "../../repository/cars"
    import type { CarData } from "../../repository/types"
    import { formatCurrency } from "../../utils/formatting"
    import { getCurrentYear } from "../../utils/time"
    import ApiCheckBox from "../components/ApiCheckBox.svelte"
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

    let useWebuycars = true
    let useCarscoza = true

    let carsPromise = null

    let model_year = getCurrentYear() - 1
    let selectedProvince
    let model_search

    function handleSearch() {
        carsPromise = fetchCars(
            {
                maxMileage: max_mileage,
                minMileage: min_mileage,
                province: selectedProvince,
                year: model_year,
                search: model_search,
            },
            {
                useAutotrader: false, 
                useCarscoza, 
                useWebuycars
            }
        )
    }

    function getAvgPrice(cars: Array<CarData>): number {
        return cars.reduce((total, car) => total + car.price, 0) / cars.length
    }

    function getMinCar(cars: Array<CarData>): CarData {
        return cars.reduce(
            (prevCar, car) => (car.price < prevCar.price ? car : prevCar),
            cars[0]
        )
    }
    function getMaxCar(cars: Array<CarData>): CarData {
        return cars.reduce(
            (prevCar, car) => (car.price > prevCar.price ? car : prevCar),
            cars[0]
        )
    }
</script>

<h2 class="font-bold">Mileage</h2>
<CarMileage bind:max_mileage bind:min_mileage />

<h2 class="mb-3 font-bold">Car</h2>
<CarModel bind:search={model_search} bind:year={model_year} />

<select
    class="select select-bordered my-8 block w-full"
    bind:value={selectedProvince}
>
    <option selected value="">Any province</option>
    {#each provinces as province}
        <option value={province}>
            {province}
        </option>
    {/each}
</select>

<h2 class="font-bold">Api</h2>
<ApiCheckBox bind:useCarscoza={useCarscoza} bind:useWebuycars={useWebuycars} />

<button on:click={handleSearch} class="btn block m-auto join-item btn-primary"
    >Search</button
>

{#if carsPromise}
    {#await carsPromise}
        <span class="loading loading-spinner loading-lg" />
    {:then cars}
        <p>{cars.length} car(s) found</p>
        {#if cars.length > 0}
            {@const maxCar = getMaxCar(cars)}
            {@const minCar = getMinCar(cars)}
            <div class="stats stats-vertical lg:stats-horizontal shadow">
                <!-- average -->
                <div class="stat">
                    <div class="stat-title">Average</div>
                    <div class="stat-value">
                        {formatCurrency(getAvgPrice(cars))}
                    </div>
                </div>

                <!-- highest price -->
                <a href={maxCar.infoUrl} target="_blank" class="stat">
                    <div class="stat-title">Highest</div>
                    <div class="stat-value text-2xl text-neutral-content">
                        {formatCurrency(maxCar.price)}
                    </div>
                    <div class="stat-figure text-secondary">
                        <div class="avatar">
                            <div class="w-16 rounded-full">
                                <img src={maxCar.imageUrl} alt="Car" />
                            </div>
                        </div>
                    </div>
                </a>

                <!-- lowest price -->
                <a href={minCar.infoUrl} target="_blank" class="stat">
                    <div class="stat-title">Lowest</div>
                    <div class="stat-value text-2xl text-neutral-content">
                        {formatCurrency(minCar.price)}
                    </div>
                    <div class="stat-figure text-secondary">
                        <div class="avatar">
                            <div class="w-16 rounded-full">
                                <img src={minCar.imageUrl} alt="Car" />
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
