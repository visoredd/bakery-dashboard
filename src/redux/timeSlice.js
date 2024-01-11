import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fromDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
  toDate: new Date(),
  filter: false,
  filterType: null,
};

export const timerSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload.filter;
      state.filterType = action.payload.filterType;
    },
    resetFilter: (state) => {
      state.filter = false;
      state.filterType = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFromDate, setToDate, setFilter, resetFilter } =
  timerSlice.actions;

export default timerSlice.reducer;
