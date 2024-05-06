import type { StaticDecode, TSchema } from '@sinclair/typebox'
import { type TypeCheck, TypeCompiler, type ValueError } from '@sinclair/typebox/compiler'
import { ValidationError, type ValidationErrorEntry, type Validator } from '@validator-facade/core'

export class TypeboxValidator<T extends TSchema, R = StaticDecode<T>> implements Validator<R> {
  private readonly checker: TypeCheck<TSchema>
  private readonly schema: TSchema

  constructor(schema: T) {
    this.checker = TypeCompiler.Compile<TSchema>(schema)
    this.schema = schema
  }

  parse(target: unknown): R {
    try {
      const result = this.checker.Decode(target)
      return result as R
    } catch (err) {
      const errors = Array.from(this.checker.Errors(target))
      throw new ValidationError({
        message: 'Validation error',
        errors: errors.map((entry) => this.mapToCoreErrors(entry)),
      })
    }
  }

  private mapToCoreErrors(error: ValueError): ValidationErrorEntry {
    return {
      message: error.message,
      schemaDescription: this.schema.description ?? 'Schema without description',
      path: error.path,
      value: error.value,
    }
  }
}
