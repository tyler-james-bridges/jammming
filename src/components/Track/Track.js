import React from 'react';
import './Track.css';

function Track({ track, onAdd, onRemove, isRemoval }) {
  const handleAddTrack = () => {
    onAdd(track);
  };

  const handleRemoveTrack = () => {
    onRemove(track);
  };

  const renderAction = () => {
    if (isRemoval) {
      return (
        <button className="Track-action" onClick={handleRemoveTrack}>
          -
        </button>
      );
    }
    return (
      <button className="Track-action" onClick={handleAddTrack}>
        +
      </button>
    );
  };

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{track.name}</h3>
        <p>
          {track.artist} | {track.album}
        </p>
      </div>
      {renderAction()}
    </div>
  );
}

export default Track;
