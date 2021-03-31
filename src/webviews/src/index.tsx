import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { useFlatConfigStore } from './store'
import './vscode.css'

let config = {}

const root = document.getElementById('root')

if (root) {
  config = JSON.parse(
    decodeURIComponent(root.getAttribute('data-config') || '')
  )
}

useFlatConfigStore.setState({
  // @ts-ignore
  state: config,
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
