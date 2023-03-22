import { component$, Slot } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import Header from '~/components/bbb/header/header'
import Footer from '~/components/bbb/footer/footer'

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  }
})

export default component$(() => {
  return (
    <div class='page'>
      <main>
        <Header />
        <div id='wm_content' class='container'>
          <Slot />
        </div>
      </main>
      <Footer />
    </div>
  )
})
