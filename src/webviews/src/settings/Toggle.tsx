import { nanoid } from 'nanoid'
import React, { FunctionComponent, useMemo } from 'react'
import FieldWithDescription from './FieldWithDescription'

type ToggleProps = {
  handleChange: React.ChangeEventHandler<HTMLInputElement>
  title: string
  label: string
  checked?: boolean
}

const Toggle: FunctionComponent<ToggleProps> = props => {
  const id = useMemo(() => nanoid(), [])
  return (
    <FieldWithDescription title={props.title}>
      <div className="flex flex-row items-center space-x-2">
        <input
          type="checkbox"
          onChange={props.handleChange}
          checked={props.checked}
          id={id}
        />
        <label htmlFor={id}>{props.label}</label>
      </div>
    </FieldWithDescription>
  )
}

export default Toggle
