import get from './get';

describe('get methods', () => {
  const obj: any = {
    foo: 'bar',
    state: {
      name: 'New York',
    },
    fruit: [
      {
        type: 'Apple',
        color: 'red',
        color2: 'green',
        color3: null,
      },
      {
        type: 'Mango',
        color: 'orange',
        color2: 'yellow',
        color3: 'gray',
        color4: 'black',
      },
    ],
    bad: [undefined, null]
  };

  it('should return the shallow value when present', () => {
    const value: any = get(obj, 'foo');
    expect(value).toEqual('bar');
  });

  it('should return the nested value when present', () => {
    const value: any = get(obj, 'state.name');
    expect(value).toEqual('New York');
  });

  it('should return the array value when present', () => {
    const value: any = get(obj, 'fruit[0].type');
    expect(value).toEqual('Apple');
  });

  it('should return an array of values when present', () => {
    const value: string[] = get(obj, 'fruit[*].color');
    expect(value).toEqual(['red', 'orange']);
  });

  it('should return an array of values when present with digit', () => {
    const value: string[] = get(obj, 'fruit[*].color2');
    expect(value).toEqual(['green', 'yellow']);
  });

  it('should return an array of values when present with null', () => {
    const value: string[] = get(obj, 'fruit[*].color3');
    expect(value).toEqual([null, 'gray']);
  });

  it('should return an array of values when present with undefined', () => {
    const value: string[] = get(obj, 'fruit[*].color4');
    expect(value).toEqual([undefined, 'black']);
  });

  it('should return an array of values when present with bad', () => {
    const value: string[] = get(obj, 'bad[*].color4');
    expect(value).toEqual([undefined, undefined]);
  });

  it('should return undefined when value not present', () => {
    const value: any = get(obj, 'state.capital');
    expect(value).toEqual(undefined);
  });

  it('should return default value when not present', () => {
    const value: any = get(obj, 'state.population.total', 'not found');
    expect(value).toEqual('not found');
  });

  it('should return default value when error data', () => {
    const value: any = get('', '', 'not found');
    expect(value).toEqual('not found');
  });

  it('should prevent getting prototype', () => {
    const value: any = get(obj, '__proto__');
    expect(value).toBeUndefined();
  });

  it('should get array length', () => {
    const value: any = get(obj, 'fruit.length');
    expect(value).toEqual(2);
  });
});