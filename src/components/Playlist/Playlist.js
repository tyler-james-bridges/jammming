import React, { useState } from 'react';
import Tracklist from '../Tracklist/Tracklist';
import './Playlist.css';

function Playlist({ playlistName, playlistTracks, onRemove, onNameChange, onSave }) {
  const handleNameChange = (event) => {
    onNameChange(event.target.value);
  };

  return (
    <div className="Playlist">
      <input
        value={playlistName}
        onChange={handleNameChange}
        placeholder="Enter Playlist Name"
      />
      <Tracklist tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button className="Playlist-save" onClick={onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}

export default Playlist;
