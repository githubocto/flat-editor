import React, { FunctionComponent } from 'react'

type FieldWithDescriptionProps = {
  title: string
}

const FieldWithDescription: FunctionComponent<FieldWithDescriptionProps> = props => {
  return (
    <div className="hover:bg-vscode-notebook-rowHoverBackground p-2">
      <div className="font-bold text-vscode-settings-headerForeground py-1">
        {props.title}
      </div>
      {props.children}
    </div>
  )
}

export default FieldWithDescription
