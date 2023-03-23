import { component$, Resource, useResource$, useSignal } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import { decode } from 'html-entities'

export const skuByColorSize = (
  pdpData: any,
  color: string | null,
  size: string | null,
) => {
  const skuDetails = pdpData.SKU_DETAILS

  const skuMatch = skuDetails.filter((sku: any) => {
    return color && size
      ? sku.SKU_SIZE == size && sku.COLOR == color
      : color
      ? sku.COLOR == color
      : sku.SKU_SIZE == size
  })
  return skuMatch[0]
}

export default component$(() => {
  const loc = useLocation()

  const apiPdpHrefBase =
    'https://www.bedbathandbeyond.com/apis/services/composite/v1.0/pdp-details/'

  const pdpDetTrigger = useSignal(
    `${apiPdpHrefBase}${loc.params.prodId}?web3feo=1&siteId=BedBathUS&allSkus=true&ssr=true&skuId=${loc.params.skuId}`,
  )

  const pdpDetResource = useResource$(async ctx => {
    // the resource will rerun when bar.value changes.
    ctx.track(() => pdpDetTrigger.value)
    ctx.cleanup(() => {
      // In case the resource need to be cleaned up, this function will be called.
      // Allowing to clean resources like timers, subscriptions, fetch requests, etc.
    })
    const start = Date.now()
    const apiProdRes = await fetch(pdpDetTrigger.value, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Womp_AMP_Generator',
      },
    })
    const pdpDet = await apiProdRes.json()
    pdpDet.data.PRODUCT_DETAILS.fetchTime = Date.now() - start
    return pdpDet
  })

  return (
    <>
      <Resource
        value={pdpDetResource}
        onRejected={() => <div>Failed to load Prod List API</div>}
        onResolved={(pdp: any) => {
          const pdpDet = pdp.data.PRODUCT_DETAILS

          // Decode HTML encoded properties
          // TODO - Is there a native Qwik or JSX way to do this?
          ;['DISPLAY_NAME'].forEach(
            prop => (pdpDet[prop] = decode(pdpDet[prop], { level: 'html5' })),
          )

          // Get skuId from  SSR 'loc' object or from page location after pushState
          const skuId =
            typeof location === 'undefined'
              ? loc.params.skuId // SSR - location doesn't exist
              : new URL(location.href).searchParams.get('skuId') // client side after url update on sku facet selection

          // Active sku object
          const activeSku = skuId
            ? pdp.data.SKU_DETAILS.filter((sku: any) => sku.SKU_ID == skuId)[0]
            : pdp.data.PRODUCT_DETAILS

          return (
            <>
              <h2>{pdpDet.DISPLAY_NAME}</h2>
              <div>API fetch time - {pdpDet.fetchTime / 1000} seconds</div>
              {activeSku.PRODUCT_IMG_ARRAY &&
                activeSku.PRODUCT_IMG_ARRAY.slice(0, 1).map(
                  (imgData: any, i: number) => {
                    // p is a product object
                    // TODO: figure out how to add fetchpriority property to an HTMLImageElment type
                    // and turn package.json > build.types tsc script back on
                    return (
                      <img
                        alt={`${imgData.description}. View a larger version of this product image.`}
                        class='midCtr contain'
                        fetchpriority={i == 0 ? 'high' : 'low'}
                        height='380'
                        key={imgData.imageId}
                        loading={i == 0 ? 'eager' : 'lazy'}
                        noloading
                        src={`https://b3h2.scene7.com/is/image/BedBathandBeyond/${imgData.imageId}?$380$&wid=380&hei=380`}
                        srcset={`
                          https://b3h2.scene7.com/is/image/BedBathandBeyond/${imgData.imageId}?$380$&wid=380&hei=380 379w, 
                          https://b3h2.scene7.com/is/image/BedBathandBeyond/${imgData.imageId}?$713$&wid=713&hei=713 500w
                        `}
                        width='380'
                      />
                    )
                  },
                )}
              <div class='flex mid'>
                {(() => {
                  const sizes = pdpDet.facets.sizes
                  if (sizes && sizes.length > 1)
                    return sizes.map((facet: any, i: number) => (
                      <button
                        class='gr05 btn btnPrimary'
                        key={i}
                        onClick$={() => {
                          const facetSku = skuByColorSize(
                            pdp.data,
                            facet.color,
                            facet.size,
                          )
                          const skuId = facetSku.SKU_ID
                          const skuUrl = new URL(location.href)
                          skuUrl.searchParams.set('skuId', skuId)
                          history.replaceState(null, '', skuUrl.href)
                          pdpDetTrigger.value = `${apiPdpHrefBase}${loc.params.prodId}?web3feo=1&siteId=BedBathUS&allSkus=true&ssr=true&skuId=${skuId}`
                        }}
                      >
                        {facet.size}
                      </button>
                    ))
                })()}
              </div>
              <div class='flex mid'>
                {(() => {
                  const colors = pdpDet.facets.colors
                  if (colors && colors.length > 1)
                    return colors.map((facet: any, i: number) => {
                      return (
                        <button
                          class='gr05 btn btnPrimary'
                          key={i}
                          onClick$={() => {
                            const facetSku = skuByColorSize(
                              pdp.data,
                              facet.color,
                              facet.size,
                            )
                            const skuId = facetSku.SKU_ID
                            const skuUrl = new URL(location.href)
                            skuUrl.searchParams.set('skuId', skuId)
                            history.pushState(null, '', skuUrl.href)
                            pdpDetTrigger.value = `${apiPdpHrefBase}${loc.params.prodId}?web3feo=1&siteId=BedBathUS&allSkus=true&ssr=true&skuId=${skuId}`
                          }}
                        >
                          {facet.color}
                        </button>
                      )
                    })
                })()}
              </div>
            </>
          )
        }}
      />
    </>
  )
})
