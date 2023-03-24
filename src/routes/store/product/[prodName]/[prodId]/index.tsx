import {
  component$,
  createContextId,
  Resource,
  useContext,
  useContextProvider,
  useResource$,
  useSignal,
  useStore,
} from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import { encode, decode } from 'html-entities'
import { decodeProps } from '../../../../../sitewide/utility'

export const skuByColorSize = (
  pdp: any,
  color: string | null,
  size: string | null,
) => {
  const skuDetails = pdp.data.SKU_DETAILS

  const skuMatch = skuDetails.filter((sku: any) => {
    return color && size
      ? sku.SKU_SIZE == size && sku.COLOR == color
      : color
      ? sku.COLOR == color
      : sku.SKU_SIZE == size
  })
  return skuMatch[0]
}

const apiPdpHrefBase =
  'https://www.bedbathandbeyond.com/apis/services/composite/v1.0/pdp-details/'

export const facetUpdate = (skuFacets, color: string, size: string) => {
  if (color) skuFacets.color = encode(color)
  if (size) skuFacets.size = encode(size)
  const facetSku = skuByColorSize(
    skuFacets.pdpDet,
    skuFacets.color,
    skuFacets.size,
  )

  if (!facetSku) return
  const skuId = facetSku.SKU_ID
  const skuUrl = new URL(location.href)
  skuUrl.searchParams.set('skuId', skuId)
  history.replaceState(null, '', skuUrl.href)
  skuFacets.pdpDetTrigger.value = `${apiPdpHrefBase}${skuFacets.prodId}?web3feo=1&siteId=BedBathUS&allSkus=true&ssr=true&skuId=${skuId}&__amp_source_origin=https%3A%2F%2Fwww.bedbathandbeyond.com`
}

// Create a new context descriptor
export const skuFacetContext = createContextId('skuFacetContext')

export default component$(() => {
  const loc = useLocation()
  console.log('hi')

  const pdpDetTriggerValue = `${apiPdpHrefBase}${loc.params.prodId}?&siteId=BedBathUS&skuId=${loc.params.skuId}&color=&size=&bopisStoreId=&pickup=&sdd=&tz=420&allSkus=true&ssr=true&__amp_source_origin=https%3A%2F%2Fwww.bedbathandbeyond.com`,
  console.log(pdpDetTriggerValue)
  const skuFacets = useStore({
    color: null,
    size: null,
    prodId: loc.params.prodId,
    skuId: null,
    pdpDetTrigger: useSignal(
      `${apiPdpHrefBase}${loc.params.prodId}?&siteId=BedBathUS&skuId=${loc.params.skuId}&color=&size=&bopisStoreId=&pickup=&sdd=&tz=420&allSkus=true&ssr=true&__amp_source_origin=https%3A%2F%2Fwww.bedbathandbeyond.com`,
    ),
    pdpDet: null,
  })

  // Assigning value (state) to the context (ThemeContext)
  useContextProvider(skuFacetContext, skuFacets)

  const pdpDetResource = useResource$(async ctx => {
    // the resource will rerun when bar.value changes.
    ctx.track(() => skuFacets.pdpDetTrigger.value)
    ctx.cleanup(() => {
      // In case the resource need to be cleaned up, this function will be called.
      // Allowing to clean resources like timers, subscriptions, fetch requests, etc.
    })
    const start = Date.now()
    const apiProdRes = await fetch(skuFacets.pdpDetTrigger.value, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Womp_AMP_Generator',
      },
    })
    const pdpDet = await apiProdRes.json()
    pdpDet.data.PRODUCT_DETAILS.fetchTime = Date.now() - start
    skuFacets.pdpDet = pdpDet
    const pdpParams = pdpDet.data.params
    skuFacets.color = pdpParams.color
    skuFacets.size = pdpParams.size
    return pdpDet
  })

  return (
    <>
      <Resource
        value={pdpDetResource}
        onRejected={() => <div>Failed to load Prod List API</div>}
        onResolved={(pdp: any) => {
          // Decode HTML encoded properties
          // TODO - Is there a native Qwik or JSX way to do this?
          const pdpDet = pdp.data.PRODUCT_DETAILS
          decodeProps(pdpDet, ['DISPLAY_NAME'])

          // Get skuId from  SSR 'loc' object or from page location after pushState
          const skuId =
            typeof location === 'undefined'
              ? loc.params.skuId // SSR - location doesn't exist
              : new URL(location.href).searchParams.get('skuId') // client side after url update on sku facet selection

          // Active sku object
          const activeSku = skuId
            ? pdp.data.SKU_DETAILS.filter((sku: any) => sku.SKU_ID == skuId)[0]
            : pdp.data.PRODUCT_DETAILS

          let colorFacets
          let sizeFacets
          const facets = pdp.data.PRODUCT_DETAILS.facets

          if (facets) {
            const params = pdp.data.params

            if (facets.colors && facets.colors.length) {
              colorFacets = facets.colors.filter(
                facet => facet.color == params.color,
              )
              sizeFacets = colorFacets.sizes
            } else if (facets.sizes && facets.sizes.length) {
              sizeFacets = facets.sizes.filter(
                facet => facet.size == params.size,
              )
            }
          }

          return (
            <>
              <h2>{pdpDet.DISPLAY_NAME}</h2>
              <div>API fetch time - {pdpDet.fetchTime / 1000} seconds</div>
              <ProdCarousel slides={activeSku.PRODUCT_IMG_ARRAY} />
              {colorFacets ? <Facets facets={colorFacets} type='colors' /> : ''}
              {sizeFacets ? <Facets facets={sizeFacets} type='sizes' /> : ''}
            </>
          )
        }}
      />
    </>
  )
})

export const Facets = component$(({ facets, type }) => {
  const facetArr = facets
  const isColor = type == 'colors'
  if (!facetArr || facetArr.length <= 1) return
  return (
    <div class='flex mid'>
      {facetArr.map((facet: any, i: number) =>
        isColor ? (
          <FacetColor facet={facet} i={i} />
        ) : (
          <FacetSize facet={facet} i={i} />
        ),
      )}
    </div>
  )
})

export const FacetColor = component$(({ facet, i }) => {
  const skuFacets = useContext(skuFacetContext)
  decodeProps(facet, ['color'])
  return (
    <button
      class='gr05 btn btnPrimary'
      key={i}
      onClick$={() => facetUpdate(skuFacets, facet.color, facet.size)}
    >
      {facet.color}
    </button>
  )
})
export const FacetSize = component$(({ facet, i }) => {
  const skuFacets = useContext(skuFacetContext)
  decodeProps(facet, ['size'])
  return (
    <button
      class='gr05 btn btnPrimary'
      key={i}
      onClick$={() => facetUpdate(skuFacets, facet.color, facet.size)}
    >
      {facet.size}
    </button>
  )
})

/**
 * Image and Video Carousel / modal with thumbnails
 */
export const ProdCarousel = component$(({ slides }) => {
  if (!slides) return ''
  return (
    slides
      // .slice(0, 1)
      .map((slide: any, i: number) => <Slide slide={slide} i={i} />)
  )
})

/**
 * Image or video slide
 */
export const Slide = component$(({ slide, i }) => {
  // TODO: figure out how to add fetchpriority property to an HTMLImageElment type
  // and turn package.json > build.types tsc script back on
  return (
    <img
      alt={`${slide.description}. View a larger version of this product image.`}
      class='midCtr contain'
      fetchpriority={i == 0 ? 'high' : 'low'}
      height='380'
      key={slide.imageId}
      loading={i == 0 ? 'eager' : 'lazy'}
      noloading
      src={`https://b3h2.scene7.com/is/image/BedBathandBeyond/${slide.imageId}?$380$&wid=380&hei=380`}
      srcset={`
        https://b3h2.scene7.com/is/image/BedBathandBeyond/${slide.imageId}?$380$&wid=380&hei=380 379w, 
        https://b3h2.scene7.com/is/image/BedBathandBeyond/${slide.imageId}?$713$&wid=713&hei=713 500w
      `}
      width='380'
    />
  )
})
