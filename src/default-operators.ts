import { Operator } from './operator';

/**
 * Default operators.
 */
export const defaultOperators = [
  new Operator('equals', (a, b) => a === b),
  new Operator('notEquals', (a, b) => a !== b),
  new Operator('in', (a, b: string| any[]) => b.indexOf(a) > -1),
  new Operator('notIn', (a, b: string| any[]) => b.indexOf(a) === -1),
  new Operator('contains', (a: string| any[], b) => a.indexOf(b) > -1),
  new Operator('notContains', (a: string| any[], b) => a.indexOf(b) === -1),
  new Operator('lessThan', (a: number, b: number) => a < b),
  new Operator('lessThanOrEquals', (a: number, b: number) => a <= b),
  new Operator('greaterThan', (a: number, b: number) => a > b),
  new Operator('greaterThanOrEquals', (a: number, b: number) => a >= b),
  new Operator('between', (a: number, [b1, b2]: [number, number]) => a >= b1 && a <= b2),
  new Operator('isTrue', (a: boolean) => a === true),
  new Operator('isFalse', (a: boolean) => a === false),
  new Operator('matchRegExp', (a: string, b: string | [string, string]) => (new RegExp(...(Array.isArray(b) ? b : [b]) as [string, string?])).test(a)),
  new Operator('notMatchRegExp', (a: string, b: string | [string, string]) => !(new RegExp(...(Array.isArray(b) ? b : [b]) as [string, string?])).test(a)),
];

type ReturnOperatorNameType<T> = T extends ({ name: infer ElementType })[] ? ElementType : never;

export type DefaultOperatorNames = ReturnOperatorNameType<typeof defaultOperators>;
