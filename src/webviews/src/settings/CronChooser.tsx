import React, { FunctionComponent, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  VSCodeRadioGroup,
  VSCodeRadio,
  VSCodeTextField,
  VSCodeLink,
} from '@vscode/webview-ui-toolkit/react'
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
    <div className="flex items-center space-x-1 text-[#F14C4C]">
      <i className="codicon codicon-error text-sm pt-px" />
      <p className="text-[12px]">{error}</p>
    </div>
  )
}

const ValidateCron = ({ value }: { value: string }) => {
  const feedback = cronstrue.toString(value)
  return (
    <div className="flex items-center space-x-1 text-[#73C991]">
      <i className="codicon codicon-pass pr-1 text-sm pt-px" />
      <p className="text-[12px]">
        Will run:{' '}
        {feedback === 'Every minute' ? 'Every five minutes' : feedback}
      </p>
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
      <div className="flex items-center">
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
        <div className="ml-4">
          <VSCodeLink href="https://crontab.guru/">
            Need help with CRON syntax?
          </VSCodeLink>
        </div>
      </div>
      <ErrorBoundary resetKeys={[localValue]} FallbackComponent={CronFallback}>
        <ValidateCron value={localValue} />
      </ErrorBoundary>
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
      <VSCodeRadioGroup>
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
