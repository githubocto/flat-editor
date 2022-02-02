import React, { FunctionComponent, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  VSCodeRadioGroup,
  VSCodeRadio,
  VSCodeTextField,
  VSCodeLink,
} from '@vscode/webview-ui-toolkit/react'
import { RadioGroupOrientation } from '@vscode/webview-ui-toolkit'
import * as cronstrue from 'cronstrue'
import { useState } from 'react'

type CronChooserProps = {
  value: string
  onChange: (schedule: string) => void
}

const defaultSchedules = {
  fiveMinutes: '*/5 * * * *',
  hour: '0 * * * *',
  day: '0 0 * * *',
}

const CronFallback = ({ error }: { error: any }) => {
  return (
    <div className="flex items-center mt-2 text-[color:var(--vscode-errorForeground)]">
      <i className="codicon codicon-error text-sm pt-px" />
      <span className="text-[12px] ml-1">{error}</span>
    </div>
  )
}

const ValidateCron = ({ value }: { value: string }) => {
  const feedback = cronstrue.toString(value)
  return (
    <div className="flex items-center mt-2 text-[color:var(--vscode-descriptionForeground)]">
      <i className="codicon codicon-pass text-sm pt-px" />
      <span className="text-[12px] ml-1">
        Will run:{' '}
        {feedback === 'Every minute' ? 'Every five minutes' : feedback}
      </span>
    </div>
  )
}

const determineInitialCustomValue = (schedule?: string) => {
  if (!schedule) return false
  return !Object.values(defaultSchedules).includes(schedule)
}

const CustomCronTextField = ({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) => {
  const [localValue, setValue] = useState(value)

  return (
    <div>
      <VSCodeTextField
        value={localValue}
        onInput={
          // @ts-ignore
          e => {
            setValue(e.target.value)
            onChange(e.target.value)
          }
        }
        placeholder="Enter custom schedule"
      >
        Enter a custom CRON schedule
      </VSCodeTextField>
      <ErrorBoundary resetKeys={[localValue]} FallbackComponent={CronFallback}>
        <ValidateCron value={localValue} />
      </ErrorBoundary>
      <div className="mt-1">
        <VSCodeLink href="https://crontab.guru/">
          Need help with CRON syntax?
        </VSCodeLink>
      </div>
    </div>
  )
}

const CronChooser: FunctionComponent<CronChooserProps> = props => {
  const [showCustom, setShowCustom] = React.useState(() => {
    return determineInitialCustomValue(props.value)
  })

  const handleRadioChange = (value: string) => {
    const custom = value === 'custom'
    setShowCustom(custom)
    if (!custom) {
      props.onChange(value)
    }
  }

  useEffect(() => {
    if (!props.value) return
    const isCustom = determineInitialCustomValue(props.value)
    if (isCustom && !showCustom) {
      setShowCustom(true)
    }
  }, [props.value])

  return (
    <div>
      <VSCodeRadioGroup orientation={RadioGroupOrientation.vertical}>
        <label slot="label">Schedule</label>
        <VSCodeRadio
          onChange={
            // @ts-ignore
            e => handleRadioChange(e.target.value)
          }
          checked={!showCustom && props.value === defaultSchedules.fiveMinutes}
          value={defaultSchedules.fiveMinutes}
        >
          Every five minutes
        </VSCodeRadio>
        <VSCodeRadio
          onChange={
            // @ts-ignore
            e => handleRadioChange(e.target.value)
          }
          checked={!showCustom && props.value === defaultSchedules.hour}
          value={defaultSchedules.hour}
        >
          Every hour
        </VSCodeRadio>
        <VSCodeRadio
          // @ts-ignore
          onChange={
            // @ts-ignore
            e => handleRadioChange(e.target.value)
          }
          checked={!showCustom && props.value === defaultSchedules.day}
          value={defaultSchedules.day}
        >
          Every day
        </VSCodeRadio>
        <VSCodeRadio
          onChange={
            // @ts-ignore
            e => handleRadioChange(e.target.value)
          }
          checked={showCustom}
          value="custom"
        >
          Custom
        </VSCodeRadio>
      </VSCodeRadioGroup>
      {showCustom && (
        <div className="mt-4">
          <CustomCronTextField value={props.value} onChange={props.onChange} />
        </div>
      )}
    </div>
  )
}

export default CronChooser
