import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { connect } from 'react-redux';

import BaseComponent from 'shared/BaseComponent';
import { createKernelAction } from 'actions/KernelActionCreators';
import './CommandStyles.css';

const STATUS_COLORS = {
  ready: '#0be40b',
  pending: 'orange',
  error: 'red'
};

/**
 * A command that starts the kernel for a user
 */
class StartKernelCommand extends BaseComponent {
  // *********************************************************
  // Static methods
  // *********************************************************
  static propTypes = {
    /**
     * The id of the notebook in which kernel must be created
     */
    notebookId: PropTypes.string.isRequired,
    /**
     * Array of kernels available in the notebook
     */
    kernels: PropTypes.arrayOf(PropTypes.object),
    /**
     * Array of kernel definitions
     */
    kernelDefinitions: PropTypes.arrayOf(
      PropTypes.shape({
        // Unique name of kernel. Name must be unique across notebook
        name: PropTypes.string.isRequired,
        // The docker image to use
        image: PropTypes.string,
        // The tag/version of the docker image
        version: PropTypes.version
      })
    ),
    /**
     * Method to create a new kernel based on config
     */
    createKernel: PropTypes.func.isRequired
  };

  static defaultProps = {
    kernels: [],
    kernelDefinitions: []
  };

  /**
   * Validate a kernel definition configuration
   * @param  {String | Object} config The kernel definition config
   * @param  {Array} kernels   The list of kernels available in notebook
   * @return {Object}          Object form of configuration
   */
  _validateConfig (config, kernels) {
    if (typeof config === 'object') {
      if (!config.image) {
        throw new Error(
          'Invalid image supplied. Kernel definitions must supply an image option'
        );
      }
      if (!config.version) {
        throw new Error(
          'Image version is valid. Kernel definitions must supply an image version to use.'
        );
      }
      if (!config.name) {
        throw new Error('Kernels must have a unique name across notebook');
      }
    } else {
      throw new Error(
        'Kernel definition must be an object with keys: name, image, version'
      );
    }
    return {
      name: config.name,
      image: config.image,
      version: config.version,
      supportedLanguages: config.supportedLanguages
    };
  }

  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (...args) {
    super(...args);
    this.state = {
      errors: []
    };
    this.autoBind();
  }

  // *********************************************************
  // React methods
  // *********************************************************
  createKernels () {
    let { notebookId, kernelDefinitions, kernels } = this.props;
    let errors = [];

    kernelDefinitions.forEach((kernelDefinition, i) => {
      try {
        this._validateConfig(kernelDefinition, kernels);
      } catch (e) {
        errors[i] = String(e);
      }
    });

    if (errors.filter(Boolean).length) {
      return this.setState({
        errors
      });
    }

    kernelDefinitions.map(d =>
      this.props.createKernel({
        notebookId,
        config: d
      })
    );
  }

  // *********************************************************
  // React methods
  // *********************************************************
  componentDidMount () {
    this.createKernels();
  }

  componentDidUpdate (prevProps) {
    if (
      JSON.stringify(prevProps.kernelDefinitions) !==
      JSON.stringify(this.props.kernelDefinitions)
    ) {
      this.createKernels();
    }
  }

  render () {
    let { errors } = this.state;
    const { kernels, kernelDefinitions } = this.props;
    // Render
    const kernelsOfInterest = kernels.filter(k =>
      kernelDefinitions.find(kd => kd.name === k.name)
    );
    const hasErrors = errors.filter(Boolean).length > 0;
    return (
      <div>
        {hasErrors ? (
          <pre>
            {kernelDefinitions.map((k, i) => {
              if (errors[i]) {
                return (
                  <span key={i} className='command-error-message'>
                    {errors[i]}
                  </span>
                );
              }
              return <span key={i} />;
            })}
          </pre>
        ) : (
          this.getTabs(kernelsOfInterest)
        )}
      </div>
    );
  }

  getTabs (kernelsOfInterest) {
    return (
      <Tabs>
        <TabList>
          {kernelsOfInterest.map((k, i) => (
            <Tab key={k.id}>
              <label className='command-kernel-title'>
                {k.name}
                <i
                  data-tip={k.status}
                  className='zmdi zmdi-circle'
                  style={{
                    color: STATUS_COLORS[k.status]
                  }}
                />
              </label>
            </Tab>
          ))}
        </TabList>
        {kernelsOfInterest.map((k, i) => (
          <TabPanel key={k.id}>
            <ul className='command-log-message-list'>
              <pre>{k.logs.join('\n')}</pre>
              {/*k.logs.map((log, j) => {
                return <li key={j} className='command-log-message'>{log}</li>
              })*/}
            </ul>
          </TabPanel>
        ))}
      </Tabs>
    );
  }
}

export default connect(
  (state, { notebookId }) => ({
    kernels: state.notebooks[notebookId].kernelIds.map(
      kId => state.kernels[kId]
    )
  }),
  dispatch => ({
    createKernel (...args) {
      dispatch(createKernelAction(...args));
    }
  })
)(StartKernelCommand);
