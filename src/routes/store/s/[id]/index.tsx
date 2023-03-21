import {
  component$,
  Resource,
  useResource$,
  useSignal,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const apiProdListHrefRacoons =
    "https://www.bedbathandbeyond.com/apis/services/composite/product-listing/v1.0/all?web3feo=1&site=BedBathUS&currencyCode=USD&country=US&rT=xtCompat&tz=420&displayAdsAt=6&web3feo=abc&q=racoons&wt=json&badge_ids=7464&url=%2Fstore%2Fs&noFacet=false&facets=%7B%7D&start=0&perPage=48&sws=&storeOnlyProducts=false&customPriceRange=false&__amp_source_origin=https%3A%2F%2Fwww.bedbathandbeyond.com";
  const apiProdListHrefKittens =
    "https://www.bedbathandbeyond.com/apis/services/composite/product-listing/v1.0/all?web3feo=1&site=BedBathUS&currencyCode=USD&country=US&rT=xtCompat&tz=420&displayAdsAt=6&web3feo=abc&q=kittens&wt=json&badge_ids=7464&url=%2Fstore%2Fs&noFacet=false&facets=%7B%7D&start=0&perPage=48&sws=&storeOnlyProducts=false&customPriceRange=false&__amp_source_origin=https%3A%2F%2Fwww.bedbathandbeyond.com";
  const apiProdListTrigger = useSignal(apiProdListHrefRacoons);

  const apiProdListResource = useResource$(async (ctx) => {
    // the resource will rerun when bar.value changes.
    ctx.track(() => apiProdListTrigger.value);
    ctx.cleanup(() => {
      // In case the resource need to be cleaned up, this function will be called.
      // Allowing to clean resources like timers, subscriptions, fetch requests, etc.
    });

    const prodListApiRes = await fetch(apiProdListTrigger.value, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Womp_AMP_Generator",
      },
    });

    const prodListApi = await prodListApiRes.json();
    return prodListApi;
  });

  const loc = useLocation();
  return (
    <>
      <Resource
        value={apiProdListResource}
        onPending={() => <div>Loading...</div>}
        onRejected={() => <div>Failed to load Prod List API</div>}
        onResolved={(list: any) => {
          return (
            <>
              <h2>{list.fusion.q}</h2>
              <button
                onClick$={() =>
                  (apiProdListTrigger.value =
                    apiProdListTrigger.value == apiProdListHrefRacoons
                      ? apiProdListHrefKittens
                      : apiProdListHrefRacoons)
                }
              >
                Toggle Results
              </button>
              {list.response.docs.map((p: any, i: number) => {
                // p is a product object
                return (
                  <a href={`/store${p.url}`} id={p.PRODUCT_ID}>
                    <div>{p.DISPLAY_NAME}</div>
                    <img
                      alt={p.DISPLAY_NAME}
                      class="contain absolute fill prodCardImg noLoader"
                      data-alt-img-src-id={p.altImages && p.altImages[0]}
                      data-img-src-id={p.scene7imageID}
                      data-prod-id={p.PRODUCT_ID}
                      data-layout="responsive"
                      height="119"
                      src={`https://b3h2.scene7.com/is/image/BedBathandBeyond/${p.scene7imageID}?$imagePLP$&amp;wid=177&amp;hei=177`}
                      srcSet={`
												https://b3h2.scene7.com/is/image/BedBathandBeyond/${p.scene7imageID}?$imagePLP$&amp;wid=177&amp;hei=177 177w,
												https://b3h2.scene7.com/is/image/BedBathandBeyond/${p.scene7imageID}?$imagePLP$&amp;wid=236&amp;hei=236 236w,
												https://b3h2.scene7.com/is/image/BedBathandBeyond/${p.scene7imageID}?$imagePLP$&amp;wid=363&amp;hei=363 363w
                      `}
                      width="119"
                    />
                  </a>
                );
              })}
            </>
          );
        }}
      />
    </>
  );
});

export const Clock = component$(() => {
  return <div>Clock</div>;
});

