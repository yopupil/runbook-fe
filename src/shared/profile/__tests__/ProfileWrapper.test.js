import React from 'react';

import { shallow } from 'enzyme';
import ProfileWrapper from '../ProfileWrapper';

const PROFILE = { name: 'Hello' };

describe('UserProfile component', () => {
  test('Renders nothing until data is fetched', () => {
    // Render a checkbox with label in the document
    const userProfileComponent = shallow(<ProfileWrapper profile={null} />);
    expect(userProfileComponent.find('span').length).toBe(1);
    expect(userProfileComponent.find('span').text()).toBeFalsy();
  });

  test('Renders children when data is fetched', () => {
    // Render a checkbox with label in the document
    const userProfileComponent = shallow(
      <ProfileWrapper profile={PROFILE}>
        <p>hello</p>
      </ProfileWrapper>
    );
    expect(userProfileComponent.find('p').length).toBe(1);
    expect(userProfileComponent.find('p').text()).toEqual('hello');
  });
});
