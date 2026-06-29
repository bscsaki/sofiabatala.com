import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <pre style={{ color: 'red', background: 'white', padding: 20, fontSize: 16, whiteSpace: 'pre-wrap' }}>
          {this.state.error.message}
          {'\n'}
          {this.state.error.stack}
        </pre>
      )
    }
    return this.props.children
  }
}
