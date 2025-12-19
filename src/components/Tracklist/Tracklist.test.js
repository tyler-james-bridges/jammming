import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import Tracklist from './Tracklist';

const mockTracks = [
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

describe('Tracklist Component', () => {
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
      root.render(<Tracklist tracks={mockTracks} onAdd={mockOnAdd} isRemoval={false} />);
    });
  });

  it('renders correct number of tracks', () => {
    const mockOnAdd = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<Tracklist tracks={mockTracks} onAdd={mockOnAdd} isRemoval={false} />);
    });

    const tracks = container.querySelectorAll('.Track');
    expect(tracks.length).toBe(2);
  });

  it('renders empty list when no tracks provided', () => {
    const mockOnAdd = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<Tracklist tracks={[]} onAdd={mockOnAdd} isRemoval={false} />);
    });

    const tracks = container.querySelectorAll('.Track');
    expect(tracks.length).toBe(0);
  });

  it('passes isRemoval prop to Track components', () => {
    const mockOnRemove = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<Tracklist tracks={mockTracks} onRemove={mockOnRemove} isRemoval={true} />);
    });

    // Check that all buttons show - (remove) instead of + (add)
    const buttons = container.querySelectorAll('.Track-action');
    buttons.forEach(button => {
      expect(button.textContent).toBe('-');
    });
  });
});
