export interface CarsSearchResult {
    meta: Meta
    data: Array<CarData>
}

interface Meta {
    total: number
    totalPages: number
    currentPage: number
}

interface CarData {
    type: string
    id: string
    attributes: Attributes
    relationships: Relationships
    links: Links
}

export interface Attributes {
    agent_coords_0_coord: number
    agent_coords_1_coord: number
    agent_locality: string
    agent_name: string
    agent_vin_required: string
    body_type: string
    body_type_code: string
    colour: string
    commercial_type: string
    condition: string
    description: string
    fuel_type: string
    image: Image
    make: string
    mileage: string
    model: string
    new_or_used: string
    options: string
    price: number
    province: string
    reference: string
    search_type: string
    seller_type: string
    title: string
    transmission: string
    variant: string
    variant_short: string
    vehicle_axle_config: string
    website_url: string
    year: number
}

interface Image {
    version: number
    count: number
    path: string
    name: string
    extension: string
}

interface Relationships {
    seller: Seller
}

interface Seller {
    data: Data
}

interface Data {
    type: string
    id: string
}

interface Links {
    self: string
}
