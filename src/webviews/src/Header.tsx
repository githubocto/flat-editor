import React, { FunctionComponent } from 'react'

type HeaderProps = {
  title: string
  description: string
  hasHoverState?: boolean
}

const Header: FunctionComponent<HeaderProps> = props => {
  const hasHoverState = props.hasHoverState === false ? false : true
  return (
    <header
      className={`p-4 ${
        hasHoverState ? 'hover:bg-vscode-notebook-rowHoverBackground' : ''
      }`}
    >
      <div className="text-2xl font-bold text-vscode-settings-headerForeground pb-2">
        {props.title}
      </div>
      <div className="text-vscode-foreground">{props.description}</div>
      {props.children && <div className="py-2">{props.children}</div>}
    </header>
  )
}

export default Header
