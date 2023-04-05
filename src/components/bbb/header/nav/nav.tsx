import {
  component$,
  useStore,
  useStyles$,
  useVisibleTask$,
} from '@builder.io/qwik'
import type { ModalsStore } from '../header'
import { NavL1 } from './navL1'
import navCss from './nav.css?inline'

const NAV_API =
  'https://www.bedbathandbeyond.com/api/cms/v3/content_types/navigation/entries?include%5B%5D=top_navigation.columns.set&include%5B%5D=categories.columns.set&include%5B%5D=my_account_logged_in.columns.set&include%5B%5D=pencil_banner&include%5B%5D=pencil_banner_timer&__amp_source_origin=https%3A%2F%2Fwww.bedbathandbeyond.com'

interface Nav {
  u: ModalsStore
}

export interface NavStore {
  accountActive: boolean
  l1Active: boolean
  l2IdActive: string | null
  navApi: any | null
  navApiAccount: any | null
  navApiL1: [] | null
  navApiL2: any | null
}
export const Nav = component$<Nav>(({ u }) => {
  useStyles$(navCss)
  const navStore = useStore<NavStore>(
    {
      accountActive: false,
      l1Active: false,
      l2IdActive: null,
      navApi: null,
      navApiAccount: null,
      navApiL1: null,
      navApiL2: null,
    },
    { deep: true },
  )

  useVisibleTask$(async ({ track }) => {
    track(() => u.navActive)

    // Get nav data client side only when menu is opened
    if (!navStore.navApi) {
      const navApiRes = await fetch(NAV_API)
      const navApiData = await navApiRes.json()
      navStore.navApi = navApiData.entries[0]
    }

    // Set L1 pointer
    if (!navStore.navApiL1) {
      navStore.navApiL1 = navStore.navApi.top_navigation
      navStore.l1Active = true
    }
  })

  console.log('rendering <Nav />')
  return (
    <nav
      id='navWrap'
      class={
        'navWrap whiteBg wHide absolute ' +
        // (navState.isCatNav ? 'catNav ' : ' ') +
        // (navState.isTopNav ? 'topNav ' : ' ') +
        (u.navActive ? ' active' : ' ')
      }
    >
      <NavL1 u={u} navStore={navStore} />
    </nav>
  )
})
