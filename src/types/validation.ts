// src/types/validation.ts

export interface ValidationRule<T> {
  value: T
  message: string
}

export interface FieldRules {
  // 존재 여부
  required?: boolean | string
  notBlank?: boolean | string

  // 크기
  minLength?: ValidationRule<number>
  maxLength?: ValidationRule<number>

  // 숫자 범위
  min?: ValidationRule<number>
  max?: ValidationRule<number>
  greaterThan?: ValidationRule<number>
  lessThan?: ValidationRule<number>

  // 값 비교
  equals?: ValidationRule<unknown>
  notEquals?: ValidationRule<unknown>

  // 형식
  pattern?: ValidationRule<RegExp>

  // 커스텀
  validate?: (value: unknown) => string | undefined
}
