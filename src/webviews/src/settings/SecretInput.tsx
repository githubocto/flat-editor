import React, { FunctionComponent, useMemo } from 'react'
import { VSCodeAPI } from './../VSCodeAPI'
import { Input } from './Input'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)

type SecretInputProps = {
  title: string
  label: string
  value: string
  handleChange: (newValue: string) => void
}

const SecretInput: FunctionComponent<SecretInputProps> = props => {
  const { title, label, value, handleChange } = props

  const [localValue, setLocalValue] = React.useState(value)
  const [isDirty, setIsDirty] = React.useState(false)
  const [didError, setDidError] = React.useState(false)
  const [doesExist, setDoesExist] = React.useState(
    value &&
      (value.split(' ')[1] || '').split('_')[0] === 'secrets.FLAT' &&
      (value.split(' ')[1] || '').split('_')[2] === 'CONNSTRING'
  )

  const fieldName = React.useMemo(
    () => (doesExist ? value : `\${{ secrets.FLAT_${nanoid()}_CONNSTRING }}`),
    []
  )
  const innerFieldName = fieldName.split(' ')[1].replace('secrets.', '')
  const isSavedAsSecret =
    fieldName.split('_')[0] === '${{ secrets.FLAT' &&
    fieldName.split('_')[2] === 'CONNSTRING }}' &&
    localValue === fieldName

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
      if (message.command !== 'storeSecretResponse') return
      if (message.fieldName !== innerFieldName) return

      if (message.status === 'success') {
        handleChange(fieldName)
        setIsDirty(false)
        setDoesExist(true)
        setLocalValue(fieldName)
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
      <form
        onSubmit={e => {
          e.preventDefault()
          handleSave()
        }}
      >
        <Input
          title={title}
          label={label}
          value={localValue}
          inputStyle={isSavedAsSecret ? { opacity: 0.5 } : undefined}
          handleChange={e => {
            setLocalValue(e.target.value)
            setIsDirty(true)
            setDidError(false)
          }}
        >
          {isDirty ? (
            <button
              type="submit"
              onClick={handleSave}
              className="btn btn-primary"
              style={{
                height: '2.3em',
              }}
            >
              Save secret
            </button>
          ) : isSavedAsSecret ? (
            <div className="ml-2 italic flex items-center">
              <div className="codicon codicon-pass pr-1 text-sm pt-px" />
              Saved as secret
            </div>
          ) : null}
        </Input>
      </form>
      {didError && (
        <div className="ml-2 mb-2 italic">
          Something went wrong, please try again.
        </div>
      )}
    </div>
  )
}

export default SecretInput
