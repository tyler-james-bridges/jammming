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

  // Save playlist to user's Spotify account
  // Returns a promise that resolves when the playlist is saved
  savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris || trackUris.length === 0) {
      return Promise.reject(new Error('Playlist name and tracks are required'));
    }

    // Mock implementation - simulates API call
    // TODO: Replace with actual Spotify API integration
    console.log('=== Saving Playlist to Spotify ===');
    console.log('Playlist Name:', playlistName);
    console.log('Track URIs:', trackUris);
    console.log('Number of tracks:', trackUris.length);
    console.log('==================================');

    // Simulate async API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          playlistId: 'mock-playlist-' + Date.now(),
          message: `Playlist "${playlistName}" saved with ${trackUris.length} tracks`
        });
      }, 500);
    });
  }
};

export default Spotify;
