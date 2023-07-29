import type { CarData, SearchData } from "../../repository/types"
import { capitalizeEachWord } from "../../utils/strings"
import type { Attributes, CarsSearchResult } from "./types"

function createModelVariantParam(s: string): string {
    return (
        "&make_model_variant" +
        s
            .toLowerCase()
            .split(";")
            .map(capitalizeEachWord)
            .map(encodeURIComponent)
            .map((s) =>
                s ? `[${s[0].toUpperCase()}${s.substring(1, s.length)}]` : ""
            )
            .join("") +
        "[All]"
    )
}

function createKeywordParam(s: string): string {
    return "&keyword=" + encodeURIComponent(s.trim())
}

function createProvinceParam(s?: string): string {
    return s ? "&province[0]=" + encodeURIComponent(s) : ""
}

function createMileageParam(min: number, max: number): string {
    return `&mileage[0]=${min}-${max}`
}

function createYearParam(year: number): string {
    return `&year[0]=${year}-${year}`
}

function isKeywordSearch(s: string): boolean {
    return s.indexOf(";") == -1
}

const apiUrl = "https://api.cars.co.za/fw/public/v3"

function createUrl(data: SearchData): string {
    const searchParam = isKeywordSearch(data.search)
        ? createKeywordParam(data.search)
        : createModelVariantParam(data.search)

    const mileageParam = createMileageParam(data.minMileage, data.maxMileage)
    const provinceParam = createProvinceParam(data.province)
    const yearParam = createYearParam(data.year)
    const url = `${apiUrl}/vehicle?page[offset]=0&page[limit]=120&sort[date]=desc`
    return `${url}${searchParam}${mileageParam}${yearParam}${provinceParam}`
}

function getCarImageUrl(attr: Attributes): string {
    const image = attr.image
    const slug =
        attr.title.replaceAll(" ", "-").replaceAll(".", "") + image.extension
    return `https://img-ik.cars.co.za/ik-seo/${image.path}/${image.name}/${slug}`
}

function transformData(results: CarsSearchResult): Array<CarData> {
    return results.data.map(
        (car) =>
            <CarData>{
                infoUrl: car.attributes.website_url,
                imageUrl: getCarImageUrl(car.attributes),
                make: car.attributes.make,
                model: car.attributes.model,
                price: car.attributes.price,
                title: car.attributes.title,
                variant: car.attributes.variant,
            }
    )
}

async function fetchCars(searchData: SearchData): Promise<Array<CarData>> {
    const url = createUrl(searchData)
    const response = await fetch(url, {
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
    })

    const result: CarsSearchResult = await response.json()

    return transformData(result)
}

export default {
    fetchCars,
}
