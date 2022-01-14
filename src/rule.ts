import { Condition } from './condition';
import type { DefaultOperatorNames } from './default-operators';
import { defaultEngine } from './default-engine';
import { Engine } from './engine';
import type {
  RuleJsonStructured,
  RuleJsonSimplified,
  RuleJson,
  RuleItemJson,
  RuleSpec,
  RuleType,
  EvaluateResult,
} from './interfaces';

type RuleDefaultOperatorMethod = (fact: string, value: any) => Rule;
type RuleDefaultOperatorMethods = Record<Exclude<DefaultOperatorNames, 'isTrue' | 'isFalse'>, RuleDefaultOperatorMethod>;

/**
 * Rule.
 */
export class Rule implements RuleDefaultOperatorMethods {
  constructor(json?: RuleJson, engine?: Engine) {
    if (engine) {
      this.engine = engine;
    }

    if (json) {
      this.init(json);
    }
  }

  /**
   * Rule type.
   */
  private type: RuleType = 'and';

  /**
   * Rule items.
   */
  private items: Array<Rule | Condition> = [];

  /**
   * Engine instance.
   */
  private engine = defaultEngine;

  /**
   * Add a condition with an equals operator.
   *
   * @param fact Property name or dot notation path.
   * @param value Value to compare.
   */
  equals(fact: string, value: any) {
    return this.add(fact, 'equals', value);
  }

  /**
   * Add a condition with an notEquals operator.
   *
   * @param fact Property name or dot notation path.
   * @param value Value to compare.
   */
  notEquals(fact: string, value: any) {
    return this.add(fact, 'notEquals', value);
  }

  /**
   * Add a condition with an in operator.
   *
   * @param fact Property name or dot notation path.
   * @param value Value to compare.
   */
  in(fact: string, value: string) {
    return this.add(fact, 'in', value);
  }

  /**
   * Add a condition with an notIn operator.
   *
   * @param fact Property name or dot notation path.
   * @param value Value to compare.
   */
  notIn(fact: string, value: string) {
    return this.add(fact, 'notIn', value);
  }

  /**
   * Add a condition with an contains operator.
   *
   * @param fact Property name or dot notation path.
   * @param value Value to compare.
   */
  contains(fact: string, value: any) {
    return this.add(fact, 'contains', value);
  }

  /**
   * Add a condition with an notContains operator.
   *
   * @param fact Property name or dot notation path.
   * @param value Value to compare.
   */
  notContains(fact: string, value: any) {
    return this.add(fact, 'notContains', value);
  }

  /**
   * Add a condition with an lessThan operator.
   *
   * @param fact Property name or dot notation path.
   * @param value Value to compare.
   */
  lessThan(fact: string, value: number) {
    return this.add(fact, 'lessThan', value);
  }

  /**
   * Add a condition with an lessThanOrEquals operator.
   *
   * @param fact Property name or dot notation path.
   * @param value Value to compare.
   */
  lessThanOrEquals(fact: string, value: number) {
    return this.add(fact, 'lessThanOrEquals', value);
  }

  /**
   * Add a condition with an greaterThan operator.
   *
   * @param fact Property name or dot notation path.
   * @param value Value to compare.
   */
  greaterThan(fact: string, value: number) {
    return this.add(fact, 'greaterThan', value);
  }

  /**
   * Add a condition with an greaterThanOrEquals operator.
   *
   * @param fact Property name or dot notation path.
   * @param value Value to compare.
   */
  greaterThanOrEquals(fact: string, value: number) {
    return this.add(fact, 'greaterThanOrEquals', value);
  }

  /**
    * Add a condition with an between operator.
    *
    * @param fact Property name or dot notation path.
    * @param value Value to compare.
    */
  between(fact: string, value: [number, number]) {
    return this.add(fact, 'between', value);
  }

  /**
    * Add a condition with an matchRegExp operator.
    *
    * @param fact Property name or dot notation path.
    * @param value Value to compare.
    */
  matchRegExp(fact: string, value: string | [string, string]) {
    return this.add(fact, 'matchRegExp', value);
  }

  /**
    * Add a condition with an matchRegExp operator.
    *
    * @param fact Property name or dot notation path.
    * @param value Value to compare.
    */
  notMatchRegExp(fact: string, value: string | [string, string]) {
    return this.add(fact, 'notMatchRegExp', value);
  }

  /**
   * Add a rule.
   *
   * @param rule The rule will be clone.
   */
  add(rule: RuleJson): Rule;
  /**
   * Add a rule or condition.
   *
   * @param fact Property name or dot notation path.
   * @param operator Name of operator to use.
   * @param value Value to compare.
   */
  add(fact: string, operator: string, value: any): Rule;
  add(fact: string | RuleJson, operator?: string, value?: any, type?: any) {
    if (typeof fact !== 'string') {
      this.items.push(new Rule(fact, this.engine));
    } else {
      this.items.push(new Condition({ fact, operator, value, type }, this.engine));
    }
    return this;
  }

  /**
   * Add a nested AND rule.
   *
   * @param fn Callback function.
   */
  and(fn: (rule: Rule) => void) {
    const rule = new Rule(null, this.engine);
    rule.type = 'and';

    fn.call(null, rule);
    this.items.push(rule);

    return this;
  }

  /**
   * Add a nested OR rule.
   *
   * @param fn Callback function.
   */
  or(fn: (rule: Rule) => void) {
    const rule = new Rule(null, this.engine);
    rule.type = 'or';

    fn.call(null, rule);
    this.items.push(rule);

    return this;
  }

  /**
   * Evaluate a rule's conditions against the provided data.
   *
   * @param data Data object to use.
   */
  evaluate(data: Record<string, unknown>): EvaluateResult {
    let firstMessage;

    for (const item of this.items) {
      const { result, message } = item.evaluate(data);

      if (!firstMessage && message) {
        firstMessage = { message };
      }

      if (this.type === 'and' && !result) {
        return { result, ...firstMessage };
      } else if (this.type === 'or' && result) {
        return { result };
      }
    }

    if (this.type === 'and') {
      return { result: true };
    } else {
      return { result: false, ...firstMessage };
    }
  }

  /**
   * To json.
   */
  toJSON(spec?: RuleSpec): RuleJson {
    if (spec === 'structured') {
      return {
        relation: this.type,
        conditions: this.items.map((item) => item.toJSON()),
      }
    }
    return {
      [this.type]: this.items.map((item) => item.toJSON()),
    };
  }

  /**
   * Init rule from json object.
   *
   * @param json Json object.
   */
  private init(json?: RuleJson) {
    let items: Array<RuleItemJson> = [];

    if (this.isRuleJsonSimplified(json)) {
      if (json?.or && json?.and) {
        throw new Error('Rule: simplify rule can only have on property ("and" / "or")');
      }

      this.type = json?.or ? 'or' : 'and';

      items = json.or || json.and || [];
    }

    if (this.isRuleJsonStructured(json)) {
      this.type = json.relation;

      items = json.conditions || [];
    }
  
    this.items = items.map((item) => {
      if (this.isRule(item)) {
        return new Rule(item, this.engine);
      } else {
        return new Condition(item, this.engine);
      }
    });
  }

  /**
   * Identifies if a json object is a simplified spec rule.
   *
   * @param json Object to check.
   */
  private isRuleJsonSimplified(json: RuleItemJson): json is RuleJsonSimplified {
    return Array.isArray((json as RuleJsonSimplified)?.and) || Array.isArray((json as RuleJsonSimplified)?.or);
  }

  /**
   * Identifies if a json object is a default spec rule.
   *
   * @param json Object to check.
   */
  private isRuleJsonStructured(json: RuleItemJson): json is RuleJsonStructured {
    return !!(json as RuleJsonStructured)?.relation;
  }

  /**
   * Identifies if a json object is a rule or a condition.
   *
   * @param json Object to check.
   */
  private isRule(json: RuleItemJson): json is RuleJson {
    return this.isRuleJsonSimplified(json) || this.isRuleJsonStructured(json);
  }
}
