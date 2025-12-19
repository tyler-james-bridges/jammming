import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import SearchResults from './SearchResults';

const mockSearchResults = [
  {
    id: '1',
    name: 'Test Song 1',
    artist: 'Test Artist 1',
    album: 'Test Album 1',
    uri: 'spotify:track:1'
  },
  {
    id: '2',
    name: 'Test Song 2',
    artist: 'Test Artist 2',
    album: 'Test Album 2',
    uri: 'spotify:track:2'
  }
];

describe('SearchResults Component', () => {
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
    const mockOnAdd = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<SearchResults searchResults={mockSearchResults} onAdd={mockOnAdd} />);
    });
  });

  it('displays "Results" heading', () => {
    const mockOnAdd = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<SearchResults searchResults={mockSearchResults} onAdd={mockOnAdd} />);
    });

    const heading = container.querySelector('h2');
    expect(heading.textContent).toBe('Results');
  });

  it('renders Tracklist with search results', () => {
    const mockOnAdd = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<SearchResults searchResults={mockSearchResults} onAdd={mockOnAdd} />);
    });

    const tracklist = container.querySelector('.Tracklist');
    expect(tracklist).toBeTruthy();

    const tracks = container.querySelectorAll('.Track');
    expect(tracks.length).toBe(2);
  });

  it('shows + buttons for adding tracks', () => {
    const mockOnAdd = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<SearchResults searchResults={mockSearchResults} onAdd={mockOnAdd} />);
    });

    const buttons = container.querySelectorAll('.Track-action');
    buttons.forEach(button => {
      expect(button.textContent).toBe('+');
    });
  });
});
