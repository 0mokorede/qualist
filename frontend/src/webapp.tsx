import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AIDJApp() {
  const [platform, setPlatform] = useState("spotify");
  const [mode, setMode] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [status, setStatus] = useState("");
  const [minBPM, setMinBPM] = useState("");
  const [maxBPM, setMaxBPM] = useState("");
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const [selectedYTPlaylist, setSelectedYTPlaylist] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && platform === "spotify") {
      const params = new URLSearchParams(hash.slice(1));
      const token = params.get("access_token");
      if (token) {
        setAccessToken(token);
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, [platform]);

  useEffect(() => {
    const fetchYouTubePlaylists = async () => {
      if (platform === "youtube" && accessToken) {
        const res = await fetch("http://localhost:8000/youtube/playlists", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (Array.isArray(data.playlists)) {
          setYoutubePlaylists(data.playlists);
        }
      }
    };
    fetchYouTubePlaylists();
  }, [platform, accessToken]);

  const handleLogin = async () => {
    const loginEndpoint = platform === "spotify" ? "/login" : "/youtube/login";
    const res = await fetch(`http://localhost:8000${loginEndpoint}`);
    const data = await res.json();
    window.location.href = data.auth_url;
  };

  const handleCreate = async () => {
    if (!accessToken) {
      alert("Please authenticate first.");
      return;
    }

    if (mode === "eclectic") {
      const endpoint = platform === "spotify" ? "/create-eclectic" : "/youtube/create-eclectic";
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          min_bpm: minBPM ? parseInt(minBPM) : undefined,
          max_bpm: maxBPM ? parseInt(maxBPM) : undefined,
          source_playlist_id: platform === "youtube" ? selectedYTPlaylist : undefined,
        }),
      });
      const data = await res.json();
      setStatus(data.playlist_url ? `✅ Playlist created: ${data.playlist_url}` : "❌ Failed to create playlist.");
    } else {
      alert("Only Eclectic mode is implemented right now.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🎧 AI DJ</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">Platform</label>
          <Select onValueChange={setPlatform} defaultValue="spotify">
            <SelectTrigger>
              <SelectValue placeholder="Choose a platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>

          <label className="block text-sm font-medium text-gray-700">Playlist Mode</label>
          <Select onValueChange={setMode}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mood">Mood-Based</SelectItem>
              <SelectItem value="genre">Genre-Based</SelectItem>
              <SelectItem value="activity">Time or Activity-Based</SelectItem>
              <SelectItem value="eclectic">Eclectic Auto-Mix 🎲</SelectItem>
              <SelectItem value="surprise">Surprise Me</SelectItem>
            </SelectContent>
          </Select>

          {platform === "youtube" && youtubePlaylists.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Source YouTube Playlist</label>
              <Select onValueChange={setSelectedYTPlaylist}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a YouTube playlist" />
                </SelectTrigger>
                <SelectContent>
                  {youtubePlaylists.map((pl) => (
                    <SelectItem key={pl.id} value={pl.id}>{pl.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Min BPM</label>
            <input
              type="number"
              placeholder="e.g. 80"
              value={minBPM}
              onChange={(e) => setMinBPM(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />

            <label className="block text-sm font-medium text-gray-700">Max BPM</label>
            <input
              type="number"
              placeholder="e.g. 130"
              value={maxBPM}
              onChange={(e) => setMaxBPM(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <input
            type="text"
            placeholder="Enter Access Token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />

          <Button className="w-full" onClick={handleCreate} disabled={!mode}>
            Create Playlist
          </Button>

          {status && <p className="text-sm text-green-600 mt-2">{status}</p>}
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full" onClick={handleLogin}>
        Login with {platform === "spotify" ? "Spotify" : "YouTube"}
      </Button>
    </div>
  );
}
