/**
 * @module runtime
 */

/**
 * A class that represents a runtime configuration object. This will be parsed
 * by the backend to start isolated runtimes.
 *
 * @class
 *
 * @example
 * RunTimeConfig('py35', 'python', '3.5.1', ['shell', 'python'], ['interactive', 'file', 'endpoint'])
 */
export class RuntimeConfig {
  /**
   * @constructor
   * @param  {String} 			 name   								The unique name of the runtime
   * @param  {String} 			 image  								The image of the runtime to use, usually matches the name in docker registry
   * @param  {String|Number} [version="latest"] 		The version to use for the runtime, defaults to latest
   * @param  {Array} 				 languages							The languages supported by the runtime
   * @param  {Array}         [modes=[]]             The execution modes allowed in this runtime. Defaults to all execution modes allowed
   *                                                by runtime
   *
   */
  constructor (name, image, version, languages, modes) {
    this.name = name;
    this.image = image;
    this.version = version || 'latest';
    this.languages = languages;
    this.modes = modes || [];
  }

  _validateListOfStrings (name, allowedValues) {
    if (!Array.isArray(this[name])) {
      throw new Error(
        `\`${name}\` must be a list of available modes in the runtime`
      );
    } else if (Array.isArray(this[name])) {
      for (let element of this[name]) {
        if (typeof element !== 'string') {
          throw new Error(
            `Element ${JSON.stringify(
              element
            )} in ${name} is not of string type`
          );
        } else if (allowedValues) {
          if (allowedValues.indexOf(element) === -1) {
            throw new Error(
              `Allowed values for ${name} are ${allowedValues}. Instead got ${element}`
            );
          }
        }
      }
    }
  }

  /**
   * Validate the config provided
   * @return {Boolean} true if there are no errors
   * @throws {Error} If one of the following conditions are not met:
   *                 1. name and image must be valid strings
   *                 2. version must be a string or number
   *                 3. execution mode must be an array of strings
   *                 4. languages must be array of strings
   */
  validate () {
    ['name', 'image'].forEach(k => {
      if (!this[k]) {
        throw new Error(
          `Invalid ${k} supplied. A runtime config must always have a ${k}`
        );
      } else if (typeof this[k] !== 'string') {
        throw new Error(
          `${k} supplied to run time config must always be a string`
        );
      }
    });
    if (
      !(typeof this.version === 'string' || typeof this.version === 'number')
    ) {
      throw new Error(
        'Version in runtime config must always be a number or string.'
      );
    }
    this._validateListOfStrings('modes', ['file', 'interactive', 'endpoint']);
    this._validateListOfStrings('languages');
    return true;
  }

  /**
   * Return object form of config for serialization
   * @return {Object} POJO containing properties
   */
  toObject () {
    return {
      name: this.name,
      image: this.image,
      version: this.version,
      modes: this.modes,
      languages: this.languages
    };
  }
}

/**
 * Parse runtime definition, validate and normalize the configuration
 *
 * @example
 *
 *    parseRuntimeConfig(JSON.stringify({
 *      "name": "py35",
 *       "image": "python",
 *       "version": "3.5.1",
 *       "modes": ["file", "endpoint"],
 *       "languages": ["shell", "python"]
 *    }))
 *
 *
 * @param  {String} config The configuration object in string form which must be parsed as JSON
 * @throws {Error}         If config is not a valid JSON stringified object or if config is invalid
 * @return {RuntimeConfig} The configuration object
 */
export function parseRuntimeConfig (config) {
  let parsed;
  try {
    parsed = JSON.parse(config);
  } catch (e) {
    throw new Error(
      'Invalid config supplied for parsing. Config must be a JSON stringified object'
    );
  }
  const runtimeConfig = new RuntimeConfig(
    parsed.name,
    parsed.image,
    parsed.version,
    parsed.languages,
    parsed.modes
  );
  runtimeConfig.validate();
  return runtimeConfig;
}
