const clientId = 'c9dbc2c5680741b9ad8c02c91504ba61';
const redirectUri = 'http://127.0.0.1:3000';

// Generate random string for PKCE
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

// Generate code challenge for PKCE
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const Spotify = {
  async getAccessToken() {
    // If we have a token in sessionStorage, return it
    const storedToken = sessionStorage.getItem('spotifyAccessToken');
    if (storedToken) {
      return storedToken;
    }

    // Check if authorization code is in the URL (after redirect from Spotify)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange code for access token
      const codeVerifier = sessionStorage.getItem('code_verifier');

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        sessionStorage.setItem('spotifyAccessToken', data.access_token);

        // Clear the URL
        window.history.pushState({}, '', '/');

        // Set expiration
        if (data.expires_in) {
          setTimeout(() => sessionStorage.removeItem('spotifyAccessToken'), data.expires_in * 1000);
        }

        return data.access_token;
      }
    }

    // No token and no code - need to authorize
    const codeVerifier = generateRandomString(64);
    sessionStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', 'playlist-modify-public playlist-modify-private');
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('code_challenge', codeChallenge);

    window.location.href = authUrl.toString();
  },

  // Search Spotify for tracks matching the search term
  async search(term) {
    const accessToken = await Spotify.getAccessToken();

    if (!accessToken) {
      return [];
    }

    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Search request failed');
    }

    const jsonResponse = await response.json();

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
  },

  // Save playlist to user's Spotify account
  async savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris || trackUris.length === 0) {
      return Promise.reject(new Error('Playlist name and tracks are required'));
    }

    const accessToken = await Spotify.getAccessToken();

    if (!accessToken) {
      throw new Error('No access token');
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    // Step 1: Get the current user's Spotify ID
    const userResponse = await fetch('https://api.spotify.com/v1/me', { headers });
    if (!userResponse.ok) {
      throw new Error('Failed to get user profile');
    }
    const userData = await userResponse.json();
    const userId = userData.id;

    // Step 2: Create a new playlist
    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        name: playlistName,
        description: 'Created with Jammming',
        public: true
      })
    });
    if (!playlistResponse.ok) {
      throw new Error('Failed to create playlist');
    }
    const playlistData = await playlistResponse.json();
    const playlistId = playlistData.id;

    // Step 3: Add tracks to the playlist
    const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ uris: trackUris })
    });
    if (!tracksResponse.ok) {
      throw new Error('Failed to add tracks to playlist');
    }
    const tracksData = await tracksResponse.json();

    return {
      success: true,
      snapshotId: tracksData.snapshot_id,
      message: `Playlist "${playlistName}" saved with ${trackUris.length} tracks`
    };
  }
};

export default Spotify;
