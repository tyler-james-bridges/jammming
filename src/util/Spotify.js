const clientId = 'c9dbc2c5680741b9ad8c02c91504ba61'; 
const redirectUri = 'http://localhost:3000/'; // Replace with your redirect URI

let accessToken;

const Spotify = {
  getAccessToken() {
    // If we already have a token, return it
    if (accessToken) {
      return accessToken;
    }

    // Check if access token is in the URL (after redirect from Spotify)
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Clear the access token after it expires
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);

      // Clear the URL parameters so we can grab a new token when it expires
      window.history.pushState('Access Token', null, '/');

      return accessToken;
    } else {
      // If no access token, redirect to Spotify authorization
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  // Search Spotify for tracks matching the search term
  search(term) {
    const accessToken = Spotify.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Search request failed');
        }
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      });
  },

  // Save playlist to user's Spotify account
  // Returns a promise that resolves when the playlist is saved
  savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris || trackUris.length === 0) {
      return Promise.reject(new Error('Playlist name and tracks are required'));
    }

    const accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    let userId;

    // Step 1: Get the current user's Spotify ID
    return fetch('https://api.spotify.com/v1/me', { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to get user profile');
        }
        return response.json();
      })
      .then((jsonResponse) => {
        userId = jsonResponse.id;

        // Step 2: Create a new playlist with the custom name
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers,
          method: 'POST',
          body: JSON.stringify({
            name: playlistName,
            description: 'Created with Jammming',
            public: true
          })
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create playlist');
        }
        return response.json();
      })
      .then((jsonResponse) => {
        const playlistId = jsonResponse.id;

        // Step 3: Add tracks to the new playlist
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers,
          method: 'POST',
          body: JSON.stringify({
            uris: trackUris
          })
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add tracks to playlist');
        }
        return response.json();
      })
      .then((jsonResponse) => {
        return {
          success: true,
          snapshotId: jsonResponse.snapshot_id,
          message: `Playlist "${playlistName}" saved with ${trackUris.length} tracks`
        };
      });
  }
};

export default Spotify;
