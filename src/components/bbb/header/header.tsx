import { component$, useSignal, useStore, useStyles$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import { spaceCase } from '~/sitewide/utility'

import headerCss from './header.css?inline'
import headerDesktopCss from './header-desktop.css?inline'

import { Sayt } from './sayt/sayt'
import { Nav } from './nav/nav'

export interface ModalsStore {
  navActive: boolean
  searchActive: boolean
}

export default component$(() => {
  useStyles$(headerCss)
  useStyles$(headerDesktopCss)

  /* Search Term */
  const serverLoc = useLocation()
  const searchTermVal = spaceCase(serverLoc.params.searchTerm || '')
  const searchTerm = useSignal(searchTermVal)

  /* Modals Store - Later: transfer to context */
  const u = useStore<ModalsStore>({
    navActive: false,
    searchActive: false,
  })

  return (
    <>
      <header
        // class={`'s12 fixedheader fixed' + (navState.isCatNav ? ' catNav' : '')`}
        class='s12 fixedheader fixed'
        data-modal-close
        id='headerWrap'
        data-header-v2='true'
      >
        <div
          id='header'
          class='s12 midJust header headerRow1'
          data-test='HomeBurgerMenu'
        >
          <button
            class='headerBtn midCtr menuBurger'
            data-test='openMenu'
            aria-label='Open Menu'
            data-modal-open
            data-modal-close
            onClick$={() => (u.navActive = true)}
            // on="tap:AMP.setState(
            //   {
            //   u: {

            //     nav: 'active'
            //   },
            //   changeStore: { csModal: false },
            //   navState: { isAccount: false,
            //     activeDskNav: '',
            //     isCatNav: false,
            //     nav1Header:'',
            //     nav1Obj: navV2Data.entriesdata-amp-bind-0.top_navigation,
            //     nav2Header:'',
            //     nav2Obj: null,
            //   }
            // }),navWrap.focus"
          >
            <svg class='wi wiMenu noTap'>
              <use
                xmlns:xlink='http://www.w3.org/1999/xlink'
                xlink:href='#wiMenu'
              />
            </svg>
          </button>
          <a
            id='logo'
            href='/'
            aria-label='Navigate To Home Page'
            class='midCtr logo white'
            data-vars-link='https://www.bedbathandbeyond.com/'
          >
            <svg class='wi noTap currColor'>
              <use xlink:href='#BBBlogo' />
            </svg>
          </a>
          <div class='gl1 grow1 parent searchCont'>
            <label
              class={`gp0 midCtr whiteBg black ellipsis searchInput ${
                searchTerm ? ' active ' : ''
              }`}
              for='searchInput'
              id='searchlabel'
              onClick$={() => {
                u.searchActive = true
                const searchInput = document.getElementById('searchInput')
                if (searchInput) searchInput.focus()
              }}
              role='button'
              tabIndex={0}
            >
              <svg class='wi175em currColor sHide'>
                <use
                  xmlns:xlink='http://www.w3.org/1999/xlink'
                  xlink:href='#dskSearchIcon'
                />
              </svg>
              <div
                data-amp-bind-text="searchTerm ? searchTerm : 'Search'"
                class='tHide dHide txt0875'
              >
                Search
              </div>
              <div
                data-amp-bind-text="searchTerm ? searchTerm : 'What product can we help you find?'"
                class='sHide'
                data-search-placeholder-tablet
              >
                What product can we help you find?
              </div>
            </label>
            <Sayt u={u} searchTerm={searchTerm} />
          </div>
          <div class='wHide dwPreload dwShow parent dskAcctCont'>
            <div
              class='acct modal wHide fixed'
              aria-label='Close sign in modal'
              role='button'
              tabIndex={0}
              // class={`'acct modal wHide fixed' + (u.signInNav == true ? ' active' : '')`}
              // on='tap:AMP.setState({
              //   u: {
              //     signInNav: false
              //   }
              // })'
            />
            <a
              class='headerBtn midCtr headerAccount'
              href='https://www.bedbathandbeyond.com/store/account/Login'
              id='accountlinkDskWide'
              data-interact='mouseenter'
              data-state='{ "u": { "nav":"", "signInNav": "", "search": null }, "changeStore": { "csModal": false }, "navState":{ "isCatNav":false } }'
              data-vars-link='/store/account/Login'
            >
              <p class='accountTxt'>sign in</p>
              <svg aria-hidden='true' class='wi wiAccount'>
                <use
                  xmlns:xlink='http://www.w3.org/1999/xlink'
                  xlink:href='#wiAccount'
                />
              </svg>
            </a>
            <amp-list
              class={`'dskAccountNav noLoader dwPreload dwShow ' + (u.signInNav ? 'active ' : ' ' ) + (user.data.userFirstName ? 'hasAcct ' : ' ' ) `}
              binding='always'
              class='dskAccountNav noLoader dwPreload dwShow '
              data-postrender-handler='loyalty.accountListPostRender()'
              height='440px'
              id='accountV2DskList'
              items='.'
              layout='fixed'
              single-item
              src='amp-state:user'
              data-amp-bind-src='user'
              template='accountV2Template'
              width='260px'
              tabIndex={-1}
            >
              <div placeholder>
                <div class='midCtr absolute fill loadOverlay'>
                  <div class='loadGroup'>
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
              </div>
            </amp-list>
          </div>
          <div class='cartContainer'>
            <a
              href='https://www.bedbathandbeyond.com/store/cart'
              id='cartlink'
              aria-label='Shopping Cart'
              class='headerBtn midCtr parent headerCart'
              data-vars-link='https://www.bedbathandbeyond.com/store/cart'
            >
              <svg aria-hidden='true' class='wi wiCart'>
                <use
                  xmlns:xlink='http://www.w3.org/1999/xlink'
                  xlink:href='#shopping-cart'
                />
              </svg>
              <amp-list
                id='cartCount'
                class='absolute cartCountList'
                credentials='include'
                data-postrender-handler='user.cartCountListPostRender()'
                src='https://www.bedbathandbeyond.com/apis/services/composite/v1.0/amp-user-info?pageType=SEARCH'
                data-amp-bind-src='user'
                layout='fixed'
                height={20}
                width={20}
                binding='always'
                items='.'
                single-item
              ></amp-list>
            </a>
          </div>
          <amp-list
            binding='refresh'
            class='variableAmpList'
            data-feature='siteNavV2'
            data-nav-mouseleave
            data-postrender-handler='site.navCatListPostRender()'
            data-ssr='navV2DataSsr'
            id='navCategoriesBar'
            items='entries'
            layout='fixed-height'
            height={48}
            noloading
            src='amp-state:navV2Data'
            template='categoryNavTemplate'
          >
            <div placeholder />
          </amp-list>
        </div>
      </header>
      <Nav u={u} />
    </>
  )
})
