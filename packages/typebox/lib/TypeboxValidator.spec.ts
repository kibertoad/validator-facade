import { Type } from '@sinclair/typebox'
import type { ValidationError } from '@validator-facade/core'
import { describe, expect, it } from 'vitest'
import { TypeboxValidator } from './TypeboxValidator'

const validator = new TypeboxValidator(
  Type.Object(
    {
      id: Type.String(),
      age: Type.Number(),
    },
    {
      description: 'Test object',
    },
  ),
)

describe('TypeboxValidator', () => {
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
                          "message": "Required property",
                          "path": "/age",
                          "schemaDescription": "Test object",
                          "value": undefined,
                        },
                        {
                          "message": "Expected string",
                          "path": "/id",
                          "schemaDescription": "Test object",
                          "value": 123,
                        },
                        {
                          "message": "Expected number",
                          "path": "/age",
                          "schemaDescription": "Test object",
                          "value": undefined,
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
