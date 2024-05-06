export type ValidationErrorEntry = {
  path: string
  message: string
  schemaDescription: string
  value?: unknown
}

export type ValidationErrorOptions = {
  message: string
  errors: ValidationErrorEntry[]
}

export class ValidationError extends Error {
  public readonly isValidationError = true
  public readonly errors: ValidationErrorEntry[]

  constructor(options: ValidationErrorOptions) {
    super(options.message)

    this.errors = options.errors
  }
}
