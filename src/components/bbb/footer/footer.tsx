import {
  component$,
  Resource,
  useSignal,
  useResource$,
  useStore,
} from '@builder.io/qwik'

import './footer.css'

export default component$(() => {
  const footerApiFetchTime = useSignal(0)
  const openFooterAccordions: any = useStore({})

  const footerResource = useResource$(async () => {
    console.log('Rendering <Footer />')
    const start = Date.now()
    const footerApiRes = await fetch(
      'https://cdn.contentstack.io/v3/content_types/footer/entries?&environment=production',
      {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Womp_AMP_Generator',
          access_token: 'cs6bd528ea3aa8005a38cde779',
          api_key: 'blt80ad4fd92b1dd026',
        },
      },
    )
    footerApiFetchTime.value = Date.now() - start
    const data = await footerApiRes.json()
    return data.entries[0]
  })

  return (
    <>
      <Resource
        value={footerResource}
        onRejected={() => <div>Failed to load Prod List API</div>}
        onResolved={(footer: any) => {
          return (
            <>
              <div>
                Footer API fetch time - {footerApiFetchTime.value / 1000}{' '}
                seconds
              </div>
              <div id='wm_footer' class='contVis'>
                <footer data-locator='footer' id='footer'>
                  <div class='container flex wrap'>
                    {footer.footer_columns.map((column1: any, i: number) => (
                      <div class='s12 d3 gpr3' key={i}>
                        {column1.columns.map((column2: any, j: number) => {
                          const alwaysExpanded =
                            column2.footer_column_link[0].type &&
                            column2.footer_column_link[0].type[0]
                          const columnId = column2.footer_clolumn_name.replace(
                            / /g,
                            '_',
                          )
                          return (
                            <div
                              class={`s12 accWrap ${
                                openFooterAccordions[columnId]
                                  ? 'accExpanded'
                                  : ''
                              }`}
                              onClick$={() => {
                                openFooterAccordions[columnId] =
                                  !openFooterAccordions[columnId]
                              }}
                              key={columnId}
                            >
                              {alwaysExpanded ? (
                                <h3 class='vp125 flex ctr uppercase'>
                                  {column2.footer_clolumn_name}
                                </h3>
                              ) : (
                                <h3
                                  id={`footerCol${i}-${j}`}
                                  class='s12 vp125 flex ctr black pointer accLabel uppercase'
                                  aria-label={`Open ${column2.footer_clolumn_name} accordion`}
                                >
                                  <span>{column2.footer_clolumn_name}</span>

                                  <svg class='wi175em wiChev dHide'>
                                    <use
                                      xmlns:xlink='http://www.w3.org/1999/xlink'
                                      xlink:href='#chevron-down'
                                    ></use>
                                  </svg>
                                </h3>
                              )}
                              <ul
                                class={`g0 gp0 v0 vp0 footerAcc {{colClass}} ${
                                  alwaysExpanded ? '' : 'wHide accPanel21'
                                }
                                `}
                              >
                                {column2.footer_column_link.map((link: any) => {
                                  if (link.type[0] == 'list-style-social') {
                                    return (
                                      <>
                                        <li>
                                          <a
                                            href={link.cta.href}
                                            class='linkBlk block v075 socialFooterLink'
                                            title={link.cta.title}
                                            aria-label={link.cta.title}
                                            target={link.target}
                                          >
                                            {link.cta.title}
                                          </a>
                                        </li>
                                      </>
                                    )
                                  } else if (link.type[0] == 'signup-email') {
                                    return <div>Bottom Dock Email</div>
                                  } else if (
                                    link.type[0] == 'list-style-download'
                                  ) {
                                    return <div>Download Icon</div>
                                  } else {
                                    return (
                                      <li class='vp075 dskVp0 footerAccItem'>
                                        <a
                                          href={link.cta.href}
                                          class='linkBlk block v075 footerAccLink'
                                          target={link.target}
                                        >
                                          {link.cta.title}
                                        </a>
                                      </li>
                                    )
                                  }
                                })}
                              </ul>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </footer>
              </div>
            </>
          )
        }}
      />
    </>
  )
})
