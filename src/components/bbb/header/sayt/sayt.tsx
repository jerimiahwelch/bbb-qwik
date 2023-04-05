import { component$, useStyles$ } from '@builder.io/qwik'
import type { Signal } from '@builder.io/qwik'
import { useNavigate } from '@builder.io/qwik-city'
import { dashLowerCase } from '~/sitewide/utility'
import type { ModalsStore } from '../header'

import saytCss from './sayt.css?inline'

interface Sayt {
  u: ModalsStore
  searchTerm: Signal
}

export const Sayt = component$<Sayt>(({ u, searchTerm }) => {
  useStyles$(saytCss)

  /* Custom URL on search form submission */
  const nav = useNavigate()
  return (
    <div id='searchcontainer' class={u.searchActive ? 'active' : ''}>
      <form
        action='/store/s/'
        class='flex mid parent'
        custom-validation-reporting='show-all-on-submit'
        data-pwa-handler='recentSearchFormHandler'
        id='mainSearch'
        onSubmit$={() => {
          u.searchActive = false
          nav(`/store/s/${dashLowerCase(searchTerm.value)}`)
        }}
        preventdefault:submit
        on="
          submit:AMP.setState({
            'searching': true
          })
          ;invalid:AMP.setState({ 
            u: {
              search: null
            } 
          })"
        target='_top'
      >
        <div class='gl1 parent grow1 searchInputWrap'>
          <input
            aria-label='Search'
            aria-owns='searchSuggestions'
            autoComplete='off'
            class='s12 whiteBg searchInput'
            data-locator='searchbar'
            id='searchInput'
            name='searchInput'
            onFocus$={evt => {
              const input = evt.target
              input.focus()
              input.selectionStart = input.selectionEnd = input.value.length
              u.navActive = false
            }}
            on="
              input-debounced:AMP.setState({'
                searchTerm': event.value
              })
              ;tap:AMP.setState({
                u: {
                  nav: null
                }, 
                navState: {
                  activeDskNav: null, 
                  nav1Header: null, 
                  nav1Obj: null, 
                  flyoutMenu: null
                }
              })
            "
            onInput$={evt => {
              searchTerm.value = (evt.target as HTMLInputElement).value
            }}
            value={searchTerm.value}
            required
            spellCheck='false'
            tabIndex={-1}
            type='search'
            defaultValue
          />
          <button
            type='button'
            class='midCtr absolute black searchInputClear'
            aria-label='Clear Search'
            tabIndex={0}
            on="tap:AMP.setState({
              searchTerm: ''
            }),mainSearch.clear()"
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height={8}
              width={8}
              viewBox='0 0 10.49 10.48'
              id='close'
            >
              <g data-name='Layer 2'>
                <path
                  fill='currentColor'
                  d='M5.24 3.83L8.78.29a1 1 0 111.41 1.41L6.66 5.24l3.54 3.54a1 1 0 11-1.41 1.41L5.24 6.66l-3.53 3.53A1 1 0 01.29 8.78l3.54-3.54L.29 1.71A1 1 0 011.71.29z'
                  data-name='Layer 1'
                />
              </g>
            </svg>
          </button>
        </div>
        <label
          data-amp-bind-hidden="u.search!='active'"
          aria-label='Clear Search'
          class='midCtr headerBtn search clear parent searchClose'
          data-modal-close
          for='searchcb'
          hidden
          onClick$={() => (u.searchActive = false)}
          on="tap:AMP.setState({
            u: {
              search: null
            }, searchTerm: '' 
          }),mainSearch.clear()"
          role='button'
          tabIndex={0}
        >
          <svg class='wi175em noTap' aria-hidden='true'>
            <use
              xmlns:xlink='http://www.w3.org/1999/xlink'
              xlink:href='#menu-close'
            />
          </svg>
        </label>
        <button
          type='submit'
          aria-label='submit search'
          class='gr05 sHide searchSubmit'
          tabIndex={0}
          on='tap:AMP.setState({ 
            u: { 
              search: null 
            }
          })'
          hidden={!searchTerm}
        >
          <svg class='wi175em currColor' aria-hidden='true'>
            <use
              xmlns:xlink='http://www.w3.org/1999/xlink'
              xlink:href='#dskSearchIcon'
            />
          </svg>
        </button>
      </form>
      <div class='parent'>
        <amp-list
          class='variableAmpList'
          data-amp-bind-hidden='searchTerm.length >= 2'
          id='recentSearchList'
          layout='fill'
          single-item
          items='.'
          data-amp-bind-src='searchTerm.length < 2 ? recentSearches : empty'
          binding='always'
          template='recentSearchTemplate'
        ></amp-list>
      </div>
      <div class='scrollSearch'>
        <div class='flex'>
          <div class='parent s12 searchTermsCont'>
            <amp-list
              binding='refresh'
              class='variableAmpList'
              data-postrender-handler='sayt.topProductsRender()'
              id='searchSuggestions'
              layout='fill'
              single-item
              items='.'
              src='amp-state:searchQuicklinks'
              data-amp-bind-src="searchTerm.length >= 2 
            ? 'https://www.bedbathandbeyond.com/apis/services/saytSearch/v1.0/all?wt=json&query=' + encodeURIComponent(searchTerm) + '&site=BedBathUS&isGroupby=true&isBrowser=true' 
            : searchQuicklinks"
              template='searchSuggestionsTemplate'
            ></amp-list>
          </div>
          <div
            class='dskWideShow topProducts parent'
            hidden
            data-amp-bind-hidden='searchTerm.length < 2 '
          >
            <amp-list
              id='topProdList'
              data-postrender-handler='sayt.topProdListPostRender()'
              layout='fill'
              single-item
              items='.'
              src='amp-state:topProdSearchState'
              data-amp-bind-src='topProdSearchState'
              binding='refresh'
              reset-on-refresh
              template='topProdTmp'
            />
          </div>
        </div>
      </div>
    </div>
  )
})
