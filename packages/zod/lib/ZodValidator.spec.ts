import type { ValidationError } from '@validator-facade/core'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ZodValidator } from './ZodValidator'

const validator = new ZodValidator(
  z
    .object({
      id: z.string(),
      age: z.number(),
    })
    .describe('Test object'),
)

describe('ZodValidator', () => {
  describe('parse', () => {
    it('throws an error for invalid schema', () => {
      expect.assertions(2)
      try {
        validator.parse({
          id: 123,
        })
      } catch (err) {
        const error = err as ValidationError
        expect(error).toMatchInlineSnapshot(`[Error: Validation error]`)
        expect(error.errors).toMatchInlineSnapshot(`
                  [
                    {
                      "message": "Expected string, received number",
                      "path": "id",
                      "schemaDescription": "Test object",
                    },
                    {
                      "message": "Required",
                      "path": "age",
                      "schemaDescription": "Test object",
                    },
                  ]
                `)
      }
    })

    it('returns an entity for correct schema', () => {
      const entity = validator.parse({
        id: '123',
        age: 33,
      })

      expect(entity).toMatchInlineSnapshot(`
              {
                "age": 33,
                "id": "123",
              }
            `)
    })
  })
})
