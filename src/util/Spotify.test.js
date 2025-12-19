import Spotify from './Spotify';

describe('Spotify Utility Module', () => {
  describe('savePlaylist validation', () => {
    it('rejects when playlist name is missing', (done) => {
      const trackUris = ['spotify:track:1', 'spotify:track:2'];

      Spotify.savePlaylist('', trackUris)
        .then(() => done.fail('Should have rejected'))
        .catch((error) => {
          expect(error.message).toBe('Playlist name and tracks are required');
          done();
        });
    });

    it('rejects when trackUris is empty', (done) => {
      const playlistName = 'Test Playlist';

      Spotify.savePlaylist(playlistName, [])
        .then(() => done.fail('Should have rejected'))
        .catch((error) => {
          expect(error.message).toBe('Playlist name and tracks are required');
          done();
        });
    });

    it('rejects when trackUris is undefined', (done) => {
      const playlistName = 'Test Playlist';

      Spotify.savePlaylist(playlistName, undefined)
        .then(() => done.fail('Should have rejected'))
        .catch((error) => {
          expect(error.message).toBe('Playlist name and tracks are required');
          done();
        });
    });

    it('rejects when playlist name is undefined', (done) => {
      const trackUris = ['spotify:track:1'];

      Spotify.savePlaylist(undefined, trackUris)
        .then(() => done.fail('Should have rejected'))
        .catch((error) => {
          expect(error.message).toBe('Playlist name and tracks are required');
          done();
        });
    });
  });

  describe('getAccessToken', () => {
    let originalLocation;

    beforeEach(() => {
      originalLocation = window.location;
      delete window.location;
      window.location = {
        href: 'http://localhost:3000/',
        assign: jest.fn()
      };
      window.history.pushState = jest.fn();
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it('is a function', () => {
      expect(typeof Spotify.getAccessToken).toBe('function');
    });

    it('extracts access token from URL', () => {
      window.location.href = 'http://localhost:3000/#access_token=BQA1234567890&expires_in=3600';

      const token = Spotify.getAccessToken();

      expect(token).toBe('BQA1234567890');
    });
  });

  describe('search', () => {
    it('is a function', () => {
      expect(typeof Spotify.search).toBe('function');
    });
  });
});
