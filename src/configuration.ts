export const getConfiguration = () => ({
  childId: demandEnvironmentVariable('SP_CHILD_ID'),
  cookie: demandEnvironmentVariable('SP_COOKIE')
})

const demandEnvironmentVariable = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Environment variable '${key}' not provided`)
  }
  return value
}
