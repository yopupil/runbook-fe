import React from 'react';
import PropTypes from 'prop-types';

import BaseComponent from 'shared/BaseComponent';
import './CodeFileInput.css';

export default class CodeFileInput extends BaseComponent {
  // *********************************************************
  // Static properties
  // *********************************************************
  static propTypes = {
    /**
     * The default value to use
     */
    title: PropTypes.string,
    /**
     * Callback function to call when value changes (debounced)
     */
    onChange: PropTypes.func.isRequired
  };
  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (...args) {
    super(...args);
    this.autoBind();
  }
  // *********************************************************
  // React methods
  // *********************************************************
  componentDidUpdate (prevProps) {
    if (prevProps.title !== this.props.title) {
      this.titleInput.value = this.props.title;
    }
  }

  render () {
    const { title } = this.props;
    return (
      <div className='code-file-title'>
        <input
          ref={el => (this.titleInput = el)}
          className='code-file-title__input'
          defaultValue={title}
          onChange={this.handleTitleChange}
        />
      </div>
    );
  }

  // *********************************************************
  // Properties
  // *********************************************************
  handleTitleChange (e) {
    if (!this.titleInput) {
      return;
    }
    const value = this.titleInput.value;
    let type = 'title';
    if (value.slice(0, 7) === 'file://') {
      type = 'file';
    }
    this.props.onChange({
      type,
      value
    });
  }
}
