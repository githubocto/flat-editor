import React, { FunctionComponent, useMemo } from 'react'
import { VSCodeAPI } from './../VSCodeAPI'
import TextInput from './TextInput'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)

type SecretInputProps = {
  stepId: string
  title: string
  label: string
  value: string
  handleChange: (newValue: string) => void
}

const SecretInput: FunctionComponent<SecretInputProps> = props => {
  const { title, label, stepId, value, handleChange } = props

  const [localValue, setLocalValue] = React.useState('')
  const [isDirty, setIsDirty] = React.useState(false)
  const [didError, setDidError] = React.useState(false)
  const [doesExist, setDoesExist] = React.useState(
    value &&
      (value.split(' ')[1] || '').split('_')[0] === 'FLAT' &&
      (value.split(' ')[1] || '').split('_')[2] === 'CONNSTRING'
  )

  const fieldName = React.useMemo(
    () => (doesExist ? value : `\${{ FLAT_${nanoid()}_CONNSTRING }}`),
    []
  )
  const innerFieldName = fieldName.split(' ')[1]

  const handleSave = async () => {
    VSCodeAPI.postMessage({
      type: 'storeSecret',
      data: { fieldName: innerFieldName, value: localValue },
    })
  }

  React.useEffect(() => {
    window.addEventListener('message', e => {
      // @ts-ignore
      const message = e.data
      console.log(e)
      if (message.command !== 'storeSecretResponse') return
      if (message.fieldName !== innerFieldName) return

      if (message.status === 'success') {
        handleChange(fieldName)
        setIsDirty(false)
        setDoesExist(true)
      } else {
        setDidError(true)
      }
    })
  }, [])
  // let feedback
  // if (props.error) {
  //   feedback = (
  //     <div className="pt-2 text-vscode-inputValidation-errorForeground flex flex-row items-start">
  //       <div className="codicon codicon-error pr-1 text-sm pt-px" />
  //       <div>{props.error}</div>
  //     </div>
  //   )
  // } else if (props.success) {
  //   feedback = (
  //     <div className="pt-2 text-vscode-inputValidation-infoForeground flex flex-row items-start">
  //       <div className="codicon codicon-pass pr-1 text-sm pt-px" />
  //       <div>{props.success}</div>
  //     </div>
  //   )
  // }
  return (
    <div>
      <TextInput
        title={title}
        label={label}
        value={localValue}
        handleChange={e => {
          setLocalValue(e.target.value)
          setIsDirty(true)
          setDidError(false)
        }}
      >
        {isDirty && (
          <button onClick={handleSave} className="btn btn-primary">
            Save
          </button>
        )}
      </TextInput>
      {!isDirty && <div className="ml-2 mb-2 italic">✅ Saved</div>}
      {didError && (
        <div className="ml-2 mb-2 italic">
          Something went wrong, please try again.
        </div>
      )}
    </div>
  )
}

export default SecretInput
