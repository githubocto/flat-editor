import { nanoid } from 'nanoid'
import React, { FunctionComponent, useMemo } from 'react'
import FieldWithDescription from './FieldWithDescription'

type InputProps = {
  handleChange: React.ChangeEventHandler<HTMLInputElement>
  title: string
  label: string
  value: string
  placeholder?: string
  success?: string
  error?: string
  type?: string
  inputStyle?: object
}

export const Input: FunctionComponent<InputProps> = props => {
  const { type = 'text', inputStyle = {}, placeholder = '' } = props
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
        <div className="flex flex-row flex-wrap items-center">
          <input
            className="flex-1"
            id={id}
            placeholder={placeholder}
            type={type}
            value={props.value}
            onChange={props.handleChange}
            style={inputStyle}
          />
          {props.children}
        </div>
      </div>
      {feedback}
    </FieldWithDescription>
  )
}

export default Input
