import { component$, Resource, useSignal, useResource$ } from '@builder.io/qwik'
import { isServer } from '@builder.io/qwik/build'

import './footer.css'

/**
 * Render footer
 */
export default component$(() => {
  console.log('Rendering <Footer />')

  /**
   * Fetch Contentstack footer data
   * TODO - Error handling
   */
  const footerResource = useResource$(async () => {
    // Code treeshaking - Don't send this contentStack code to browser
    if (!isServer) return
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
    const data = await footerApiRes.json()
    data.entries[0].fetchTime = Date.now() - start
    return data.entries[0]
  })

  return (
    // Render on server after ContentStack data is fetched
    <Resource
      value={footerResource}
      // TODO
      onRejected={() => <div>© Bed Bath & Beyond</div>}
      onResolved={(footer: any) => {
        return <FooterWrap footer={footer} />
      }}
    />
  )
})

/**
 * Footer Section
 */
export const FooterWrap = component$(({ footer }) => {
  return (
    <div id='wm_footer' class='contVis'>
      <footer data-locator='footer' id='footer'>
        <div class='container flex wrap'>
          <FooterColumns columns={footer.footer_columns} />
          <div>Footer API fetch time - {footer.fetchTime / 1000} seconds</div>
        </div>
      </footer>
    </div>
  )
})

/**
 * Footer Desktop Columns
 */
export const FooterColumns = component$(({ columns }) => {
  return columns.map((column1: any, i: number) => (
    <div class='s12 d3 gpr3' key={i}>
      <FooterColumnRows rows={column1.columns} />
    </div>
  ))
})

/**
 * Footer Acccordion Rows
 */
export const FooterColumnRows = component$(({ rows }) => {
  return rows.map((section: any, i: number) => (
    <FooterAccordion section={section} key={i} />
  ))
})

/**
 * Footer Acccordion Component
 * Expands and Collapses on H3 click
 */
export const FooterAccordion = component$(({ section }) => {
  const columnId = section.footer_clolumn_name.replace(/ /g, '_')
  const alwaysExpanded = !!(
    section.footer_column_link[0].type && section.footer_column_link[0].type[0]
  )
  const isOpen = useSignal(alwaysExpanded)
  return (
    <div
      class={`s12 accWrap ${isOpen.value == true ? 'accExpanded' : ''}`}
      key={columnId}
    >
      {alwaysExpanded ? (
        <h3 class='vp125 flex ctr uppercase'>{section.footer_clolumn_name}</h3>
      ) : (
        <h3
          class='s12 vp125 flex ctr black pointer accLabel uppercase'
          aria-label={`Open ${section.footer_clolumn_name} accordion`}
          onClick$={() => (isOpen.value = !isOpen.value)}
        >
          <span>{section.footer_clolumn_name}</span>
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
        {section.footer_column_link.map((link: any, i: number) => {
          return <FooterLinkSort link={link} key={i} />
        })}
      </ul>
    </div>
  )
})

/**
 * Footer Link sorting.
 * Returns appropriate footer link component
 */
export const FooterLinkSort = component$(({ link }) => {
  if (link.type[0] == 'list-style-social')
    return <FooterLinkSocial link={link} />
  else if (link.type[0] == 'signup-email')
    return <FooterLinkEmail link={link} />
  else if (link.type[0] == 'list-style-download')
    return <FooterLinkDownload link={link} />
  else return <FooterLinkText link={link} />
})

/**
 * Footer social icons
 */
export const FooterLinkSocial = component$(({ link }) => {
  return (
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
  )
})

/**
 * Footer email capture form
 */
export const FooterLinkEmail = component$(() => {
  return <div>Bottom Dock Email</div>
})

/**
 * Footer app downloads
 */
export const FooterLinkDownload = component$(() => {
  return <div>Download Icon</div>
})

/**
 * Footer text links
 */
export const FooterLinkText = component$(({ link }) => {
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
})
