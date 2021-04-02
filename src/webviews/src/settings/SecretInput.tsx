import React, { FunctionComponent, useMemo } from 'react'
import { VSCodeAPI } from './../VSCodeAPI'
import FieldWithDescription from './FieldWithDescription'
import TextInput from './TextInput'
import useFlatConfigStore from '../store'

type SecretInputProps = {
  stepId: string
  title: string
  label: string
  handleChange?: (newValue: string) => void
}

const SecretInput: FunctionComponent<SecretInputProps> = props => {
  const [localValue, setLocalValue] = React.useState('')
  const [isDirty, setIsDirty] = React.useState(false)
  const [didError, setDidError] = React.useState(false)

  const { title, label, stepId, handleChange } = props

  const fieldName = `FLAT_${stepId}_CONNSTRING`

  const handleSave = async () => {
    VSCodeAPI.postMessage({
      type: 'storeSecret',
      data: { fieldName, value: localValue },
    })
  }

  React.useEffect(() => {
    window.addEventListener('message', e => {
      // @ts-ignore
      const message = e.data
      console.log(e)
      if (message.command !== 'storeSecretResponse') return
      if (message.fieldName !== fieldName) return

      if (message.status === 'success') {
        handleChange(`\${{ secrets.${fieldName} }}`)
        setIsDirty(false)
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
