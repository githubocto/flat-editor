import React from 'react'
import cc from 'classcat'
import { Clickable } from 'reakit/Clickable'
import { useCombobox } from 'downshift'

import FieldWithDescription from './FieldWithDescription'
import { VSCodeAPI } from '../VSCodeAPI'
import useFlatConfigStore from '../store'

interface FilePickerProps {
  value: string
  onChange: (newValue: string) => void
  title: string
  label: string
  accept?: string
  isClearable?: boolean
}

export function FilePicker(props: FilePickerProps) {
  const {
    title,
    label,
    value,
    onChange,
    accept = '',
    isClearable = false,
  } = props
  const { files } = useFlatConfigStore()
  const [inputValue, setInputValue] = React.useState('')

  const acceptedExtensions = accept.split(',')

  const filteredFiles = (files || []).filter((file: string) => {
    const hasAccepetedExtension =
      !acceptedExtensions.length ||
      acceptedExtensions.includes(`.${file.split('.').slice(-1)}`)
    const hasFilterString = file.includes(inputValue)
    return hasAccepetedExtension && hasFilterString
  })

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useCombobox({
    selectedItem: value,
    items: filteredFiles,
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue || '')
      if (filteredFiles.includes(inputValue || '')) onChange(inputValue || '')
      if (!inputValue && isClearable) onChange('')
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) return
      onChange(selectedItem)
    },
  })

  const handlePreview = (path: string) => {
    VSCodeAPI.postMessage({
      type: 'previewFile',
      data: path,
    })
  }

  const triggerFilesRefresh = () => {
    VSCodeAPI.postMessage({
      type: 'refreshFiles',
    })
  }

  return (
    <FieldWithDescription title={title}>
      <div className="relative">
        <label {...getLabelProps()}>{label}</label>

        <div className="flex items-center mt-2" {...getComboboxProps()}>
          <input
            type="text"
            className="p-2 flex-1"
            {...getInputProps({
              onFocus: () => {
                triggerFilesRefresh()
                openMenu()
              },
            })}
          />

          <button
            type="button"
            {...getToggleButtonProps()}
            aria-label="toggle menu"
            style={{
              height: '2.3em',
            }}
          >
            &#8595;
          </button>

          {isClearable && !!value && (
            <button
              className="absolute right-10 bg-transparent"
              onClick={() => {
                setInputValue('')
                onChange('')
              }}
            >
              <div className="codicon codicon-x pr-1 text-sm pt-px" />
            </button>
          )}
        </div>
        <ul
          className={cc([
            'absolute top-[100%] left-0 right-0 bg-white shadow-md text-gray-800 z-10',
            {
              'sr-only': !isOpen,
            },
          ])}
          {...getMenuProps()}
        >
          {isOpen && (
            <>
              {filteredFiles.map((item, index) => (
                <li
                  className={cc([
                    'p-2',
                    {
                      'bg-indigo-100': highlightedIndex === index,
                    },
                  ])}
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item}
                </li>
              ))}
              {!files && <div className="p-2">Loading...</div>}
              {!filteredFiles.length && (
                <div className="p-2">
                  No files found
                  {accept && ` with the extensions ${accept}`}
                  {inputValue && ` that include "${inputValue}"`}
                </div>
              )}
            </>
          )}
        </ul>
      </div>
      {value && (
        <div className="mt-1">
          <Clickable
            as="div"
            className="flex items-center space-x-1  appearance-none cursor-pointer"
            onClick={() => {
              handlePreview(value)
            }}
          >
            <div className="codicon codicon-eye pr-1 text-sm pt-px" />
            <div className="underline">View file</div>
          </Clickable>
        </div>
      )}
    </FieldWithDescription>
  )
}
