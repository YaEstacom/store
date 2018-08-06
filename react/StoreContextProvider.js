import React, { Component } from 'react'
import { Helmet } from 'render'
import PropTypes from 'prop-types'

import { OrderFormProvider } from './OrderFormContext'
import { DataLayerProvider } from './components/withDataLayer'
import { withConsoleListenerHOC } from './components/ConsoleListenerHOC'
import { gtmScript, gtmFrame } from './scripts/gtm'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html;charset=utf-8'
const META_ROBOTS = 'index, follow'
class StoreContextProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  pushToDataLayer = obj => {
    window.dataLayer.push(obj)
  }

  render() {
    window.dataLayer = window.dataLayer || []
    const { country, locale, currency } = global.__RUNTIME__.culture
    const settings = this.context.getSettings(APP_LOCATOR) || {}
    console.log(settings)
    const {
      gtmId,
      titleTag,
      metaTagDescription,
      metaTagKeywords,
      storeName,
    } = settings
    const scripts = gtmId
      ? [
          {
            type: 'application/javascript',
            innerHTML: gtmScript(gtmId),
          },
        ]
      : []
    const noscripts = gtmId
      ? [{ id: 'gtm_frame', innerHTML: gtmFrame(gtmId) }]
      : []
    return (
      <DataLayerProvider
        value={{
          dataLayer: window.dataLayer,
          set: this.pushToDataLayer,
        }}
      >
        <Helmet script={scripts} noscript={noscripts} />
        <Helmet>
          <title>{titleTag}</title>
          <meta name="description" content={metaTagDescription} />
          <meta name="keywords" content={metaTagKeywords} />
          <meta name="copyright" content={storeName} />
          <meta name="author" content={storeName} />
          <meta name="country" content={country} />
          <meta name="language" content={locale} />
          <meta name="currency" content={currency} />
          <meta name="robots" content={META_ROBOTS} />
          <meta httpEquiv="Content-Type" content={CONTENT_TYPE} />
        </Helmet>
        <OrderFormProvider>
          <div className="vtex-store__template">{this.props.children}</div>
        </OrderFormProvider>
      </DataLayerProvider>
    )
  }
}

StoreContextProvider.contextTypes = {
  getSettings: PropTypes.func,
}

export default withConsoleListenerHOC(StoreContextProvider)
