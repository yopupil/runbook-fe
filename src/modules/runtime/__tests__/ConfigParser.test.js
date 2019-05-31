import { RuntimeConfig, parseRuntimeConfig } from '../ConfigParser';

describe('RuntimeConfig init', () => {
  test('it accepts correct parameters', () => {
    const config = new RuntimeConfig('kernel_name', 'kernel_image', 2, [
      'shell'
    ]);
    expect(config.name).toBe('kernel_name');
    expect(config.image).toBe('kernel_image');
    expect(config.version).toBe(2);
    expect(config.languages).toEqual(['shell']);
    expect(config.modes).toEqual([]);
  });

  test('sets default version to latest if not provided', () => {
    expect(new RuntimeConfig('kernel_name', 'kernel_image').version).toBe(
      'latest'
    );
  });
});

describe('RuntimeConfig validate', () => {
  test('it has a validate method', () => {
    expect(new RuntimeConfig().validate).toBeDefined();
    expect(typeof new RuntimeConfig().validate).toEqual('function');
  });

  test('it throws errors if invalid values are passed in', () => {
    expect(() => new RuntimeConfig().validate()).toThrow();
    expect(() => new RuntimeConfig('n').validate()).toThrow();
    expect(() => new RuntimeConfig('n', 'a').validate()).toThrow();
    expect(() => new RuntimeConfig('n', 'a', null).validate()).toThrow();
    expect(() => new RuntimeConfig('n', 'a', true, []).validate()).toThrow();
  });

  test('it throws errors if invalid runtime modes are passed in', () => {
    expect(() =>
      new RuntimeConfig('n', 'a', 1, ['shell'], ['p']).validate()
    ).toThrow();
    expect(new RuntimeConfig('n', 'a', 1, ['shell'], ['file']).validate()).toBe(
      true
    );
  });

  test('it returns true if config is valid', () => {
    expect(new RuntimeConfig('n', 'a', null, []).validate()).toBe(true);
    expect(new RuntimeConfig('n', 'a', 2, ['shell']).validate()).toBe(true);
  });
});

describe('RuntimeConfig serialize', () => {
  test('it should serialize to POJO', () => {
    const config = new RuntimeConfig('k', 'n', 2, ['shell']);
    expect(config.toObject()).toEqual({
      name: config.name,
      image: config.image,
      version: config.version,
      languages: config.languages,
      modes: config.modes
    });
  });
});

describe('parseRuntimeConfig', () => {
  test('it throws error if config is not a JSON stringified object', () => {
    expect(() => parseRuntimeConfig('')).toThrow();
    expect(() => parseRuntimeConfig('2')).toThrow();
    expect(() => parseRuntimeConfig(['abcd'])).toThrow();
    expect(() => parseRuntimeConfig({ k: 2 })).toThrow();
  });

  test('it throws an error if config is invalid', () => {
    expect(() => parseRuntimeConfig('{ "name": null }')).toThrow();
  });

  test('it returns correct config object if valid', () => {
    const config = new RuntimeConfig('k', 'n', 2, ['shell']);
    expect(parseRuntimeConfig(JSON.stringify(config.toObject()))).toEqual(
      config
    );
  });
});
