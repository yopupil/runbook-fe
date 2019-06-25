import React from 'react';
import { shallow } from 'enzyme';
import CellTypeDropdown from '../CellTypeDropdown.component';
import renderer from 'react-test-renderer';

function NOOP () {}

test('CellTypeDropdown.component snapshots', () => {
  let component = renderer.create(
    <CellTypeDropdown
      name='test'
      selections={['a', 'b']}
      selectedItem={'a'}
      onSelect={NOOP}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(<CellTypeDropdown name='test' onSelect={NOOP} />);
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <CellTypeDropdown
      name='test'
      selections={['a', 'b']}
      selectedItem={'a'}
      labelAccessor={d => 'Label::' + d}
      onSelect={NOOP}
    />
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('CellTypeDropdown.component.rendering', () => {
  let component = shallow(
    <CellTypeDropdown
      name='test'
      selections={['a', 'b']}
      selectedItem={'a'}
      labelAccessor={d => 'Label::' + d}
      onSelect={NOOP}
    />
  );

  const LIST_SELECTOR = 'ul.cell-type-dropdown__list';
  const LIST_ITEM_SELECTOR = 'li.cell-type-dropdown__list-item';
  const collapsedLabel = component.find('CollapsedLabel');

  expect(collapsedLabel.length).toEqual(1);
  expect(
    collapsedLabel.find({
      text: 'Label::a'
    }).length
  ).toEqual(1);

  // dropdpown is closed by default
  expect(component.find(LIST_SELECTOR).length).toEqual(0);

  collapsedLabel.simulate('click');

  const list = component.find(LIST_SELECTOR);

  expect(list.length).toEqual(1);

  // All items are shown
  const matches = component.find(LIST_ITEM_SELECTOR);
  expect(matches.length).toEqual(3);
  expect(matches.first().text()).toBe('test');

  expect(matches.at(1).text()).toBe('Label::a');
  expect(matches.at(2).text()).toBe('Label::b');

  // Trigger click inside
  list.simulate('click');

  expect(component.find(LIST_SELECTOR).length).toEqual(1);
});
