import { component$, Resource, useSignal, useResource$ } from '@builder.io/qwik'

import './footer.css'

export default component$(() => {
  const footerApiFetchTime = useSignal(0)

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
            <div id='wm_footer' class='contVis'>
              <footer data-locator='footer' id='footer'>
                <div>
                  Footer API fetch time - {footerApiFetchTime.value / 1000}{' '}
                  seconds
                </div>
                <div class='container flex wrap borderTop'>
                  {footer.footer_columns.map((column1: any) => (
                    <div class='s12 d3 gpr3'>
                      {column1.columns.map((column2: any) => (
                        <div class='s12 gr1'>
                          {column2.footer_clolumn_name ? (
                            column2.accordion ? (
                              <h3
                                class='s12 vp125 flex ctr black pointer accLabel uppercase'
                                on='tap:AMP.setState({u: { {_metadata.uid}: !u.{_metadata.uid} })'
                                tabindex='0'
                                role='button'
                                aria-label='Open {footer_clolumn_name} accordion'
                              >
                                {column2.footer_clolumn_name}
                                <svg class='wi175em wiChev dHide'>
                                  <use
                                    xmlns:xlink='http://www.w3.org/1999/xlink'
                                    xlink:href='#chevron-down'
                                  ></use>
                                </svg>
                              </h3>
                            ) : (
                              <h3 class='vp125 flex ctr uppercase'>
                                {column2.footer_clolumn_name}
                              </h3>
                            )
                          ) : (
                            ''
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </footer>
            </div>
          )
        }}
      />
    </>
  )
})
