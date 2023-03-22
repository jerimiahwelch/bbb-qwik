import { component$ } from '@builder.io/qwik'
import { useDocumentHead, useLocation } from '@builder.io/qwik-city'

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead()
  const loc = useLocation()

  return (
    <>
      <title>{head.title}</title>

      <link rel='canonical' href={loc.href} />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
      <link
        rel='preload'
        href='https://www.bedbathandbeyond.com/amp/7865/EffraW01-Light.woff2'
        as='font'
        type='font/woff2'
        crossOrigin=''
      />
      <link
        rel='preload'
        href='https://www.bedbathandbeyond.com/amp/7865/EffraW01-Bold.woff2'
        as='font'
        type='font/woff2'
        crossOrigin=''
      />
      <link
        rel='preload'
        href='https://www.bedbathandbeyond.com/amp/7865/TerminaW00-Bold.woff2'
        as='font'
        type='font/woff2'
        crossOrigin=''
      />

      {head.meta.map(m => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map(l => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map(s => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  )
})
