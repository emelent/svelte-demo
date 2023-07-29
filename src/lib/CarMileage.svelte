<script>
    const upper_limit = 500_000
    const step = 5000

    export let min_mileage = 0
    export let max_mileage = 50_000

    const kmFormat = new Intl.NumberFormat("en-ZA", {
        style: "unit",
        unit: "kilometer",
    })
    function formatKm(value) {
        return kmFormat.format(value)
    }

    function handleMinMileageChange(event) {
        min_mileage = parseInt(event.target.value)
        if (min_mileage >= max_mileage) {
            max_mileage = Math.min(min_mileage + step, upper_limit)
        }
    }
</script>

<h2 class="font-bold">Mileage</h2>
<div class="">
    <label class="label" for="min_mileage">
        <span class="label-text">Minimum</span>
        <span class="label-text-alt font-bold">{formatKm(min_mileage)}</span>
    </label>
    <input
        type="range"
        name="min_milage"
        min={0}
        max={upper_limit - step}
        step={step}
        on:input={handleMinMileageChange}
        value={min_mileage}
        class="range"
    />
</div>
<div>
    <label class="label" for="max_mileage">
        <span class="label-text">Maximum</span>
        <span class="label-text-alt font-bold">{formatKm(max_mileage)}</span>
    </label>
    <input
        type="range"
        name="max_mileage"
        min={min_mileage + step}
        max={upper_limit}
        step={step}
        bind:value={max_mileage}
        class="range"
    />
</div>
