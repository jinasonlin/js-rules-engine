import { Engine } from './engine';
import { ConditionJson, EvaluateResult } from './interfaces';
import { Operator } from './operator';

/**
 * Condition.
 */
export class Condition {
  constructor(config: ConditionJson, engine: Engine) {
    this.init(config, engine);
  }

  /**
   * Condition fact.
   */
  private fact: string;

  /**
   * Condition operator.
   */
  private operatorName: string;
  private get operator(): Operator {
    return this.engine.getOperator(this.operatorName)
  };

  /**
   * Condition resolver.
   */
  private get resolver() {
    return this.engine.getResolver(this.fact)
  };

  /**
   * Condition value.
   */
  private value: any;

  /**
   * Condition value.
   */
  private type?: any;

  /**
   * Condition message.
   */
  private message: string;

  /**
   * Engine instance.
   */
  private engine: Engine;

  /**
   * Evaluate a rule's conditions against the provided data.
   *
   * @param data Data object to use.
   */
  evaluate(data: Record<string, unknown>): EvaluateResult {
    const factValue = this.resolver(data, this.fact);
    const result = this.operator.evaluate(factValue, this.value, this.type);
    return result ? { result } : { result, message: this.message};
  }

  /**
   * To json.
   */
  toJSON(): ConditionJson {
    return {
      fact: this.fact,
      operator: this.operatorName,
      value: this.value,
      type: this.type,
    };
  }

  /**
   * Init condition from configuration object.
   *
   * @param json Json object.
   * @param engine Engine instance to use.
   */
  private init(json: ConditionJson, engine: Engine) {
    if (!engine) {
      throw new Error('Condition: constructor requires engine instance');
    }

    this.engine = engine;

    if (!json) {
      throw new Error('Condition: constructor requires object');
    }

    if (!json.fact) {
      throw new Error('Condition: "fact" property is required');
    }

    if (!json.operator) {
      throw new Error('Condition: "operator" property is required');
    }

    this.fact = json.fact;
    this.operatorName = json.operator;
    this.value = json.value;
    this.type = json.type;
    this.message = json.message;
  }
}
