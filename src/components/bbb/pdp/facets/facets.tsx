import { component$, useContext, useStyles$ } from '@builder.io/qwik'
import { decodeProps, titleCase } from '~/sitewide/utility'
import {
  apiPdpHrefBase,
  skuFacetContext,
  type SkuDetail,
  type SkuFacets,
} from '~/routes/store/product/[prodName]/[prodId]'

import facetStyles from './facets.css?inline'

export interface SizeFacet {
  bopisAvailable?: boolean
  facetAvailable?: boolean
  isBackorder?: boolean
  isPreorder?: boolean
  ONLINE_INVENTORY?: boolean
  sddAvailable?: boolean
  size: string
  SKU_ID?: string
}

export interface ColorFacet {
  bopisAvailable?: boolean
  color: string
  facetAvailable?: boolean
  isBackorder?: boolean
  isPreorder?: boolean
  ONLINE_INVENTORY?: boolean
  sddAvailable?: boolean
  SKU_ID?: string
  SWATCH_IMAGE_ID?: string
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
      class={`
        parent midCtr swatchTap btnColor 
        ${!facet.bopisAvailable ? 'outStockBopis ' : ''}
        ${!facet.sddAvailable ? 'outStockSdd ' : ''}
        ${!facet.ONLINE_INVENTORY ? 'outStockOnline ' : ''}
        ${skuFacets.color == facet.color ? 'active ' : ''}
      `}
      key={i}
      onClick$={() => _facetUpdate(skuFacets, facet.color, null)}
    >
      <img
        class='swatch parent noTap'
        height='32px'
        width='32px'
        alt={facet.color}
        src={`https://b3h2.scene7.com/is/image/BedBathandBeyond/${facet.SWATCH_IMAGE_ID}?$32$&wid=32&hei=32`}
      />
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
      class={`
        v025 gr1 parent btn hDivider whiteBg btnSize 
        ${!facet.bopisAvailable ? 'outStockBopis ' : ''}
        ${!facet.sddAvailable ? 'outStockSdd ' : ''}
        ${!facet.ONLINE_INVENTORY ? 'outStockOnline ' : ''}
        ${skuFacets.size == facet.size ? 'active ' : ''}
      `}
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
  const skuFacets = useContext(skuFacetContext)
  useStyles$(facetStyles)
  console.log(`Building <Facets type=${type} />`)
  const isColor = type == 'colors'
  if (!facets || facets.length <= 1) return null
  return isColor ? (
    <div class='vt1 s12 parent facetsWrap2'>
      <div class='facetLabelWrap'>
        <b>Color</b>
        <span>- {titleCase(skuFacets.color)}</span>
      </div>
      <div class='s11 flex wrap showAllColor'>
        {facets.map((facet: any, i: number) => (
          <FacetColor facet={facet} i={i} key={i} />
        ))}
      </div>
    </div>
  ) : (
    <div class='vt1 s12 parent facetsWrap2'>
      <div class='facetLabelWrap'>
        <b>Size</b>
        <span>- {titleCase(skuFacets.size)}</span>
      </div>
      <div class='s12 flex wrap optionList showAll'>
        {facets.map((facet: any, i: number) => (
          <FacetSize facet={facet} i={i} key={i} />
        ))}
      </div>
    </div>
  )
})
