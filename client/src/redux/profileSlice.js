import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstname: '',
  lastname: '',
  email: '',
  phonenumber: '',
  city: '',
  churchbranch: '',
  state: '',
  zipcode: '',
  address: '',
  image: '', // Store image URL

};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.firstname = action.payload.firstname;
      state.lastname = action.payload.lastname;
      state.email = action.payload.email;
      state.phonenumber = action.payload.phonenumber;
      state.city = action.payload.city;
      state.churchbranch = action.payload.churchbranch;
      state.state = action.payload.state;
      state.zipcode = action.payload.zipcode,
      state.address = action.payload.address,
      state.image = action.payload.image;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
