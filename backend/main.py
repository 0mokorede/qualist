from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
import spotipy, requests
from spotipy.oauth2 import SpotifyOAuth
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import os
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# --- Pydantic models ---
class PlaylistRequest(BaseModel):
    # Add relevant fields as needed
    pass

class YouTubeRequest(BaseModel):
    source_playlist_id: str

# --- SPOTIFY OAUTH ---
sp_oauth = SpotifyOAuth(
    scope="user-library-read user-top-read playlist-modify-public",
    cache_path=".cache"  # optional
)

@app.get("/login")
def login():
    auth_url = sp_oauth.get_authorize_url()
    return RedirectResponse(auth_url)

@app.get("/callback")
def callback(code: str):
    token_info = sp_oauth.get_access_token(code)
    access_token = token_info["access_token"]
    sp = spotipy.Spotify(auth=access_token)
    user_profile = sp.current_user()
    return JSONResponse(content=user_profile)

# --- SPOTIFY ECLECTIC PLAYLIST ---
@app.post("/create-eclectic")
def create_eclectic(data: PlaylistRequest):
    pass  # BPM filtering logic to be implemented

# --- YOUTUBE OAUTH ---
@app.get("/youtube/login")
def youtube_login():
    pass

@app.get("/youtube/callback")
def youtube_callback(request: Request):
    pass

# --- FETCH USER PLAYLISTS (YouTube) ---
@app.get("/youtube/playlists")
def get_youtube_playlists(request: Request):
    pass

# --- YOUTUBE ECLECTIC MIX ---
@app.post("/youtube/create-eclectic")
def youtube_create_eclectic(data: YouTubeRequest):
    pass
