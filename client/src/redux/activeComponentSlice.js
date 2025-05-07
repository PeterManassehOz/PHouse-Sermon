import { createSlice } from '@reduxjs/toolkit';

const activeComponentSlice = createSlice({
  name: 'activeComponent',
  initialState: { value: null }, 
  reducers: {
    setActiveComponent: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setActiveComponent } = activeComponentSlice.actions;

export default activeComponentSlice.reducer;
