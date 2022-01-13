import { person } from '../test/mock-data';
import { Condition } from './condition';
import { RuleJson } from './interfaces';
import { Rule } from './rule';
import { Engine } from './engine';

describe('Rule class', () => {
  describe('constructor', () => {
    it('should hydrate correctly', () => {
      const json: RuleJson = {
        and: [
          {
            fact: 'name',
            operator: 'equals',
            value: 'Luke Skywalker',
          },
          {
            or: [
              {
                fact: 'height',
                operator: 'lessThan',
                value: 200,
              },
              {
                fact: 'height',
                operator: 'greaterThan',
                value: 100,
              },
            ],
          },
        ],
      };
      const rule = new Rule(json) as any;
      expect(rule.type).toEqual('and');
      expect(rule.items.length).toEqual(2);
      expect(rule.items[0] instanceof Condition).toEqual(true);
      expect(rule.items[1] instanceof Rule).toEqual(true);
      expect(rule.items[1].type).toEqual('or');
      expect(rule.items[1].items.length).toEqual(2);
      expect(rule.items[1].items[0] instanceof Condition).toEqual(true);
      expect(rule.items[1].items[1] instanceof Condition).toEqual(true);
    });

    it('should hydrate correctly - structured', () => {
      const json: RuleJson = {
        relation: 'and',
        conditions: [
          {
            fact: 'name',
            operator: 'equals',
            value: 'Luke Skywalker',
          },
          {
            relation: 'or',
            conditions: [
              {
                fact: 'height',
                operator: 'lessThan',
                value: 200,
              },
              {
                fact: 'height',
                operator: 'greaterThan',
                value: 100,
              },
            ],
          },
        ],
      };
      const rule = new Rule(json) as any;
      expect(rule.type).toEqual('and');
      expect(rule.items.length).toEqual(2);
      expect(rule.items[0] instanceof Condition).toEqual(true);
      expect(rule.items[1] instanceof Rule).toEqual(true);
      expect(rule.items[1].type).toEqual('or');
      expect(rule.items[1].items.length).toEqual(2);
      expect(rule.items[1].items[0] instanceof Condition).toEqual(true);
      expect(rule.items[1].items[1] instanceof Condition).toEqual(true);
    });

    it('should coverage boundary', () => {
      const json: RuleJson = {
        and: [],
        or: [],
      };
      expect(() => { new Rule(json) }).toThrow();

      const empty: RuleJson = {};
      const rule = new Rule(empty) as any;
      expect(rule.type).toEqual('and');
    });
  });

  describe('equals method', () => {
    it('should evaluate true when value equals fact', () => {
      const rule = new Rule().equals('name', 'Luke Skywalker');
      expect(rule.evaluate(person)).toEqual({ result: true });
    });
  });

  describe('notEquals method', () => {
    it('should evaluate false when value equals fact', () => {
      const rule = new Rule().notEquals('name', 'Luke Skywalker');
      expect(rule.evaluate(person)).toEqual({ result: false });
    });
  });

  describe('in method', () => {
    it('should evaluate true when value is in fact', () => {
      const rule = new Rule().in('name', 'Luke Skywalker Legends');
      expect(rule.evaluate(person)).toEqual({ result: true });
    });
  });

  describe('notIn method', () => {
    it('should evaluate false when value is in fact', () => {
      const rule = new Rule().notIn('name', 'Luke Skywalker Legends');
      expect(rule.evaluate(person)).toEqual({ result: false });
    });
  });

  describe('contains method', () => {
    it('should evaluate true when value contains fact', () => {
      const rule = new Rule().contains('vehicles', 'Snowspeeder');
      expect(rule.evaluate(person)).toEqual({ result: true });
    });
  });

  describe('notContains method', () => {
    it('should evaluate false when value contains fact', () => {
      const rule = new Rule().notContains('vehicles', 'Snowspeeder');
      expect(rule.evaluate(person)).toEqual({ result: false });
    });
  });

  describe('lessThan method', () => {
    it('should evaluate true when value is less than fact', () => {
      const rule = new Rule().lessThan('height', 200);
      expect(rule.evaluate(person)).toEqual({ result: true });
    });
  });

  describe('lessThanOrEquals method', () => {
    it('should evaluate true when value is less than fact', () => {
      const rule = new Rule().lessThanOrEquals('height', 200);
      expect(rule.evaluate(person)).toEqual({ result: true });
    });

    it('should evaluate true when value equals fact', () => {
      const rule = new Rule().lessThanOrEquals('height', 200);
      expect(rule.evaluate(person)).toEqual({ result: true });
    });
  });

  describe('greaterThan method', () => {
    it('should evaluate true when value is greater than fact', () => {
      const rule = new Rule().greaterThan('height', 100);
      expect(rule.evaluate(person)).toEqual({ result: true });
    });
  });

  describe('greaterThanOrEquals method', () => {
    it('should evaluate true when value is greater than fact', () => {
      const rule = new Rule().greaterThanOrEquals('height', 100);
      expect(rule.evaluate(person)).toEqual({ result: true });
    });

    it('should evaluate true when value equals fact', () => {
      const rule = new Rule().greaterThanOrEquals('height', 172);
      expect(rule.evaluate(person)).toEqual({ result: true });
    });
  });

  describe('between method', () => {
    it('should evaluate true when fact is between value', () => {
      const rule = new Rule().between('height', [170, 180]);
      expect(rule.evaluate(person)).toEqual({ result: true });
    });
  });

  describe('matchRegExp method', () => {
    it('should evaluate true when value is match RegExp in fact', () => {
      const rule = new Rule().matchRegExp('eyeColor', '^bl');
      expect(rule.evaluate(person)).toEqual({ result: true });
    });
  });

  describe('notMatchRegExp method', () => {
    it('should evaluate true when value is not match RegExp is in fact', () => {
      const rule = new Rule().notMatchRegExp('eyeColor', '^re');
      expect(rule.evaluate(person)).toEqual({ result: true });
    });
  });

  describe('and method', () => {
    it('should evaluate true when all conditions are true', () => {
      const rule = new Rule().and((item) => {
        item.equals('name', 'Luke Skywalker').equals('eyeColor', 'blue');
      });

      expect(rule.evaluate(person)).toEqual({ result: true });
    });

    it('should evaluate false when any conditions are false', () => {
      const rule = new Rule().and((item) => {
        item.equals('name', 'Luke Skywalker').equals('eyeColor', 'green');
      });

      expect(rule.evaluate(person)).toEqual({ result: false });
    });
  });

  describe('or method', () => {
    it('should evaluate true when any condition is true', () => {
      const rule = new Rule().or((item) => {
        item.equals('name', 'Luke Skywalker').equals('eyeColor', 'green');
      });

      expect(rule.evaluate(person)).toEqual({ result: true });
    });

    it('should evaluate false when no conditions are true', () => {
      const rule = new Rule().or((item) => {
        item.equals('name', 'Han Solo').equals('eyeColor', 'green');
      });

      expect(rule.evaluate(person)).toEqual({ result: false });
    });
  });

  it('complex rules should evaluate correctly', () => {
    const rule = new Rule().equals('homeWorld.name', 'Tatooine').or((sub) => {
      sub.contains('name', 'Skywalker').equals('eyeColor', 'green');
    });

    expect(rule.evaluate(person)).toEqual({ result: true });
  });

  describe('toJSON method', () => {
    it('should stringify correctly', () => {
      const rule = new Rule().equals('name', 'Luke Skywalker');
      const result = JSON.stringify(rule);

      expect(result).toEqual(
        '{"and":[{"fact":"name","operator":"equals","value":"Luke Skywalker"}]}'
      );
    });

    it('should nest rule stringify correctly', () => {
      const rule = new Rule().and((sub) => {
        sub.contains('name', 'Skywalker').equals('eyeColor', 'green');
      });
      const result = JSON.stringify(rule);

      expect(result).toEqual(
        '{"and":[{"and":[{"fact":"name","operator":"contains","value":"Skywalker"},{"fact":"eyeColor","operator":"equals","value":"green"}]}]}'
      );
    });
  });

  describe('run case', () => {
    it('should return faulse and message', () => {
      const rule = new Rule({
        and: [
          {
            fact: 'name',
            operator: 'equals',
            value: 'Luke Skywalker',
            message: 'unknown',
          },
        ],
      });
      const { result, message } = rule.evaluate({ name: 'R2' });

      expect(result).toEqual(false);
      expect(message).toEqual('unknown');
    });

    it('should return faulse and message - structured', () => {
      const rule = new Rule({
        relation: 'and',
        conditions: [
          {
            fact: 'name',
            operator: 'equals',
            value: 'Luke Skywalker',
            message: 'unknown',
          },
        ],
      });
      const { result, message } = rule.evaluate({ name: 'R2' });

      expect(result).toEqual(false);
      expect(message).toEqual('unknown');
    });

    it('should return true', () => {
      const engine = new Engine();
      engine.addResolver('key', (obj) => obj.name);
      const rule = new Rule(
        {
          and: [
            {
              fact: 'key',
              operator: 'equals',
              value: 'Luke Skywalker',
            },
          ],
        },
        engine
      );
      const { result } = rule.evaluate({ name: 'Luke Skywalker' });

      expect(result).toEqual(true);
    });

    

    it('should return true - structured', () => {
      const engine = new Engine();
      engine.addResolver('key', (obj) => obj.name);
      const rule = new Rule(
        {
          relation: 'and',
          conditions: [
            {
              fact: 'name',
              operator: 'equals',
              value: 'Luke Skywalker',
              message: 'unknown',
            },
          ],
        },
        engine
      );
      const { result } = rule.evaluate({ name: 'Luke Skywalker' });

      expect(result).toEqual(true);
    });
  });
});
