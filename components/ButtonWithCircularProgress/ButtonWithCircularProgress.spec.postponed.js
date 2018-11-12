/* eslint-env jest */
import React from 'react';

import {
  shallowWithContext,
  simpleSnapshot,
} from '../../../test/intlEnzymeHelper';

import ButtonWithCircularProgress from './ButtonWithCircularProgress';

describe('ButtonWithCircularProgress component', () => {
  test('should return button if submitting=false', () => {
    const component = (
      <ButtonWithCircularProgress
        disabled
        fullWidth
        label="Добавить статью"
        style={{
          marginTop: '16px',
          marginRight: '8px',
        }}
        submitting={false}
      />
    );
    const result = simpleSnapshot(shallowWithContext(component, 'uk'));
    const expectedResult = {
      type: 'span',
      props: {
        style: {
          position: 'relative',
        },
      },
      children: [
        {
          type: 'RaisedButton',
          props: {
            type: 'submit',
            style: {
              marginTop: '16px',
              marginRight: '8px',
            },
            label: 'Добавить статью',
            disabled: true,
            fullWidth: true,
            secondary: true,
            labelPosition: 'after',
            primary: false,
          },
          children: null,
        },
      ],
    };
    expect(result).toEqual(expectedResult);
  });
  test('should return CircularProgress if submitting=false', () => {
    const component = (
      <ButtonWithCircularProgress
        disabled
        fullWidth
        label="Добавить статью"
        style={{
          marginTop: '16px',
          marginRight: '8px',
        }}
        submitting
      />
    );
    const result = simpleSnapshot(shallowWithContext(component, 'uk'));
    const expectedResult = {
      type: 'span',
      props: {
        style: {
          position: 'relative',
        },
      },
      children: [
        {
          type: 'CircularProgress',
          props: {
            color: '#ff4081',
            style: {
              position: 'absolute',
              left: 'calc(50% - 20px)',
              top: '-8px',
            },
            mode: 'indeterminate',
            value: 0,
            min: 0,
            max: 100,
            size: 40,
            thickness: 3.5,
          },
          children: null,
        },
        {
          type: 'RaisedButton',
          props: {
            style: {
              marginTop: '16px',
              marginRight: '8px',
              visibility: 'hidden',
            },
            label: 'Добавить статью',
            fullWidth: true,
            disabled: true,
            labelPosition: 'after',
            primary: false,
            secondary: false,
          },
          children: null,
        },
      ],
    };
    expect(result).toEqual(expectedResult);
  });
});
