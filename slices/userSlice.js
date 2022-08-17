import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  creds: "",
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.creds = action.payload.user;
      state.token = action.payload.token;
    },
    removeUser: (state, action) => {
      state.creds = "";
      state.token = "";
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectUser = (state) => state.user;
export default userSlice.reducer;
