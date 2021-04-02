import { nanoid } from 'nanoid'
import React, { FunctionComponent, useMemo } from 'react'
import FieldWithDescription from './FieldWithDescription'

type TextInputProps = {
  handleChange: React.ChangeEventHandler<HTMLInputElement>
  title: string
  label: string
  value: string
  success?: string
  error?: string
}

const TextInput: FunctionComponent<TextInputProps> = props => {
  const id = useMemo(() => nanoid(), [])
  let feedback
  if (props.error) {
    feedback = (
      <div className="pt-2 text-vscode-inputValidation-errorForeground flex flex-row items-start">
        <div className="codicon codicon-error pr-1 text-sm pt-px" />
        <div>{props.error}</div>
      </div>
    )
  } else if (props.success) {
    feedback = (
      <div className="pt-2 text-vscode-inputValidation-infoForeground flex flex-row items-start">
        <div className="codicon codicon-pass pr-1 text-sm pt-px" />
        <div>{props.success}</div>
      </div>
    )
  }
  return (
    <FieldWithDescription title={props.title}>
      <div className="flex flex-col space-y-2">
        <label htmlFor={id}>{props.label}</label>
        <div className="flex flex-row items-center">
          <input
            className="flex-1"
            id={id}
            type="text"
            onChange={props.handleChange}
            value={props.value}
          />
          {props.children}
        </div>
      </div>
      {feedback}
    </FieldWithDescription>
  )
}

export default TextInput
