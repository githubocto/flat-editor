import * as cronstrue from 'cronstrue'
import React, { FunctionComponent } from 'react'
import FieldWithDescription from './FieldWithDescription'

type CronChooserProps = {
  value: string
  handleScheduleChange: (schedule: string) => void
}

const defaultSchedules = {
  fiveMinutes: '* * * * *',
  hour: '0 * * * *',
  day: '0 0 * * * ',
}

const CronChooser: FunctionComponent<CronChooserProps> = props => {
  const [customCron, setCustomCron] = React.useState('* * * * *')
  const [showCustom, setShowCustom] = React.useState(false)
  const [cronFeedback, setCronFeedback] = React.useState<string | Error>('')

  const validateCron = (val: string) => {
    try {
      setCronFeedback(
        cronstrue.toString(val, { throwExceptionOnParseError: true })
      )
      props.handleScheduleChange(val)
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
    props.handleScheduleChange(custom ? customCron : e.target.value)
  }

  return (
    <FieldWithDescription title="Execution frequency">
      <div className="space-y-4 mt-2">
        <div className="flex items-center space-x-4" role="group">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="cron"
              checked={
                !showCustom && props.value === defaultSchedules.fiveMinutes
              }
              onChange={handleRadioChange}
              value={defaultSchedules.fiveMinutes}
            />
            <span>Five Minutes</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="cron"
              checked={!showCustom && props.value === defaultSchedules.hour}
              onChange={handleRadioChange}
              value={defaultSchedules.hour}
            />
            <span>Hour</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="cron"
              checked={!showCustom && props.value === defaultSchedules.day}
              onChange={handleRadioChange}
              value={defaultSchedules.day}
            />
            <span>Day</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              onChange={handleRadioChange}
              type="radio"
              name="cron"
              value="custom"
            />
            <span>Custom</span>
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
                className="shadow-sm block w-full"
                placeholder="Enter custom schedule"
                type="text"
              />
            </div>
            {cronFeedback && (
              <div>
                {cronFeedback instanceof Error ? (
                  <div className="text-vscode-inputValidation-errorForeground">
                    {cronFeedback.message}
                  </div>
                ) : (
                  <div>
                    <span className="text-vscode-inputValidation-infoForeground">
                      Will run:{' '}
                    </span>{' '}
                    {cronFeedback === 'Every minute'
                      ? 'Every five minutes'
                      : cronFeedback}
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
