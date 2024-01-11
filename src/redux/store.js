import { configureStore } from "@reduxjs/toolkit";
import timerSlice from "./timeSlice";
export const store = configureStore({
  reducer: {
    timer: timerSlice,
  },
});
