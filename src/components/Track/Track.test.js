import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import Track from './Track';

const mockTrack = {
  id: '1',
  name: 'Test Song',
  artist: 'Test Artist',
  album: 'Test Album',
  uri: 'spotify:track:1'
};

describe('Track Component', () => {
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
      root.render(<Track track={mockTrack} onAdd={mockOnAdd} isRemoval={false} />);
    });
  });

  it('displays track information correctly', () => {
    const mockOnAdd = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<Track track={mockTrack} onAdd={mockOnAdd} isRemoval={false} />);
    });

    const trackName = container.querySelector('h3');
    const trackInfo = container.querySelector('p');

    expect(trackName.textContent).toBe('Test Song');
    expect(trackInfo.textContent).toContain('Test Artist');
    expect(trackInfo.textContent).toContain('Test Album');
  });

  it('shows + button when isRemoval is false', () => {
    const mockOnAdd = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<Track track={mockTrack} onAdd={mockOnAdd} isRemoval={false} />);
    });

    const button = container.querySelector('.Track-action');
    expect(button.textContent).toBe('+');
  });

  it('shows - button when isRemoval is true', () => {
    const mockOnRemove = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<Track track={mockTrack} onRemove={mockOnRemove} isRemoval={true} />);
    });

    const button = container.querySelector('.Track-action');
    expect(button.textContent).toBe('-');
  });

  it('calls onAdd when + button is clicked', () => {
    const mockOnAdd = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<Track track={mockTrack} onAdd={mockOnAdd} isRemoval={false} />);
    });

    const button = container.querySelector('.Track-action');
    act(() => {
      button.click();
    });

    expect(mockOnAdd).toHaveBeenCalledWith(mockTrack);
  });

  it('calls onRemove when - button is clicked', () => {
    const mockOnRemove = jest.fn();
    act(() => {
      root = createRoot(container);
      root.render(<Track track={mockTrack} onRemove={mockOnRemove} isRemoval={true} />);
    });

    const button = container.querySelector('.Track-action');
    act(() => {
      button.click();
    });

    expect(mockOnRemove).toHaveBeenCalledWith(mockTrack);
  });
});
