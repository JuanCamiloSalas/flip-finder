import { getExtractFilters, getLastExecution, upsertProperties, createExecution, disconnect } from "./db.js"
import { metroCuadradoClient } from "./platforms/metro-cuadrado/client.js"
import { fincaRaizClient } from "./platforms/finca-raiz/client.js"
import type { PlatformClient, ExtractFilter, ExtractParams, RawProperty } from "./types.js"

const platforms: PlatformClient[] = [metroCuadradoClient, fincaRaizClient]

const PROPERTY_TYPE_MAP: Record<string, ExtractParams["propertyType"]> = {
  APARTMENT: "apartment",
  STUDIO: "apartment",
  HOUSE: "house",
}

const PROPERTY_STATUS_MAP: Record<string, ExtractParams["status"]> = {
  NEW: "new",
  USED: "used",
}

function buildRange(min: number | null, max: number | null): [number, number] | undefined {
  if (min === null && max === null) return undefined
  return [min ?? 0, max ?? 999999999]
}

function buildIntArray(min: number | null, max: number | null): number[] | undefined {
  if (min === null && max === null) return undefined
  const lo = min ?? 0
  const hi = max ?? 10
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
}

const AGE_MAP: Record<string, number> = {
  "menor a 1 año": 0,
  "Entre 0 y 5 años": 3,
  "1 a 8 años": 5,
  "Entre 5 y 10 años": 8,
  "9 a 15 años": 12,
  "Entre 10 y 20 años": 15,
  "16 a 30 años": 23,
  "Más de 20 años": 23,
  "más de 30 años": 35,
}

function parseAvgAge(age: string): number | null {
  return AGE_MAP[age] ?? null
}

function buildParams(filter: ExtractFilter): ExtractParams {
  return {
    propertyType: (filter.property_type ? PROPERTY_TYPE_MAP[filter.property_type] : undefined) ?? "apartment",
    businessType: "sale",
    status: (filter.property_status ? PROPERTY_STATUS_MAP[filter.property_status] : undefined) ?? "used",
    priceRange: buildRange(filter.min_price, filter.max_price),
    areaRange: buildRange(filter.min_area, filter.max_area),
    rooms: buildIntArray(filter.min_bedrooms, filter.max_bedrooms),
    bathrooms: buildIntArray(filter.min_bathrooms, filter.max_bathrooms),
    parking: filter.parking ? [1, 2, 3, 4, 5] : undefined,
    stratum: buildIntArray(filter.min_stratum, filter.max_stratum),
  }
}

async function main() {
  console.log("Starting extraction...")

  const filters = await getExtractFilters()
  console.log(`Found ${filters.length} EXTRACT filter(s)`)

  if (filters.length === 0) {
    console.log("No filters to process. Exiting.")
    await disconnect()
    process.exit(0)
    return
  }

  const performedAt = new Date()
  let totalUpserted = 0

  for (const filter of filters) {
    console.log(`\nProcessing filter: ${filter.name} (${filter.city})`)

    const lastExecution = await getLastExecution(filter.id, "EXTRACT")
    if (lastExecution) {
      console.log(`  Last successful extraction: ${lastExecution.toISOString()}`)
    } else {
      console.log("  First extraction for this filter")
    }

    const params: ExtractParams = buildParams(filter)

    const allProperties: RawProperty[] = []
    let hasFailed = false

    for (const platform of platforms) {
      try {
        const properties = await platform.fetchProperties(filter, params, lastExecution)
        console.log(`  ${platform.name}: ${properties.length} properties fetched`)
        allProperties.push(...properties)
      } catch (error) {
        hasFailed = true
        console.error(`  ${platform.name}: Error fetching properties:`, error instanceof Error ? error.message : error)
      }
    }

    // Filter out properties with missing IDs and deduplicate by ID
    const seen = new Set<string>()
    const validProperties = allProperties.filter((p) => {
      if (p.id === "" || seen.has(p.id)) return false
      seen.add(p.id)
      return true
    })

    console.log(`  ${validProperties.length} valid properties after filtering duplicates and missing IDs`)

    // Discard properties outside the filter's price range
    const priceFiltered = validProperties.filter((p) => {
      if (filter.min_price !== null && p.price < filter.min_price) return false
      if (filter.max_price !== null && p.price > filter.max_price) return false
      return true
    })

    if (priceFiltered.length < validProperties.length) {
      console.log(`  Discarded ${validProperties.length - priceFiltered.length} properties outside price range`)
    }

    const withTimestamp = priceFiltered.map((p) => ({
      ...p,
      avg_age: parseAvgAge(p.age),
      extracted_at: performedAt,
    }))

    console.log(`  Upserting ${withTimestamp.length} properties into DB...`)
    const upserted = withTimestamp.length > 0 ? await upsertProperties(withTimestamp) : 0
    totalUpserted += upserted
    console.log(`  Upserted ${upserted} properties into DB`)

    await createExecution({
      polygonFilterId: filter.id,
      type: "EXTRACT",
      status: hasFailed ? "FAILED" : "SUCCESS",
      propertiesFound: allProperties.length,
      propertiesNew: upserted,
      performedAt,
    })
  }

  console.log(`\nExtraction complete. Total upserted: ${totalUpserted}`)
  await disconnect()
  process.exit(0)
}

main().catch((error) => {
  console.error("Fatal error:", error)
  disconnect().finally(() => process.exit(1))
})
