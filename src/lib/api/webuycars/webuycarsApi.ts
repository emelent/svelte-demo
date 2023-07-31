import type { SearchData, CarData } from "../../repository/types"
import type { WebuycarsSearchResult, WebuycarsVehicleData } from "./types"


const apiUrl = 'https://website-elastic-api.webuycars.co.za/api/search'

const infoBaseUrl = 'https://www.webuycars.co.za/buy-a-car'
function transformData(
    cars: Array<WebuycarsVehicleData>
): Array<CarData> {

    
    return cars.map(
        car => <CarData> {
            imageUrl: car.Images.thumbnail[0],
            make: car.Make,
            model: car.Model,
            variant: car.Variant,
            title: car.Description,
            infoUrl: `${infoBaseUrl}/${car.Make}/${car.Model}/${car.StockNumber}`,
            price: car.Price
        }
    )
}

async function fetchCars(
    searchData: SearchData
): Promise<Array<CarData>> {

    const requestData = {
        to: 0,
        size: 120,
        q: searchData.search,
        Province: searchData.province === ''? undefined: searchData.province,
        Kilometers_Gte: searchData.minMileage,
        Kilometers_Lte: searchData.maxMileage,
        Year: [searchData.year]
    }

    console.log(requestData)
    const response = await fetch(apiUrl, {
        headers: {
            "content-type": "application/json",
            "accept": "application/json, text/plain, */*"
        },
        method: "POST",
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify(requestData)
    })

    const result: WebuycarsSearchResult = await response.json()
    return transformData(result.data)
}


export default {
    fetchCars
}
