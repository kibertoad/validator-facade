import { ValidationError, type ValidationErrorEntry, type Validator } from '@validator-facade/core'
import type { ZodError, ZodIssue, ZodSchema } from 'zod'

export class ZodValidator<T> implements Validator<T> {
  private readonly schema: ZodSchema

  constructor(schema: ZodSchema<T>) {
    this.schema = schema
  }

  parse(target: unknown): T {
    try {
      return this.schema.parse(target)
    } catch (err) {
      const error = err as ZodError
      throw new ValidationError({
        message: 'Validation error',
        errors: error.errors.map((entry) => this.mapToCoreErrors(entry)),
      })
    }
  }

  private mapToCoreErrors(error: ZodIssue): ValidationErrorEntry {
    return {
      message: error.message,
      path: error.path.join(':'),
      schemaDescription: this.schema.description ?? 'Schema without description',
    }
  }
}
