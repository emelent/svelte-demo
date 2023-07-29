import type { ApiOptions, CarData, SearchData } from "./types";
import carscoza from "../api/cars.co.za/carsApi"

const defaultApiOpts: ApiOptions = {
    autotrader: true,
    carscoza: true,
    webuycars: true
}

export async function fetchCars(
    searchData: SearchData,
    opts: ApiOptions = defaultApiOpts
): Promise<Array<CarData>> {
    
    const promises = []
    if(opts.carscoza) {
        promises.push(carscoza.fetchCars(searchData))
    }

    const results = await Promise.allSettled(promises)
    return results
        .reduce(
            (results, result) => result.status === 'fulfilled'? 
                [...results, ...result.value]: results , [])
}