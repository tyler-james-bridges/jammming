# Jammming

A React web application that allows users to search the Spotify library, create custom playlists, and save them to their Spotify account.

## Features

- Search for songs by title, artist, or album
- View song information (title, artist, album)
- Add songs to a custom playlist
- Remove songs from a custom playlist
- Save custom playlists to your Spotify account

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- A Spotify account
- A Spotify Developer application (for API access)

### Spotify Setup

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app name and description
5. Copy your **Client ID**
6. Click "Edit Settings" and add `http://localhost:3000/` to the Redirect URIs
7. Save the settings

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tyler-james-bridges/jammming.git
   cd jammming
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the Spotify Client ID in `src/util/Spotify.js`:
   ```javascript
   const clientId = 'YOUR_CLIENT_ID'; // Replace with your actual Client ID
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/
│   ├── Playlist/        # Playlist component with save functionality
│   ├── SearchBar/       # Search input and button
│   ├── SearchResults/   # Display search results
│   ├── Track/           # Individual track display
│   └── Tracklist/       # List of tracks
├── util/
│   └── Spotify.js       # Spotify API utility module
├── App.js               # Main application component
├── App.css              # Application styles
└── index.js             # Entry point
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

## Technologies Used

- React
- Spotify Web API
- CSS3

## License

This project is for educational purposes as part of the Codecademy curriculum.
