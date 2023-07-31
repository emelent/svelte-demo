<script lang="ts">

export let useWebuycars
export let useCarscoza

</script>

<div class="form-control">
    <label class="label cursor-pointer">
      <span class="label-text">WeBuyCars</span> 
      <input type="checkbox" bind:checked={useWebuycars} class="checkbox" />
    </label>
</div>


<div class="form-control">
    <label class="label cursor-pointer">
      <span class="label-text">Cars.co.za</span> 
      <input type="checkbox" bind:checked={useCarscoza} class="checkbox" />
    </label>
</div>