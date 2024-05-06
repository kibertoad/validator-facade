export type Validator<T> = {
  parse(target: unknown): T
}
