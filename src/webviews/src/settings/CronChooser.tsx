import React, { FunctionComponent, useEffect } from 'react'
import {
  VSCodeRadioGroup,
  VSCodeRadio,
  VSCodeTextField,
  VSCodeLink,
} from '@vscode/webview-ui-toolkit/react'
import * as cronstrue from 'cronstrue'
import FieldWithDescription from './FieldWithDescription'

type CronChooserProps = {
  value: string
  onChange: (schedule: string) => void
}

const defaultSchedules = {
  fiveMinutes: '*/5 * * * *',
  hour: '0 * * * *',
  day: '0 0 * * *',
}

const determineInitialCustomValue = (schedule?: string) => {
  if (!schedule) return false
  return !Object.values(defaultSchedules).includes(schedule)
}

const CronChooser: FunctionComponent<CronChooserProps> = props => {
  const isInitiallyCustom = determineInitialCustomValue(props.value)

  const [customCron, setCustomCron] = React.useState(
    isInitiallyCustom ? props.value : defaultSchedules.day
  )
  const [showCustom, setShowCustom] = React.useState(() => isInitiallyCustom)
  const [cronFeedback, setCronFeedback] = React.useState<string | Error>('')

  const validateCron = (val: string) => {
    try {
      setCronFeedback(
        cronstrue.toString(val, { throwExceptionOnParseError: true })
      )
      props.onChange(val)
    } catch (error) {
      setCronFeedback(new Error(error as string))
    }
  }
  const handleCustomCronChange = (val: string) => {
    setCustomCron(val)
    validateCron(val)
  }

  const handleRadioChange = (value: string) => {
    const custom = value === 'custom'
    if (custom) {
      validateCron(customCron)
    }
    setShowCustom(custom)
    props.onChange(custom ? customCron : value)
  }

  useEffect(() => {
    if (!props.value) return
    const isCustom = determineInitialCustomValue(props.value)
    if (isCustom && !showCustom) {
      setShowCustom(true)
      setCustomCron(props.value)
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
        <>
          <div className="mt-4">
            <div className="flex items-center">
              <VSCodeTextField
                value={customCron}
                onInput={
                  // @ts-ignore
                  e => handleCustomCronChange(e.target.value)
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
          </div>
          {cronFeedback && (
            <div className="mt-1">
              {cronFeedback instanceof Error ? (
                <div className="flex items-center space-x-1 text-[#F14C4C]">
                  <i className="codicon codicon-error text-sm pt-px" />
                  <p className="text-[12px]">{cronFeedback.message}</p>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-[#73C991]">
                  <i className="codicon codicon-pass pr-1 text-sm pt-px" />
                  <p className="text-[12px]">
                    Will run:{' '}
                    {cronFeedback === 'Every minute'
                      ? 'Every five minutes'
                      : cronFeedback}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CronChooser
