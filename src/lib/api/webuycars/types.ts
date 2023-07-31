export interface WebuycarsSearchResult {
    data: Array<WebuycarsVehicleData>;
    aggregations: Aggregations;
    total: Total;
  }
  
  interface Total {
    value: number;
    relation: string;
  }
  
  interface Aggregations {
    provinces: Province[];
    branches: Province[];
    makes: Province[];
    models: Province[];
    variants: Province[];
    axleConfigurations: Province[];
    bodyTypes: Province[];
    colours: Province[];
    seats: Province[];
    fuelTypes: Province[];
    fuel_consumption_ranges: Fuelconsumptionrange[];
    transmissions: Province[];
    price_ranges: Fuelconsumptionrange[];
    monthly_installment_ranges: Fuelconsumptionrange[];
    kilometers_ranges: Kilometersranges;
    year_ranges: Yearranges;
    financeGrades: Province[];
    vehicleStatus: Province[];
    auctions: any[];
    auctionNewArrivals: AuctionNewArrival[];
    auctionPromotions: AuctionNewArrival[];
    auctionDealerOnly: AuctionNewArrival[];
    category_counts: Categorycounts;
  }
  
  interface Categorycounts {
    categories: Province[];
    subcategories: Province[];
    filterTypes: FilterType[];
  }
  
  interface FilterType {
    key: string;
    name: string;
    doc_count: number;
    subTypes?: SubType[];
  }
  
  interface SubType {
    key: string;
    name: string;
    doc_count: number;
  }
  
  interface AuctionNewArrival {
    end: number;
  }
  
  interface Yearranges {
    '2013': _2013;
    '2014': _2013;
    '2015': _2013;
    '2016': _2013;
    '2017': _2013;
    '2018': _2013;
    '2019': _2013;
    '2020': _2013;
    '2021': _2013;
    '2022': _2013;
    '2023': _2013;
    '2024': _2013;
  }
  
  interface _2013 {
    from: number;
    to: number;
    doc_count: number;
  }
  
  interface Kilometersranges {
    '*-10000.0': _100000;
    '*-20000.0': _100000;
    '*-30000.0': _100000;
    '*-40000.0': _100000;
    '*-50000.0': _100000;
    '*-60000.0': _100000;
    '*-70000.0': _100000;
    '*-80000.0': _100000;
    '*-90000.0': _100000;
    '*-100000.0': _100000;
    '*-120000.0': _100000;
    '*-140000.0': _100000;
    '*-160000.0': _100000;
    '*-180000.0': _100000;
    '*-200000.0': _100000;
    '*-250000.0': _100000;
    '*-1000000.0': _100000;
  }
  
  interface _100000 {
    to: number;
    doc_count: number;
  }
  
  interface Fuelconsumptionrange {
    key: number;
    doc_count: number;
  }
  
  interface Province {
    key: string;
    doc_count: number;
  }
  
  export interface WebuycarsVehicleData {
    DataTimestamp: string;
    Category: string;
    Subcategory: string;
    FilterCategory: string;
    Colour: string;
    Condition: string;
    DealerKey: string;
    BranchCode: string;
    Province: string;
    Description: string;
    Make: string;
    Model: string;
    Mileage: number;
    OnlineDescription: string;
    Variant: string;
    Price: number;
    StockNumber: string;
    InternalStockNumber: string;
    BuyLeadCode: string;
    Year: number;
    VehicleBarcode: string;
    AxleConfiguration: string;
    BodyType: string;
    NoOfDoors: string;
    Drive: string;
    Seats: string;
    Use: string;
    Gearbox: string;
    NoGears: string;
    Cooling: string;
    CubicCapacity: string;
    CylConfiguration: string;
    EngineCycle: string;
    FuelTankSize: string;
    FuelType: string;
    FuelConsumption: number;
    Kilowatts: string;
    NoCylinders: string;
    TurboOrSuperCharged: string;
    GCM: string;
    GVM: string;
    Tare: string;
    FrontNoTyres: string;
    FrontTyreSize: string;
    RearNoTyres: string;
    RearTyreSize: string;
    CO2: string;
    Length: string;
    Height: string;
    Width: string;
    OpeningBid: number;
    BuyNowPrice: number;
    ServiceHistory: string;
    LastServiceDate: string;
    LastServiceKM: number;
    LicenseDisk: string;
    HasSpareKey: boolean;
    StockStatus: string;
    Status: string;
    FinanceGrade: string;
    PricingGrade: string;
    LastPriceUpdateDate: string;
    VIN: string;
    VehicleStatus: string;
    AssignedParkingBay: string;
    MonthlyInstalment: number;
    VehicleType: string;
    PreviousPrice: number;
    HasAnyRoadworthyRelevantIssues: boolean;
    RoadworthyRelevantIssues: number;
    HasDekraVoucher: boolean;
    HasRoadworthyCompleted: boolean;
    Images: Images;
    ImagePaths: any[];
    Eval_ServiceHistory: string;
    Eval_Maintenance_Active: boolean;
    Eval_Maintenance_Expiry: string;
    Eval_Warranty_Active: boolean;
    Eval_Warranty_Expiry: string;
    DefaultSortOrder: number;
    StockTag: string;
    SearchTag: string;
    DisplayRules: DisplayRule[];
  }
  
  interface DisplayRule {
    AppliedTo: string;
    RuleName: string;
    Value: string;
  }
  
  interface Images {
    internal: string;
    external: string[];
    other: string[];
    thumbnail: string[];
    social: string[];
    feed: string[];
    shop: string[];
  }
  
  