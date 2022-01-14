/**
 * Rule type.
 */
export type RuleType = 'and' | 'or';

/**
 * Operator callback function.
 */
export type OperatorFn<F extends any = any, V extends any = any> = (a: F, b: V, t?: any) => boolean;

/**
 * Resolver function.
 */
export type ResolverFn = (obj: any, path: string, value?: any) => any;

/**
 * Rule json simplified configuration.
 */
export interface RuleJsonSimplified {
  and?: Array<RuleItemJson>;
  or?: Array<RuleItemJson>;
}

/**
 * Rule json structured configuration.
 */
export interface RuleJsonStructured {
  relation: RuleType;
  conditions?: Array<RuleItemJson>;
}

/**
 * Rule json specification.
 */
export type RuleSpec = 'simplified' | 'structured';

export type RuleJson = RuleJsonSimplified | RuleJsonStructured;

export type RuleItemJson = RuleJson | ConditionJson;

/**
 * Condition json configuration.
 */
export interface ConditionJson {
  fact: string;
  operator: string;
  value: any;
  type?: 'string' | 'number' | 'boolean';
  message?: string;
}

export interface EvaluateOptions {
  message?: boolean;
}

export interface EvaluateResult {
  result: boolean;
  message?: string;
}