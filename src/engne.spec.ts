import { defaultOperators } from './default-operators';
import { Engine } from './engine';
import { Operator } from './operator';
import { get } from './utils';

describe('Engine class', () => {
  describe('addOperator method', () => {
    it('should add operator', () => {
      const engine = new Engine();
      const operator = new Operator('noop', () => true);
      engine.addOperator(operator);
      expect((engine as any).operators.length).toEqual(
        defaultOperators.length + 1
      );
    });

    it('should throw error if operator already exists', () => {
      const engine = new Engine();
      const operator = new Operator('equals', () => true);
      expect(() => engine.addOperator(operator)).toThrowError();
    });
  });

  describe('removeOperator method', () => {
    it('should remove operator', () => {
      const engine = new Engine();
      engine.removeOperator('notEquals');
      expect((engine as any).operators.length).toEqual(
        defaultOperators.length - 1
      );
    });

    it('should no nothing if operator does not exists', () => {
      const engine = new Engine();
      engine.removeOperator('404');
      expect((engine as any).operators.length).toEqual(defaultOperators.length);
    });
  });

  describe('getOperator method', () => {
    it('should return operator', () => {
      const engine = new Engine();
      const operator = engine.getOperator('equals');
      expect(operator).toBeDefined();
    });

    it('should throw error if operator does not exists', () => {
      const engine = new Engine();
      expect(() => engine.getOperator('404')).toThrowError();
    });
  });

  describe('default resolver', () => {
    it('should return default resolver', () => {
      const engine = new Engine();
      expect(engine.getResolver('noop')).toEqual(get);
    });

    it('shoud set default reslove', () => {
      const reslover = () => 'noop';
      const engine = new Engine();
      engine.setDefaultResolver(reslover);
      expect((engine as any).resolver).toEqual(reslover);
      expect(engine.getResolver('noop')).toEqual(reslover);
    });

    it('shoud reset default reslove', () => {
      const reslover = () => 'noop';
      const engine = new Engine();
      engine.setDefaultResolver(reslover);
      engine.resetDefaultResolver();
      expect((engine as any).resolver).toEqual(undefined);
      expect(engine.getResolver('noop')).toEqual(get);
    });
  });

  describe('extra resolver', () => {
    it('shoud add reslove', () => {
      const reslover = () => 'noop';
      const engine = new Engine();
      engine.addResolver('noop', reslover);
      expect((engine as any).resolvers.noop).toEqual(reslover);
      expect(engine.getResolver('noop')).toEqual(reslover);
      expect(engine.getResolver('unknown')).toEqual(get);
    });

    it('shoud remove reslove', () => {
      const reslover = () => 'noop';
      const engine = new Engine();
      engine.addResolver('noop', reslover);
      engine.removeResolver('noop');
      expect((engine as any).resolvers).toEqual({});
      expect(engine.getResolver('noop')).toEqual(get);
    });
  });
});
