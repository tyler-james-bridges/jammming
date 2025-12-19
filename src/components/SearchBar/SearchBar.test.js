import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  let container = null;
  let root = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root.unmount();
      });
    }
    container.remove();
    container = null;
    root = null;
  });

  it('renders without crashing', () => {
    const mockOnSearch = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<SearchBar onSearch={mockOnSearch} />);
    });
  });

  it('calls onSearch when search button is clicked', () => {
    const mockOnSearch = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<SearchBar onSearch={mockOnSearch} />);
    });

    const input = container.querySelector('input');
    const button = container.querySelector('.SearchButton');

    // Simulate user typing - need to use Object.getOwnPropertyDescriptor to trigger React
    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(input, 'test search');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Click search button
    act(() => {
      button.click();
    });

    expect(mockOnSearch).toHaveBeenCalled();
  });

  it('calls onSearch when Enter key is pressed', () => {
    const mockOnSearch = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<SearchBar onSearch={mockOnSearch} />);
    });

    const input = container.querySelector('input');

    // Simulate user typing
    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(input, 'test search');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Press Enter key - create custom event with key property
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true
      });
      input.dispatchEvent(event);
    });

    expect(mockOnSearch).toHaveBeenCalled();
  });

  it('has correct placeholder text', () => {
    const mockOnSearch = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<SearchBar onSearch={mockOnSearch} />);
    });

    const input = container.querySelector('input');
    expect(input.placeholder).toBe('Enter A Song, Album, or Artist');
  });
});
