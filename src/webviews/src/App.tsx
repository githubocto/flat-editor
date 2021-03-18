import React from 'react'
import Job from './Job'

interface AppProps {}

function App({}: AppProps) {
  return (
    <div className="p-6">
      <Job name="foo" />
      <Job name="bar" />
      <Job name="baz" />
    </div>
  )
}

export default App
