import React, { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './util/Spotify';
import './App.css';

// Hardcoded track data to simulate Spotify API response
const hardcodedSearchResults = [
  {
    id: '1',
    name: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    uri: 'spotify:track:1'
  },
  {
    id: '2',
    name: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    uri: 'spotify:track:2'
  },
  {
    id: '3',
    name: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    uri: 'spotify:track:3'
  },
  {
    id: '4',
    name: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    uri: 'spotify:track:4'
  },
  {
    id: '5',
    name: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    album: 'Nevermind',
    uri: 'spotify:track:5'
  },
  {
    id: '6',
    name: 'Billie Jean',
    artist: 'Michael Jackson',
    album: 'Thriller',
    uri: 'spotify:track:6'
  }
];

// Hardcoded playlist tracks to demonstrate playlist display
const hardcodedPlaylistTracks = [
  {
    id: '7',
    name: 'Purple Rain',
    artist: 'Prince',
    album: 'Purple Rain',
    uri: 'spotify:track:7'
  },
  {
    id: '8',
    name: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    album: 'Appetite for Destruction',
    uri: 'spotify:track:8'
  }
];

function App() {
  const [searchResults, setSearchResults] = useState(hardcodedSearchResults);
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [playlistTracks, setPlaylistTracks] = useState(hardcodedPlaylistTracks);

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
        // Reset search results to original
        setSearchResults(hardcodedSearchResults);
      })
      .catch((error) => {
        alert('Failed to save playlist. Please try again.');
        console.error('Save playlist error:', error);
      });
  };

  const search = (term) => {
    // TODO: Implement Spotify search
    console.log('Searching for:', term);
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
