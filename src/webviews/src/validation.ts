// @ts-nocheck
import * as yup from 'yup'

yup.addMethod(yup.array, 'unique', function (message) {
  return this.test('unique', message, function (list) {
    const mapper = x => x.name
    const set = [...new Set(list.map(mapper))]
    const isUnique = list.length === set.length
    if (isUnique) {
      return true
    }
    const idx = list.findIndex((l, i) => mapper(l) !== set[i])
    return this.createError({
      path: `jobs[${idx}].name`,
      message: message,
    })
  })
})

const jobValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Please enter a job name')
    .matches(
      /^([a-zA-Z_]){1}([a-zA-Z_\-\d])*$/,
      "Names must start with a letter or '_' and contain only alphanumeric characters, '-', or '_'"
    ),
})

export const flatStateValidationSchema = yup.object().shape({
  // on: yup.shape({
  //   push: yup.optional(
  //     yup.shape({
  //       branches: yup.array(),
  //     })
  //   ),
  //   schedule: yup.shape({
  //     cron: yup.string().required('Please provide a trigger schedule'),
  //   }),
  // }),
  jobs: yup
    .array()
    .of(jobValidationSchema)
    // @ts-ignore
    .unique('Job names must be unique')
    .required(),
})
