export interface GeoJsonPolygon {
  type: "Polygon"
  coordinates: number[][][]
}

export interface ExtractFilter {
  id: string
  polygon_id: string
  name: string
  georeference: GeoJsonPolygon
  city: string
  property_type: string | null
  property_status: string | null
  min_price: number | null
  max_price: number | null
  min_bedrooms: number | null
  max_bedrooms: number | null
  min_bathrooms: number | null
  max_bathrooms: number | null
  min_area: number | null
  max_area: number | null
  parking: boolean | null
  min_stratum: number | null
  max_stratum: number | null
  min_age: number | null
  max_age: number | null
}

export interface AnalyzeFilter {
  id: string
  polygon_id: string
  name: string
  georeference: GeoJsonPolygon
  city: string
  deviation_threshold: number
  min_price: number | null
  max_price: number | null
  min_bedrooms: number | null
  max_bedrooms: number | null
  min_bathrooms: number | null
  max_bathrooms: number | null
  min_area: number | null
  max_area: number | null
  parking: boolean | null
  min_stratum: number | null
  max_stratum: number | null
  min_age: number | null
  max_age: number | null
}

export interface ExtractParams {
  propertyType: "apartment" | "house"
  businessType: "sale" | "rent"
  status: "used" | "new" | "any"
  priceRange?: [number, number]
  areaRange?: [number, number]
  rooms?: number[]
  bathrooms?: number[]
  parking?: number[]
  stratum?: number[]
}

export interface RawProperty {
  id: string
  link: string
  state: "ORIGINAL" | "REMODELED"
  area: number
  price: number
  age: string
  admin_price: number
  price_per_sqm: number
  address: string
  neighborhood: string
  rooms: number
  bathrooms: number
  floor: number
  elevator: boolean
  stratum: number
  parking: boolean
  description: string | null
  notes: string | null
  images: string[]
  latitude: number | null
  longitude: number | null
}

export type PlatformId = "metroCuadrado" | "fincaRaiz"

export interface PlatformClient {
  name: PlatformId
  fetchProperties(
    filter: ExtractFilter,
    params: ExtractParams,
    since: Date | null,
  ): Promise<RawProperty[]>
}
