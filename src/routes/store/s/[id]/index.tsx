import {
  component$,
  Resource,
  useResource$,
  useSignal,
} from "@builder.io/qwik";
import { decode } from "html-entities";
// import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  // const loc = useLocation();

  const apiProdListHrefRacoons =
    "https://www.bedbathandbeyond.com/apis/services/composite/product-listing/v1.0/all?web3feo=1&site=BedBathUS&currencyCode=USD&country=US&rT=xtCompat&tz=420&displayAdsAt=6&q=racoons&wt=json&badge_ids=7464&url=%2Fstore%2Fs&noFacet=false&facets=%7B%7D&start=0&perPage=48&sws=&storeOnlyProducts=false&customPriceRange=false&__amp_source_origin=https%3A%2F%2Fwww.bedbathandbeyond.com";
  const apiProdListHrefKittens =
    "https://www.bedbathandbeyond.com/apis/services/composite/product-listing/v1.0/all?web3feo=1&site=BedBathUS&currencyCode=USD&country=US&rT=xtCompat&tz=420&displayAdsAt=6&q=kittens&wt=json&badge_ids=7464&url=%2Fstore%2Fs&noFacet=false&facets=%7B%7D&start=0&perPage=48&sws=&storeOnlyProducts=false&customPriceRange=false&__amp_source_origin=https%3A%2F%2Fwww.bedbathandbeyond.com";

  const apiProdListTrigger = useSignal(apiProdListHrefRacoons);
  const prodListApiMs = useSignal(0);

  const apiProdListResource = useResource$(async (ctx) => {
    // the resource will rerun when bar.value changes.
    ctx.track(() => apiProdListTrigger.value);
    ctx.cleanup(() => {
      // In case the resource need to be cleaned up, this function will be called.
      // Allowing to clean resources like timers, subscriptions, fetch requests, etc.
    });
    const start = Date.now();
    const prodListApiRes = await fetch(apiProdListTrigger.value, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Womp_AMP_Generator",
      },
    });
    const prodListApi = await prodListApiRes.json();
    prodListApiMs.value = Date.now() - start;
    return prodListApi;
  });

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
              <div>API fetch time - {prodListApiMs.value / 1000} seconds</div>
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
                // Decode HTML encoded properties
                // TODO - Is there a native Qwik or JSX way to do this?
                ["DISPLAY_NAME"].forEach(
                  (prop) => (p[prop] = decode(p[prop], { level: "html5" }))
                );
                // p is a product object
                return (
                  <a href={`/store${p.url}`} id={p.PRODUCT_ID}>
                    <div>{p.DISPLAY_NAME}</div>
                    <img
                      alt={p.DISPLAY_NAME}
                      class="contain absolute fill prodCardImg noLoader"
                      data-alt-img-src-id={p.altImages && p.altImages[0]}
                      data-img-src-id={p.scene7imageID}
                      data-layout="responsive"
                      data-prod-id={p.PRODUCT_ID}
                      fetchpriority={i == 0 ? "high" : "low"}
                      height="119"
                      loading={i == 0 ? "eager" : "lazy"}
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

