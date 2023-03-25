import { component$, useContext } from '@builder.io/qwik'
import { decodeProps } from '~/sitewide/utility'
import {
  apiPdpHrefBase,
  skuFacetContext,
  type SkuDetail,
  type SkuFacets,
} from '~/routes/store/product/[prodName]/[prodId]'
import { encode } from 'html-entities'

export interface SizeFacet {
  size: string
  SKU_ID?: string
  bopisAvailable?: boolean
  ONLINE_INVENTORY?: boolean
  sddAvailable?: boolean
  isPreorder?: boolean
  isBackorder?: boolean
}

export interface ColorFacet {
  color: string
  SWATCH_IMAGE_ID?: string
  SKU_ID?: string
  bopisAvailable?: boolean
  ONLINE_INVENTORY?: boolean
  sddAvailable?: boolean
  isPreorder?: boolean
  isBackorder?: boolean
}

/**
 * Returns a sku for a specified color and size
 * @param skuDetails - Array of Sku objects
 * @param color (opt) - color to search for
 * @param size (opt) - size to search for
 * @returns Sku object || undefined
 */
const _skuByColorSize = (
  skuDetails: Array<SkuDetail>,
  color: string | null,
  size: string | null,
) => {
  const skuMatch = skuDetails.filter((sku: SkuDetail) => {
    return color && size
      ? sku.SKU_SIZE == size && sku.COLOR == color
      : color
      ? sku.COLOR == color
      : sku.SKU_SIZE == size
  })
  return skuMatch[0]
}

/**
 * Updates pdpDetails with Sku ID
 * from specified color and size
 * @param skuFacets - sku facet
 * @param color (opt) - color to search for
 * @param size (opt) - size to search for
 * @returns
 */
const _facetUpdate = (
  skuFacets: SkuFacets,
  color: string | null,
  size: string | null,
) => {
  if (color) skuFacets.color = color
  if (size) skuFacets.size = size
  const facetSku = _skuByColorSize(
    skuFacets.skuDetails,
    skuFacets.color,
    skuFacets.size,
  )

  if (!facetSku) return
  const skuId = facetSku.SKU_ID
  const skuUrl = new URL(location.href)
  skuUrl.searchParams.set('skuId', skuId)
  history.replaceState(null, '', skuUrl.href)
  skuFacets.pdpDetTrigger.value = `${apiPdpHrefBase}${skuFacets.prodId}?&siteId=BedBathUS&skuId=${skuId}&color=&size=&bopisStoreId=&pickup=&sdd=&tz=420&allSkus=true&ssr=true&__amp_source_origin=https%3A%2F%2Fwww.bedbathandbeyond.com`
}

interface FacetColor {
  facet: ColorFacet
  i: number
}
const FacetColor = component$<FacetColor>(({ facet, i }) => {
  const skuFacets = useContext(skuFacetContext)
  decodeProps(facet, ['color'])
  return (
    <button
      class='gr05 btn btnPrimary'
      key={i}
      onClick$={() => _facetUpdate(skuFacets, facet.color, null)}
    >
      {facet.color}
    </button>
  )
})

interface FacetSize {
  facet: SizeFacet
  i: number
}
const FacetSize = component$<FacetSize>(({ facet, i }) => {
  const skuFacets = useContext(skuFacetContext)
  decodeProps(facet, ['size'])
  return (
    <button
      class='gr05 btn btnPrimary'
      key={i}
      onClick$={() => {
        _facetUpdate(skuFacets, null, facet.size)
      }}
    >
      {facet.size}
    </button>
  )
})

interface Facets {
  facets: Array<ColorFacet> | Array<SizeFacet>
  type: 'colors' | 'size'
}
export const Facets = component$<Facets>(({ facets, type }) => {
  console.log(`Building <Facets type=${type} />`)
  const isColor = type == 'colors'
  if (!facets || facets.length <= 1) return null
  return (
    <div class='flex mid hScroll'>
      {facets.map((facet: any, i: number) =>
        isColor ? (
          <FacetColor facet={facet} i={i} key={i} />
        ) : (
          <FacetSize facet={facet} i={i} key={i} />
        ),
      )}
    </div>
  )
})
