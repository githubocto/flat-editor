// @ts-nocheck
import * as yup from 'yup'

yup.addMethod(yup.array, 'unique', function (message, mapper = a => a) {
  console.log('in array test!')
  return this.test('unique', message, function (list: any[]) {
    return list.length === new Set(list.map(mapper)).size
  })
})

const jobValidationSchema = yup.object().shape({
  name: yup.string().required('Please enter a job name'),
})

export const flatStateValidationSchema = yup.object().shape({
  triggerPush: yup.bool(),
  triggerSchedule: yup.string().required('Please provide a trigger schedule'),
  jobs: yup
    .array()
    .of(jobValidationSchema)
    // @ts-ignore
    .unique('Job names must be unique', job => job.name)
    .required(),
})
