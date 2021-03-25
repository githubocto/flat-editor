import { nanoid } from 'nanoid'
import React, { FunctionComponent, useMemo } from 'react'
import FieldWithDescription from './FieldWithDescription'

type ChooserProps = {
  options: string[]
  values?: string[]
  title: string
  label: string
  value: string
  handleChange: React.ChangeEventHandler<HTMLSelectElement>
}

const Chooser: FunctionComponent<ChooserProps> = props => {
  const id = useMemo(() => nanoid(), [])
  return (
    <FieldWithDescription title={props.title}>
      <div className="flex flex-row items-center space-x-2">
        <select>
          {props.options.map((o, i) => (
            <option key={i} value={props.values?.[i] ?? o}>
              {o}
            </option>
          ))}
        </select>
        <label htmlFor={id}>{props.label}</label>
      </div>
    </FieldWithDescription>
  )
}

export default Chooser
