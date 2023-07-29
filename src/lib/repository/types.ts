export interface CarData
{
    price: number
    imageUrl: string
    infoUrl: string
    make: string
    model: string
    variant: string
    title: string
}

export interface SearchData{
    year: number
    maxMileage: number
    minMileage: number
    search: string
    province?: string
}

export interface ApiOptions {
    carscoza: boolean
    autotrader: boolean
    webuycars: boolean
}