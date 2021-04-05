import React, { FunctionComponent } from 'react'

type FieldWithDescriptionProps = {
  title: string
}

const FieldWithDescription: FunctionComponent<FieldWithDescriptionProps> = props => {
  return (
    <div className="hover:bg-vscode-notebook-rowHoverBackground p-4">
      <div className="font-bold text-vscode-settings-headerForeground pb-1">
        {props.title}
      </div>
      {props.children}
    </div>
  )
}

export default FieldWithDescription
