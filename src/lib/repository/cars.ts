import type { ApiOptions, CarData, SearchData } from "./types";
import carsApi from "../api/cars.co.za/carsApi"
import webuycarsApi from "../api/webuycars/webuycarsApi";

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
        promises.push(carsApi.fetchCars(searchData))
    }

    if(opts.webuycars) {
        promises.push(webuycarsApi.fetchCars(searchData))
    }

    const results = await Promise.allSettled(promises)
    return results
        .reduce(
            (results, result) => result.status === 'fulfilled'? 
                [...results, ...result.value]: results , [])
}