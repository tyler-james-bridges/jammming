import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import Playlist from './Playlist';

const mockPlaylistTracks = [
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

describe('Playlist Component', () => {
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
    const mockOnRemove = jest.fn();
    const mockOnNameChange = jest.fn();
    const mockOnSave = jest.fn();

    act(() => {
      root = createRoot(container);
      root.render(
        <Playlist
          playlistName="Test Playlist"
          playlistTracks={mockPlaylistTracks}
          onRemove={mockOnRemove}
          onNameChange={mockOnNameChange}
          onSave={mockOnSave}
        />
      );
    });
  });

  it('displays playlist name in input', () => {
    const mockOnRemove = jest.fn();
    const mockOnNameChange = jest.fn();
    const mockOnSave = jest.fn();

    act(() => {
      root = createRoot(container);
      root.render(
        <Playlist
          playlistName="My Test Playlist"
          playlistTracks={mockPlaylistTracks}
          onRemove={mockOnRemove}
          onNameChange={mockOnNameChange}
          onSave={mockOnSave}
        />
      );
    });

    const input = container.querySelector('input');
    expect(input.value).toBe('My Test Playlist');
  });

  it('calls onNameChange when playlist name is changed', () => {
    const mockOnRemove = jest.fn();
    const mockOnNameChange = jest.fn();
    const mockOnSave = jest.fn();

    act(() => {
      root = createRoot(container);
      root.render(
        <Playlist
          playlistName="Test Playlist"
          playlistTracks={mockPlaylistTracks}
          onRemove={mockOnRemove}
          onNameChange={mockOnNameChange}
          onSave={mockOnSave}
        />
      );
    });

    const input = container.querySelector('input');
    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(input, 'New Playlist Name');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(mockOnNameChange).toHaveBeenCalled();
  });

  it('renders Tracklist with playlist tracks', () => {
    const mockOnRemove = jest.fn();
    const mockOnNameChange = jest.fn();
    const mockOnSave = jest.fn();

    act(() => {
      root = createRoot(container);
      root.render(
        <Playlist
          playlistName="Test Playlist"
          playlistTracks={mockPlaylistTracks}
          onRemove={mockOnRemove}
          onNameChange={mockOnNameChange}
          onSave={mockOnSave}
        />
      );
    });

    const tracks = container.querySelectorAll('.Track');
    expect(tracks.length).toBe(2);
  });

  it('shows - buttons for removing tracks', () => {
    const mockOnRemove = jest.fn();
    const mockOnNameChange = jest.fn();
    const mockOnSave = jest.fn();

    act(() => {
      root = createRoot(container);
      root.render(
        <Playlist
          playlistName="Test Playlist"
          playlistTracks={mockPlaylistTracks}
          onRemove={mockOnRemove}
          onNameChange={mockOnNameChange}
          onSave={mockOnSave}
        />
      );
    });

    const buttons = container.querySelectorAll('.Track-action');
    buttons.forEach(button => {
      expect(button.textContent).toBe('-');
    });
  });

  it('calls onSave when Save to Spotify button is clicked', () => {
    const mockOnRemove = jest.fn();
    const mockOnNameChange = jest.fn();
    const mockOnSave = jest.fn();

    act(() => {
      root = createRoot(container);
      root.render(
        <Playlist
          playlistName="Test Playlist"
          playlistTracks={mockPlaylistTracks}
          onRemove={mockOnRemove}
          onNameChange={mockOnNameChange}
          onSave={mockOnSave}
        />
      );
    });

    const saveButton = container.querySelector('.Playlist-save');
    act(() => {
      saveButton.click();
    });

    expect(mockOnSave).toHaveBeenCalled();
  });

  it('has correct button text', () => {
    const mockOnRemove = jest.fn();
    const mockOnNameChange = jest.fn();
    const mockOnSave = jest.fn();

    act(() => {
      root = createRoot(container);
      root.render(
        <Playlist
          playlistName="Test Playlist"
          playlistTracks={mockPlaylistTracks}
          onRemove={mockOnRemove}
          onNameChange={mockOnNameChange}
          onSave={mockOnSave}
        />
      );
    });

    const saveButton = container.querySelector('.Playlist-save');
    expect(saveButton.textContent).toBe('SAVE TO SPOTIFY');
  });
});
