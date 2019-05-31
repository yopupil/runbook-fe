import React from 'react';

import slug from 'slug';
import BaseComponent from 'shared/BaseComponent';
import AutocompleteDropdown from 'shared/autocomplete/AutocompleteDropdown';
import './EndpointDefinitionModal.css';

export default class EndpointDefinitionModal extends BaseComponent {
  // *********************************************************
  // Static methods
  // *********************************************************
  static getDefaultArgument (config) {
    const parts = config.split('=');
    if (parts.length === 1) {
      return null;
    } else {
      return parts[1].trim() || null;
    }
  }

  static validateAndParsePathArguments (input = '') {
    let items = input
      .split(',')
      .filter(Boolean)
      .map(a => a.replace(/\s/g, ''));
    let itemDefs = [];
    const supportedTypes = ['path', 'string', 'int', 'bool'];
    for (let item of items) {
      let parts = item.split(':');
      let itemType = 'string';
      let itemName;
      let defaultValue = null;
      if (parts.length === 1) {
        // Validate default argument
        defaultValue = EndpointDefinitionModal.getDefaultArgument(
          parts[0].replace(/<|>/g, '')
        );
        if (defaultValue !== null) {
          parts[0] = parts[0].replace('=' + defaultValue, '');
        }
        itemName = slug(parts[0].replace(/<|>/g, ''), '_');
      } else {
        itemType = parts[0].replace('<', '').trim();
        defaultValue = EndpointDefinitionModal.getDefaultArgument(
          parts[1].replace(/<|>/g, '')
        );
        if (defaultValue !== null) {
          parts[1] = parts[1].replace('=' + defaultValue, '');
        }
        itemName = slug(parts[1].replace('>', '').trim(), '_');
      }
      if (supportedTypes.indexOf(itemType) === -1) {
        throw new Error(
          `${item} has invalid type. Types must be one of ${supportedTypes.join(
            ','
          )}`
        );
      }
      if (!itemName || (itemName && itemName.length === 0)) {
        throw new Error(
          `Invalid value provided : ${item}. Items must be of the form <type:name>`
        );
      }
      itemDefs.push({
        name: itemName,
        type: itemType,
        defaultValue
      });
    }
    return itemDefs
      .map(
        item =>
          `<${item.type}:${item.name}${
            item.defaultValue ? '=' + item.defaultValue : ''
          }>`
      )
      .join(',');
  }

  static validateNotEmpty (value, name) {
    if (!value || (value && value.length === 0)) {
      throw new Error(`${name} cannot be empty`);
    }
    return value;
  }

  static defaultProps = {
    endpointDefintiion: {
      method: 'GET',
      name: '',
      query: '',
      path: '',
      signature: ''
    }
  };

  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (props, ...args) {
    super(props, ...args);
    const definition = props.endpointDefinition;
    this.state = {
      ...definition,
      errors: {}
    };
    this.autoBind();
  }
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const { name, method, path, query, signature, errors } = this.state;
    return (
      <div className='endpoint-definition'>
        <form>
          <div className='row'>
            <div className='six columns'>
              <AutocompleteDropdown
                labelColumns={6}
                verticalLayout
                defaultOptions={['GET', 'POST']}
                showClear={false}
                label='Method'
                fetchMatches={() => []}
                selectedMatch={method}
                onSelect={this.handleMethodSelect}
              />
            </div>
            <div className='six columns'>
              <fieldset>
                <label
                  className='endpoint-definition__label'
                  htmlFor='endpoint-name'
                >
                  Name
                </label>
                <input
                  name='endpoint-name'
                  className='endpoint-definition__input'
                  value={name}
                  onChange={this.handleNameChange}
                />
                <span className='endpoint-definition__error-message'>
                  {errors.name}
                </span>
              </fieldset>
            </div>
          </div>
          <div className='row'>
            <div className='six columns'>
              <fieldset>
                <label
                  className='endpoint-definition__label'
                  htmlFor='endpoint-path-params'
                >
                  Path
                </label>
                <textarea
                  name='endpoint-path-params'
                  className='endpoint-definition__text-area'
                  onChange={this.handlePathParams}
                  value={path}
                />
                <span className='endpoint-definition__error-message'>
                  {errors.path}
                </span>
              </fieldset>
            </div>
            <div className='six columns'>
              <fieldset>
                <label
                  className='endpoint-definition__label'
                  htmlFor='endpoint-query-params'
                >
                  Query
                </label>
                <textarea
                  name='endpoint-query-params'
                  className='endpoint-definition__text-area'
                  onChange={this.handleQueryParams}
                  value={query}
                />
                <span className='endpoint-definition__error-message'>
                  {errors.query}
                </span>
              </fieldset>
            </div>
          </div>
          <fieldset>
            <label
              className='endpoint-definition__label'
              htmlFor='endpoint-invocation'
            >
              Signature
            </label>
            <textarea
              name='endpoint-invocation'
              className='endpoint-definition__text-area'
              onChange={this.handleEndpointInvocation}
              value={signature}
            />
            <span className='endpoint-definition__error-message'>
              {errors.signature}
            </span>
          </fieldset>
          <div className='endpoint-definition__buttons'>
            <button
              className='endpoint-definition__button'
              onClick={this.handleCancel}
            >
              Cancel
            </button>
            <button
              className='endpoint-definition__button endpoint-definition__button--primary'
              type='submit'
              onClick={this.handleSubmit}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    );
  }

  // *********************************************************
  // Private methods
  // *********************************************************
  handleMethodSelect (method) {
    // Method
    this.setState({
      method
    });
  }

  handleNameChange (event) {
    // Slufigy
    this.setState({
      name: event.target.value
    });
  }

  handlePathParams (event) {
    this.setState({
      path: event.target.value
    });
  }

  handleQueryParams (event) {
    // Comma separated values
    this.setState({
      query: event.target.value
    });
  }

  handleEndpointInvocation (event) {
    // Define how we call the endpoint
    this.setState({
      signature: event.target.value
    });
  }

  handleCancel (event) {
    event.preventDefault();
    this.props.onCancel();
  }

  handleSubmit (e) {
    e.preventDefault();
    let config = {
        method: this.state.method,
        path: this.state.path
      },
      errors = {};
    // this.validate('path', 'validateAndParsePathArguments', config, errors);
    this.validate('query', 'validateAndParsePathArguments', config, errors);
    this.validate('name', 'validateNotEmpty', config, errors);
    this.validate('signature', 'validateNotEmpty', config, errors);
    if (Object.keys(errors).length) {
      return this.setState({
        errors,
        config,
        name: slug(this.state.name || ''),
        path: config.path ? config.path : this.state.path,
        query: config.query ? config.query : this.state.query
      });
    } else {
      this.setState({
        config,
        errors: {}
      });
      // Let parent know
      this.props.onCreate(config);
      this.props.onCancel();
    }
  }

  validate (field, methodName, config = {}, errors = {}) {
    const value = this.state[field];
    try {
      config[field] = EndpointDefinitionModal[methodName](value, field);
    } catch (e) {
      errors[field] = e.message;
    }
    // Updated by reference
  }
}
