import React from 'react';
import { shallow } from 'enzyme';
import RuntimeView from '../RuntimeView.component';
import renderer from 'react-test-renderer';

test('RuntimeView.component snapshots', () => {
  let component = renderer.create(<RuntimeView name='py3' status='pending' />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <RuntimeView name='py3' status='error' logs={['hello', 'world']} />
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <RuntimeView name='py3' status='pending' logs={['hello', 'world']} />
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('RuntimeView.component.rendering', () => {
  let component = shallow(
    <RuntimeView name='py3' status='pending' logs={['hello', 'world']} />
  );

  const label = component.find('.runtime-view__title');
  const icon = component.find('.runtime-view__status');
  const logsContainer = component.find('.runtime-view__logs');
  expect(label).toBeDefined();
  expect(label.text()).toBe('py3');
  expect(icon.hasClass('runtime-view__status--pending')).toBeTruthy();
  expect(logsContainer.text()).toBe('hello\nworld');
});
