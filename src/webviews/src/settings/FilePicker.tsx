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
import { useEffect } from 'react'

interface FilePickerProps {
  value?: string
  onChange: (newValue: string) => void
  title: string
  label: string
  accept?: string
  isClearable?: boolean
}

export function FilePicker(props: FilePickerProps) {
  const { label, value, onChange, accept = '', title } = props
  const [localValue, setLocalValue] = React.useState(value)
  const { files = [] } = useFlatConfigStore()

  useEffect(() => {
    if (localValue === '' && Boolean(value)) {
      onChange(null)
    }
  }, [value, localValue])

  const acceptedExtensions = accept.split(',')

  const filteredFiles = files
    .filter(file => {
      return (
        !acceptedExtensions.length ||
        acceptedExtensions.includes(`.${file.split('.').slice(-1)}`)
      )
    })
    .filter(file => {
      if (!localValue) return true
      return file.includes(localValue)
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
          disabled={files.length === 0}
          onInput={e => {
            setLocalValue(e.target.value)
          }}
          className="w-full"
          as={VSCodeTextField}
          placeholder={files.length === 0 ? 'Loading files...' : 'Pick a file'}
        >
          {title}
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
      <div className="mt-2">
        <p className="text-[12px] mt-1 mb-0 font-medium">{label}</p>
      </div>
      {files.includes(localValue) && (
        <div>
          <FilePreview file={localValue || ''} />
          <div className="mt-2">
            <VSCodeButton
              appearance="secondary"
              onClick={() => {
                handlePreview(localValue)
              }}
            >
              <span slot="start" className="codicon codicon-eye" />
              View file
            </VSCodeButton>
          </div>
        </div>
      )}
    </div>
  )
}
