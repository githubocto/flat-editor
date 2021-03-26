import React, { FunctionComponent } from 'react'

type HeaderProps = {
  title: string
  description: string
}

const Header: FunctionComponent<HeaderProps> = props => {
  return (
    <header className="p-2 hover:bg-vscode-notebook-rowHoverBackground">
      <div className="text-2xl font-bold text-vscode-settings-headerForeground py-2">
        {props.title}
      </div>
      <div className="text-vscode-foreground">{props.description}</div>
      {props.children && <div className="py-2">{props.children}</div>}
    </header>
  )
}

export default Header
