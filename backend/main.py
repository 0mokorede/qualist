from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
import spotipy, requests
from spotipy.oauth2 import SpotifyOAuth
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import os

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# --- SPOTIFY OAUTH ---
sp_oauth = SpotifyOAuth(…)
@app.get("/login")
def login(): …
@app.get("/callback")
def callback(code: str): …

# --- SPOTIFY ECLECTIC PLAYLIST ---
@app.post("/create-eclectic")
def create_eclectic(data: PlaylistRequest):  # includes BPM filtering logic

# --- YOUTUBE OAUTH ---
@app.get("/youtube/login")
def youtube_login(): …
@app.get("/youtube/callback")
def youtube_callback(request: Request): …

# --- FETCH USER PLAYLISTS (YouTube) ---
@app.get("/youtube/playlists")
def get_youtube_playlists(request: Request):  # returns a JSON list of {id, title}

# --- YOUTUBE ECLECTIC MIX ---
@app.post("/youtube/create-eclectic")
def youtube_create_eclectic(data: YouTubeRequest):  # reads source_playlist_id, then:
    1. fetches selected playlist’s items via playlistItems.list
    2. shuffles and selects a subset
    3. creates a new playlist via playlists.insert
    4. adds chosen items via playlistItems.insert
    5. returns new playlist URL
