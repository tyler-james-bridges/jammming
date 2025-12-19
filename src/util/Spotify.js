const clientId = 'YOUR_CLIENT_ID'; // Replace with your Spotify Client ID
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
  }
};

export default Spotify;
