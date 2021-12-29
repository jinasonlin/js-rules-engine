/**
 * Rule type.
 */
export type RuleType = 'and' | 'or';

/**
 * Operator callback function.
 */
export type OperatorFn = (a: any, b: any) => boolean;

/**
 * Resolver function.
 */
export type ResolverFn = (obj: any, path: string, value?: any) => any;

/**
 * Rule json configuration.
 */
export interface RuleJson extends Object {
  and?: Array<RuleJson | ConditionJson>;
  or?: Array<RuleJson | ConditionJson>;
}

/**
 * Condition json configuration.
 */
export interface ConditionJson {
  fact: string;
  operator: string;
  value: any;
  message?: string;
}

export interface EvaluateOptions {
  message?: boolean;
}

export interface EvaluateResult {
  result: boolean;
  message?: string;
}