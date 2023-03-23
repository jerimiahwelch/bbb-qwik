import { component$, useStyles$ } from '@builder.io/qwik'
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city'
import { RouterHead } from './components/router-head/router-head'

import theme from './sitewide/theme.css?inline'
import reset from './sitewide/reset.css?inline'
import font from './sitewide/font.css?inline'
import layout from './sitewide/layout.css?inline'
import typography from './sitewide/typography.css?inline'
import elements from './sitewide/elements.css?inline'
import accordion from './sitewide/accordion.css?inline'
import svg from './sitewide/svg.css?inline'

import SvgDefs from './sitewide/svg'

export default component$(() => {
  useStyles$(theme)
  useStyles$(reset)
  useStyles$(font)
  useStyles$(layout)
  useStyles$(typography)
  useStyles$(elements)
  useStyles$(accordion)
  useStyles$(svg)
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet='utf-8' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='preconnect' href='https://b3h2.scene7.com' />
        <link rel='dns-prefetch' href='https://b3h2.scene7.com' />
        <RouterHead />
      </head>
      <body lang='en'>
        <SvgDefs />
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  )
})
