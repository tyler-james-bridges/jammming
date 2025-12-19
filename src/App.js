import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './util/Spotify';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // Handle OAuth callback - exchange code for token on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
      // Exchange the code for a token
      Spotify.getAccessToken();
    }
  }, []);

  const addTrack = (track) => {
    // Prevent adding duplicate tracks
    if (playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    // Add track to playlist
    setPlaylistTracks([...playlistTracks, track]);
    // Remove track from search results to show it's been added
    setSearchResults(searchResults.filter((result) => result.id !== track.id));
  };

  const removeTrack = (track) => {
    // Remove track from playlist
    setPlaylistTracks(playlistTracks.filter((savedTrack) => savedTrack.id !== track.id));
    // Add track back to search results so it can be re-added
    setSearchResults([...searchResults, track]);
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = () => {
    // Don't save empty playlists
    if (!playlistTracks.length) {
      alert('Please add tracks to your playlist before saving.');
      return;
    }

    // Create array of track URIs for Spotify API
    const trackUris = playlistTracks.map((track) => track.uri);

    // Save playlist to Spotify (currently mocked)
    Spotify.savePlaylist(playlistName, trackUris)
      .then((response) => {
        alert(`Playlist "${playlistName}" saved successfully!`);
        // Reset playlist after successful save
        setPlaylistName('New Playlist');
        setPlaylistTracks([]);
        // Clear search results
        setSearchResults([]);
      })
      .catch((error) => {
        alert('Failed to save playlist. Please try again.');
        console.error('Save playlist error:', error);
      });
  };

  const search = (term) => {
    if (!term) {
      return;
    }

    Spotify.search(term)
      .then((results) => {
        // Filter out tracks that are already in the playlist
        const filteredResults = results.filter(
          (track) => !playlistTracks.find((playlistTrack) => playlistTrack.id === track.id)
        );
        setSearchResults(filteredResults);
      })
      .catch((error) => {
        console.error('Search error:', error);
        alert('Failed to search. Please try again.');
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
      </header>
      <div className="App-content">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
