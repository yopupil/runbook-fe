/**
 * @module runtime
 */

import React from 'react';
import PropTypes from 'prop-types';
import { classNames as cx } from 'utils/DOMUtils';
import { RuntimeStatus } from 'modules/runtime/Constants';

import './RuntimeView.component.css';

/**
 * The props passed on RuntimeView component
 *
 * @type {Object} RuntimeViewPropTypes
 */
const RuntimeViewPropTypes = {
  /**
   * @type {String} name The name of the runtime
   */
  name: PropTypes.string.isRequired,
  /**
   * @type {String} status The current runtime status @see {@link RuntimeStatus}
   */
  status: PropTypes.oneOf([
    RuntimeStatus.PENDING,
    RuntimeStatus.READY,
    RuntimeStatus.ERROR,
    RuntimeStatus.UNKNOWN
  ]).isRequired,
  /**
   * @type {String[]} Array of runtime logs
   */
  logs: PropTypes.arrayOf(PropTypes.string)
};

/**
 * A RuntimeView function renders the state of the runtime along with any logs
 * from the runtime. If the runtime disconnects, it will show that status to the user.
 *
 * @class RuntimeView
 * @param {RuntimeViewPropTypes} props Component props
 */
export default function RuntimeView (props) {
  const { name, status, logs } = props;
  const statusClass = RuntimeView.classMap[status];
  return (
    <div className='runtime-view'>
      <label className='runtime-view__title'>{name}</label>
      <i
        className={cx(
          'zmdi zmdi-circle-o',
          'runtime-view__status',
          statusClass && 'runtime-view__status--' + statusClass
        )}
      />
      <pre className='runtime-view__logs'>{logs.join('\n')}</pre>
    </div>
  );
}

RuntimeView.classMap = {
  [RuntimeStatus.PENDING]: RuntimeStatus.PENDING,
  [RuntimeStatus.ERROR]: RuntimeStatus.ERROR,
  [RuntimeStatus.UNKNOWN]: RuntimeStatus.UNKNOWN,
  [RuntimeStatus.READY]: RuntimeStatus.READY
};

RuntimeView.propTypes = RuntimeViewPropTypes;

RuntimeView.defaultProps = {
  logs: []
};
