import React, { FunctionComponent } from 'react'
import { VSCodeAPI } from './../VSCodeAPI'
import { VSCodeButton, VSCodeTextField } from '@vscode/webview-ui-toolkit/react'
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
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          handleSave()
        }}
      >
        <div className="flex items-center">
          <div className="flex-1">
            <VSCodeTextField
              className="w-full"
              placeholder="Enter secret value"
              style={isSavedAsSecret ? { opacity: 0.5 } : undefined}
              onInput={
                // @ts-ignore
                e => {
                  setLocalValue(e.target.value)
                  setIsDirty(true)
                  setDidError(false)
                }
              }
            >
              {title}
            </VSCodeTextField>
            <p className="text-[12px] mt-1 mb-0 text-[color:var(--vscode-descriptionForeground)]">
              {label}
            </p>
          </div>
          <div className="ml-4">
            <VSCodeButton
              type="submit"
              disabled={isSavedAsSecret || !isDirty}
              onClick={handleSave}
            >
              {isSavedAsSecret ? (
                <>
                  Saved successfully
                  <span className="codicon codicon-pass ml-2" slot="end"></span>
                </>
              ) : (
                'Save as secret'
              )}
            </VSCodeButton>
          </div>
        </div>
      </form>
      {didError && (
        <p className="text-[#F14C4C] mt-2">
          Something went wrong, please try again.
        </p>
      )}
    </div>
  )
}

export default SecretInput
