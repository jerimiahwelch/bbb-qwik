import {
  component$,
  createContextId,
  Resource,
  type Signal,
  useContextProvider,
  useResource$,
  useSignal,
  useStore,
} from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'

import { decodeProps, valOrEmptyString } from '~/sitewide/utility'
import { decode } from 'html-entities'

import { Facets } from '~/components/bbb/pdp/facets/facets'
import { ProdCarousel } from '~/components/bbb/pdp/carousel/carousel'

export const apiPdpHrefBase =
  'https://www.bedbathandbeyond.com/apis/services/composite/v1.0/pdp-details/'

export interface SkuDetail {
  SKU_SIZE: string
  COLOR: string
  SKU_ID: string
}

export interface SkuFacets {
  color: string | null
  size: string | null
  prodId: string
  skuId: string | null
  pdpDetTrigger: Signal
  skuDetails: Array<SkuDetail>
}
// Sku Facet Context consumed in components/bbb/facets/facets <FacetColor /> and <FacetSize />
export const skuFacetContext = createContextId<SkuFacets>('skuFacetContext')

/**
 * PDP details section of page
 *   Image Carousel / Modal
 *   Facet Selection
 *   Offers
 *   Call to Action
 */
export default component$(() => {
  console.log('Rendering <PdpDetails />')
  const loc = useLocation()

  // Store to trigger pdpDetResource$ on Sku Updates
  // updated by components/bbb/facets/facets <FacetColor /> and <FacetSize />
  const skuId = valOrEmptyString(loc.params.skuId)
  const apiPdpHref = `${apiPdpHrefBase}${loc.params.prodId}?&siteId=BedBathUS&skuId=${skuId}&color=&size=&bopisStoreId=&pickup=&sdd=&tz=420&allSkus=true&ssr=true&__amp_source_origin=https%3A%2F%2Fwww.bedbathandbeyond.com`
  const skuFacetsStore = useStore<SkuFacets>({
    color: null,
    size: null,
    prodId: loc.params.prodId,
    skuId: skuId,
    pdpDetTrigger: useSignal(apiPdpHref),
    skuDetails: [],
  })
  useContextProvider(skuFacetContext, skuFacetsStore)

  /* 
    Store subscriptions to trigger client-side repaint of <PdpDetails> sub-component$ 
    When user changes the sku, items in this store will be CSR (repainted on API call)
    All other properties will be SSR (not be repainted on API call)
  */
  const pdpCsrStore = useStore({
    slides: [],
    facetsColor: [],
    facetsSize: [],
  })

  /* Download pdp-details API */
  const pdpDetResource$ = useResource$(async ctx => {
    // the resource will rerun when bar.value changes.
    ctx.track(() => skuFacetsStore.pdpDetTrigger.value)
    ctx.cleanup(() => {
      // In case the resource need to be cleaned up, this function will be called.
      // Allowing to clean resources like timers, subscriptions, fetch requests, etc.
    })
    const start = Date.now()
    const apiProdRes = await fetch(skuFacetsStore.pdpDetTrigger.value, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Womp_AMP_Generator',
      },
    })
    const pdp = await apiProdRes.json()
    pdp.data.PRODUCT_DETAILS.fetchTime = Date.now() - start

    return pdp
  })

  return (
    <PdpDetails
      pdpData={pdpDetResource$}
      pdpCsrStore={pdpCsrStore}
      skuFacetsStore={skuFacetsStore}
    />
  )
})

interface PdpDetails {
  pdpData: any
  pdpCsrStore: any
  skuFacetsStore: SkuFacets
}
export const PdpDetails = component$(
  ({ pdpData, pdpCsrStore, skuFacetsStore }: PdpDetails) => {
    return (
      <Resource
        value={pdpData}
        onRejected={() => <div>Failed to load Prod List API</div>}
        onResolved={(pdp: any) => {
          // Decode HTML encoded properties
          // TODO - Is there a native Qwik or JSX way to do this?
          const pdpDet = pdp.data.PRODUCT_DETAILS
          decodeProps(pdpDet, ['DISPLAY_NAME'])

          pdpCsrStore.slides = pdp.data.PRODUCT_DETAILS.PRODUCT_IMG_ARRAY

          // Find appropriate facet arrays for MSWP products
          const facets = pdp.data.PRODUCT_DETAILS.facets
          if (facets) {
            const params = pdp.data.params

            if (facets.colors && facets.colors.length) {
              pdpCsrStore.facetsColor = facets.colors
              const colorParentFacet = facets.colors.filter(
                (facet: any) => facet.color == params.color,
              )[0]
              if (colorParentFacet)
                pdpCsrStore.facetsSize = colorParentFacet.sizes
            } else if (facets.sizes && facets.sizes.length) {
              pdpCsrStore.facetsSize = facets.sizes
            }
          }

          skuFacetsStore.skuDetails = pdp.data.SKU_DETAILS.map((sku: any) => ({
            SKU_SIZE: decode(sku.SKU_SIZE),
            COLOR: decode(sku.COLOR),
            SKU_ID: sku.SKU_ID,
          }))
          const pdpParams = pdp.data.params
          skuFacetsStore.color = decode(pdpParams.color)
          skuFacetsStore.size = decode(pdpParams.size)

          return (
            <>
              <h2>{pdpDet.DISPLAY_NAME}</h2>
              <div>API fetch time - {pdpDet.fetchTime / 1000} seconds</div>
              <ProdCarousel slides={pdpCsrStore.slides} />
              {pdpCsrStore.facetsColor ? (
                <Facets facets={pdpCsrStore.facetsColor} type='colors' />
              ) : (
                ''
              )}
              {pdpCsrStore.facetsSize ? (
                <Facets facets={pdpCsrStore.facetsSize} type='sizes' />
              ) : (
                ''
              )}
            </>
          )
        }}
      />
    )
  },
)
