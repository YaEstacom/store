import React from 'react'

function override() {
  const _error = console.error
  const _warning = console.warn

  console.error = function(errMessage) {
    console.log('Intercept err:', errMessage)

    _error.apply(console, arguments)
  }

  console.warn = function(warnMessage) {
    console.log('Intercept warn:', warnMessage)
    _warning.apply(console, arguments)
  }
}

export function withConsoleListenerHOC(WrappedComponent) {
  return class ConsoleListener extends React.Component {
    static displayName = `ConsoleListener(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    constructor(props) {
      super(props)

      const { testing } = props.query

      if (testing) override()
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
