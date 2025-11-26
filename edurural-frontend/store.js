import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, 
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

const playerSlice = createSlice({
  name: "player",
  initialState: {
    currentSong: null, 
    isPlaying: false,
  },
  reducers: {
    playSong: (state, action) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },
    pauseSong: (state) => {
      state.isPlaying = false;
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export const { playSong, pauseSong } = playerSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    player: playerSlice.reducer,
  },
});