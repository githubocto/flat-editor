import React from 'react'
import { Clickable } from 'reakit/Clickable'

import FieldWithDescription from './FieldWithDescription'
import { VSCodeAPI } from '../VSCodeAPI'
import useFlatConfigStore from '../store'

interface FilePickerProps {
  value: string
  onChange: (newValue: string) => void
  title: string
  label: string
}

export function FilePicker(props: FilePickerProps) {
  const { title, label, value, onChange } = props
  const { workspace } = useFlatConfigStore()
  const filePickerRef = React.useRef<HTMLInputElement | null>(null)

  const handlePreview = (path: string) => {
    VSCodeAPI.postMessage({
      type: 'previewFile',
      data: path,
    })
  }

  const handleOpenFilePicker = () => {
    if (filePickerRef.current) {
      filePickerRef.current.click()
    }
  }

  return (
    <FieldWithDescription title={title}>
      <div className="space-y-2">
        <label className="block">{label}</label>
        {value && (
          <div className="flex items-center space-x-1">
            <Clickable
              as="div"
              className="underline appearance-none cursor-pointer"
              onClick={() => {
                handlePreview(value)
              }}
            >
              {value}
            </Clickable>
          </div>
        )}
        <button onClick={handleOpenFilePicker}>
          Choose a {value ? 'different ' : ''}query file
        </button>
      </div>
      <input
        accept=".sql"
        className="sr-only"
        type="file"
        ref={filePickerRef}
        onChange={e => {
          if (e.target.files && e.target.files.length > 0) {
            const [file] = e.target.files
            // @ts-ignore
            const relativePath = file.path.split(workspace)[1]
            // @ts-ignore
            onChange(relativePath)
          }
        }}
      />
    </FieldWithDescription>
  )
}
