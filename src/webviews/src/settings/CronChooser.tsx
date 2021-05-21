import * as cronstrue from 'cronstrue'
import React, { FunctionComponent } from 'react'
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
  const handleCustomCronChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomCron(val)
    validateCron(val)
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const custom = e.target.value === 'custom'
    if (custom) {
      validateCron(customCron)
    }
    setShowCustom(custom)
    props.onChange(custom ? customCron : e.target.value)
  }

  return (
    <FieldWithDescription title="On a schedule">
      <div className="space-y-4 mt-2">
        <div className="flex flex-wrap items-center" role="group">
          <label className="flex items-center space-x-1 mr-4 my-1">
            <input
              type="radio"
              name="cron"
              checked={
                !showCustom && props.value === defaultSchedules.fiveMinutes
              }
              onChange={handleRadioChange}
              value={defaultSchedules.fiveMinutes}
            />
            <span>Every five minutes</span>
          </label>
          <label className="flex items-center space-x-1 mr-4 my-1">
            <input
              type="radio"
              name="cron"
              checked={!showCustom && props.value === defaultSchedules.hour}
              onChange={handleRadioChange}
              value={defaultSchedules.hour}
            />
            <span>Every hour</span>
          </label>
          <label className="flex items-center space-x-1 mr-4 my-1">
            <input
              type="radio"
              name="cron"
              checked={!showCustom && props.value === defaultSchedules.day}
              onChange={handleRadioChange}
              value={defaultSchedules.day}
            />
            <span>Every day</span>
          </label>
          <label className="flex items-center space-x-1 my-1">
            <input
              onChange={handleRadioChange}
              type="radio"
              name="cron"
              value="custom"
              checked={showCustom}
            />
            <span>On a custom schedule</span>
          </label>
        </div>
        {showCustom && (
          <div className="space-y-2">
            <p className="mt-1 text-xs opacity-50">
              Enter a custom CRON schedule (
              <a className="underline" href="https://crontab.guru/">
                Need help?
              </a>
              )
            </p>
            <div className="flex">
              <input
                value={customCron}
                onChange={handleCustomCronChange}
                className="shadow-sm block w-64"
                placeholder="Enter custom schedule"
                type="text"
              />
            </div>
            {cronFeedback && (
              <div>
                {cronFeedback instanceof Error ? (
                  <div className="text-vscode-inputValidation-errorForeground flex flex-row items-start">
                    <div className="codicon codicon-error pr-1 text-sm pt-px" />
                    <div>{cronFeedback.message}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-vscode-inputValidation-infoForeground flex flex-row items-start">
                      <div className="codicon codicon-pass pr-1 text-sm pt-px" />
                      <div>
                        Will run:{' '}
                        {cronFeedback === 'Every minute'
                          ? 'Every five minutes'
                          : cronFeedback}
                      </div>
                    </div>{' '}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </FieldWithDescription>
  )
}

export default CronChooser
