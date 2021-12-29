import { Condition } from './condition';
import { defaultEngine } from './default-engine';
import { Engine } from './engine';
import { ConditionJson, RuleJson, RuleType, EvaluateResult } from './interfaces';

/**
 * Rule.
 */
export class Rule {
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
   * Add a condition.
   *
   * @param fact Property name or dot notation path.
   * @param operator Name of operator to use.
   * @param value Value to compare.
   */
  add(fact: string, operator: string, value: any) {
    this.items.push(new Condition({ fact, operator, value }, this.engine));
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
  toJSON(): RuleJson {
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
    const hasOr = Object.prototype.hasOwnProperty.call(json, 'or');
    const hasAnd = Object.prototype.hasOwnProperty.call(json, 'and');

    if (hasOr && hasAnd) {
      throw new Error('Rule: can only have on property ("and" / "or")');
    }

    const items = json.or || json.and || [];

    this.type = hasOr ? 'or' : 'and';
    this.items = items.map((item) => {
      if (this.isRule(item)) {
        return new Rule(item, this.engine);
      } else {
        return new Condition(item, this.engine);
      }
    });
  }

  /**
   * Identifies if a json object is a rule or a condition.
   *
   * @param json Object to check.
   */
  private isRule(json: RuleJson | ConditionJson): json is RuleJson {
    return (
      Object.prototype.hasOwnProperty.call(json, 'and') ||
      Object.prototype.hasOwnProperty.call(json, 'or')
    );
  }
}
