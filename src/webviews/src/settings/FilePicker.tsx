// @ts-nocheck
import React from 'react'

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'
import '@reach/combobox/styles.css'

import { FilePreview } from './FilePreview'
import { VSCodeAPI } from '../VSCodeAPI'
import useFlatConfigStore from '../store'
import {
  VSCodeButton,
  VSCodeOption,
  VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react'

interface FilePickerProps {
  value?: string
  onChange: (newValue: string) => void
  title: string
  label: string
  accept?: string
  isClearable?: boolean
}

export function FilePicker(props: FilePickerProps) {
  const { label, value, onChange, accept = '' } = props
  const [localValue, setLocalValue] = React.useState(value)
  const { files = [] } = useFlatConfigStore()

  const acceptedExtensions = accept.split(',')

  const filteredFiles = files.filter((file: string) => {
    const hasAccepetedExtension =
      !acceptedExtensions.length ||
      acceptedExtensions.includes(`.${file.split('.').slice(-1)}`)
    const hasFilterString = file.includes(localValue)
    return hasAccepetedExtension && hasFilterString
  })

  const handleFocus = () => {
    VSCodeAPI.postMessage({
      type: 'refreshFiles',
    })
  }

  const handlePreview = (path: string) => {
    VSCodeAPI.postMessage({
      type: 'previewFile',
      data: path,
    })
  }

  return (
    <div>
      <Combobox
        openOnFocus
        aria-label="Pick a file"
        onSelect={value => {
          setLocalValue(value)
          onChange(value)
        }}
      >
        <ComboboxInput
          value={localValue}
          onFocus={handleFocus}
          onInput={e => {
            setLocalValue(e.target.value)
            onChange(e.target.value)
          }}
          className="w-full"
          as={VSCodeTextField}
        >
          {label}
        </ComboboxInput>
        <ComboboxPopover className="!bg-[color:var(--dropdown-background)]">
          {!files && <div className="p-2">Loading...</div>}
          {filteredFiles.length > 0 && (
            <ComboboxList className="bg-[color:var(--dropdown-background)]">
              {filteredFiles.map(file => {
                return (
                  <ComboboxOption
                    as={VSCodeOption}
                    className="text-white w-full"
                    key={file}
                    value={file}
                  />
                )
              })}
            </ComboboxList>
          )}
          {!filteredFiles.length && (
            <div className="p-2">
              No files found
              {accept && ` with the extensions ${accept}`}
              {localValue && ` that include "${localValue}"`}
            </div>
          )}
        </ComboboxPopover>
      </Combobox>
      <FilePreview file={value || ''} />
      {value && (
        <div className="mt-2">
          <VSCodeButton
            appearance="secondary"
            onClick={() => {
              handlePreview(value)
            }}
          >
            <span slot="start" className="codicon codicon-eye" />
            View file
          </VSCodeButton>
        </div>
      )}
    </div>
  )
}
