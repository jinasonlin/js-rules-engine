import { defaultOperators } from './default-operators';
import { Operator } from './operator';
import { get } from './utils';
import { ResolverFn } from './interfaces'

/**
 * Engine.
 */
export class Engine {
  constructor() {
    this.operators = [...defaultOperators];
  }

  /**
   * Registered operators.
   */
  private operators: Operator[] = [];

  /**
   * Registered resolvers.
   */
  private resolver: ResolverFn;
  private resolvers: Record<string, ResolverFn> = {};

  /**
   * Get operator by name.
   *
   * @param name Operator name.
   */
  getOperator(name: string) {
    const operator = this.operators.find((item) => item.name === name);

    if (!operator) {
      throw new Error(`Engine: operator "${name}" not found`);
    }

    return operator;
  }

  /**
   * Add an operator.
   *
   * @param operator Operator to add.
   */
  addOperator(operator: Operator) {
    const exists = this.operators.some((item) => item.name === operator.name);

    if (exists) {
      throw new Error(`Engine: operator "${operator.name}" already exists`);
    }

    this.operators.push(operator);
  }

  /**
   * Remove an operator by name.
   *
   * @param name Operator name.
   */
  removeOperator(name: string) {
    const index = this.operators.findIndex((item) => item.name === name);

    if (index !== -1) {
      this.operators.splice(index, 1);
    }
  }

  /**
   * Set default resolver.
   *
   * @param resolver Resolver to set.
   */
  setDefaultResolver(resolver: ResolverFn) {
    this.resolver = resolver;
  }

  /**
   * Reset default resolver.
   */
  resetDefaultResolver() {
    this.resolver = undefined;
  }

  /**
   * Add an resolver by name.
   *
   * @param fact resolver fact.
   * @param resolver Resolver to add.
   */
  addResolver(fact: string, resolver: ResolverFn) {
    this.resolvers[fact] = resolver;
  }

  /**
   * Remove an resolver by fact.
   *
   * @param fact resolver fact.
   */
  removeResolver(fact: string) {
    delete this.resolvers[fact]
  }

  getResolver(name: string) {
    if (this.resolvers[name]) {
      return this.resolvers[name];
    }

    if (this.resolver) {
      return this.resolver;
    }

    return get;
  }
}
