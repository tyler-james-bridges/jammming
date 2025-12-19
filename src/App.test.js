import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import App from './App';

describe('App Component', () => {
  let container = null;
  let root = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    container = null;
    root = null;
  });

  it('renders without crashing', () => {
    act(() => {
      root = createRoot(container);
      root.render(<App />);
    });
  });

  it('renders main heading', () => {
    act(() => {
      root = createRoot(container);
      root.render(<App />);
    });

    const heading = container.querySelector('h1');
    expect(heading).toBeTruthy();
    expect(heading.textContent).toContain('mmm');
  });

  it('renders SearchBar component', () => {
    act(() => {
      root = createRoot(container);
      root.render(<App />);
    });

    const searchBar = container.querySelector('.SearchBar');
    expect(searchBar).toBeTruthy();
  });

  it('renders SearchResults component', () => {
    act(() => {
      root = createRoot(container);
      root.render(<App />);
    });

    const searchResults = container.querySelector('.SearchResults');
    expect(searchResults).toBeTruthy();
  });

  it('renders Playlist component', () => {
    act(() => {
      root = createRoot(container);
      root.render(<App />);
    });

    const playlist = container.querySelector('.Playlist');
    expect(playlist).toBeTruthy();
  });

  it('starts with empty search results', () => {
    act(() => {
      root = createRoot(container);
      root.render(<App />);
    });

    // Search results start empty until user searches
    const searchResults = container.querySelector('.SearchResults');
    const tracks = searchResults.querySelectorAll('.Track');
    expect(tracks.length).toBe(0);
  });

  it('starts with empty playlist', () => {
    act(() => {
      root = createRoot(container);
      root.render(<App />);
    });

    // Playlist starts empty
    const playlist = container.querySelector('.Playlist');
    const tracks = playlist.querySelectorAll('.Track');
    expect(tracks.length).toBe(0);
  });

  it('has Save to Spotify button', () => {
    act(() => {
      root = createRoot(container);
      root.render(<App />);
    });

    const saveButton = container.querySelector('.Playlist-save');
    expect(saveButton).toBeTruthy();
    expect(saveButton.textContent).toBe('SAVE TO SPOTIFY');
  });
});
