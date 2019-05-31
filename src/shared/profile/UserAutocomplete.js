import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import CircleText from 'shared/circle-text/CircleText';
import AnonymousUser from 'assets/images/anonymous-user.svg';
import OrganizationMemberApi from 'api/OrganizationMemberApi';
import ProfileStore from 'shared/profile/ProfileStore';
import BaseComponent from 'shared/BaseComponent';
import { getColorForName } from 'utils/Palette';
import { classNames as cx } from 'utils/DOMUtils';
import { debounce } from 'utils/OptimizationUtils';
import { logOrRaise } from 'utils/LogUtils';
import './UserAutocomplete.css';

export default class UserAutocomplete extends BaseComponent {
  // *********************************************************
  // Static properties
  // *********************************************************
  static propTypes = {
    selectedUser: PropTypes.shape({
      /**
       * The id of the user
       */
      id: PropTypes.string,
      /**
       * The name of the user
       */
      name: PropTypes.string
    }),
    /**
     * Callback function to call when an item is selected
     */
    onSelect: PropTypes.func.isRequired,
    /**
     * Boolean indicating if the field is editable
     */
    editable: PropTypes.bool,
    /**
     * A number that controls the size of the icon
     */
    size: PropTypes.number
  };

  static defaultProps = {
    selectedUser: {},
    editable: true,
    size: 30
  };

  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (props, ...args) {
    super(props, ...args);
    this.state = {
      matches: [],
      isSearchMode: props.isSearchMode,
      searchResultsLoading: false,
      searchTerm: (props.selectedUser ? props.selectedUser.name : '') || ''
    };
    this.autoBind();
    this.searchForUsers = debounce(this.searchForUsers.bind(this), 750);
  }
  // *********************************************************
  // React methods
  // *********************************************************
  componentDidUpdate (prevProps) {
    if (
      prevProps.selectedUser.id !== this.props.selectedUser.id &&
      this.props.selectedUser.name
    ) {
      this.setState({
        searchTerm: this.props.selectedUser.name || ''
      });
    }
  }

  render () {
    const { selectedUser, editable, size } = this.props;
    const {
      isSearchMode,
      errorMessage,
      matches,
      searchTerm,
      searchResultsLoading
    } = this.state;
    const name = selectedUser.name ? selectedUser.name : '';
    const nameParts = name.split(' ').map(n => n[0]);
    return (
      <div
        className={cx(
          'user-autocomplete',
          isSearchMode && 'user-autocomplete--searching'
        )}
      >
        {/*
            If there is a selected user, display a circle with letter text
           */}
        <div className='user-autocomplete__icon'>
          {editable && (
            <input
              style={{
                display: isSearchMode ? 'block' : 'none'
              }}
              className='user-autocomplete__search-input'
              value={searchTerm}
              onChange={this.setSearchTerm}
            />
          )}
          {isSearchMode &&
            (searchResultsLoading ? (
              <i className='zmdi zmdi-spinner user-autocomplete__clear-icon animated rotateOut infinite' />
            ) : selectedUser.id ? (
              <i
                className='zmdi zmdi-close-circle user-autocomplete__clear-icon'
                onClick={this.clearSelection}
              />
            ) : null)}
          {selectedUser.id && <ReactTooltip />}
          {selectedUser.id ? (
            <CircleText
              dimension={size}
              text={nameParts.join('')}
              size='small'
              data-tip={selectedUser.name}
              style={{
                background: getColorForName(selectedUser.name),
                fontSize: `${size / nameParts.length}px`,
                lineHeight: `${size + nameParts.length}px`
              }}
              onClick={this.toggleSearchMode}
            />
          ) : (
            <img
              src={AnonymousUser}
              alt='selected user'
              width={size}
              height={size}
              onClick={this.toggleSearchMode}
            />
          )}
        </div>
        {isSearchMode && (
          <ul
            className='user-autocomplete__match-list'
            style={{
              display: matches.length ? 'block' : 'none'
            }}
          >
            {errorMessage ? (
              <li className='user-autocomplete__match-list-item'>
                {errorMessage}
              </li>
            ) : (
              matches.map((match, i) => {
                const name = match.firstName + ' ' + match.lastName;
                return (
                  <li
                    key={match.id}
                    className='user-autocomplete__match-list-item'
                    onClick={this.selectMatch.bind(null, match)}
                  >
                    <CircleText
                      size='small'
                      text={name[0]}
                      style={{
                        background: getColorForName(name)
                      }}
                    />
                    <span className='user-autocomplete__match-list-item-text'>
                      {name}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    );
  }
  // *********************************************************
  // Private methods
  // *********************************************************
  toggleSearchMode () {
    if (this.props.editable) {
      this.setState({
        isSearchMode: !this.state.isSearchMode
      });
    }
  }

  setSearchTerm (event) {
    const searchTerm = event.target.value;
    this.setState({
      searchTerm
    });
    this.searchForUsers(searchTerm);
  }

  selectMatch (match) {
    this.setState({
      isSearchMode: false,
      matches: []
    });
    this.props.onSelect(match);
  }

  clearSelection () {
    this.setState({
      searchTerm: '',
      isSearchMode: false
    });
    this.props.onSelect({
      id: null
    });
  }

  async searchForUsers (searchString) {
    const { currentOrganization } = ProfileStore.getProfile() || {};
    if (currentOrganization) {
      try {
        this.setState({
          searchResultsLoading: true
        });
        let members = await OrganizationMemberApi.searchMembers(
          currentOrganization.id,
          searchString
        );
        // Enforce match after delayed lookup
        if (searchString === this.state.searchTerm) {
          this.setState({
            matches: members,
            searchResultsLoading: false
          });
        }
      } catch (e) {
        logOrRaise(e);
        this.setState({
          errorMessage: 'Error! Please retry',
          searchResultsLoading: false
        });
      }
    }
  }
}
