// TimeSelector.js
import React from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { setFromDate, setToDate } from "../../redux/timeSlice";
import styles from "./timeSelector.module.scss";

const TimeSelector = () => {
  const timer = useSelector((state) => state.timer);
  const dispatch = useDispatch();
  const handleFromDateChange = (date) => {
    dispatch(setFromDate(date));
  };

  const handleToDateChange = (date) => {
    dispatch(setToDate(date));
  };

  return (
    <div className={styles.container}>
      <div>
        <label>From Date: </label>
        <DatePicker
          onChange={handleFromDateChange}
          value={timer.fromDate}
          clearIcon={null}
          calendarIcon={null}
        />
      </div>
      <div>
        <label>To Date: </label>
        <DatePicker
          onChange={handleToDateChange}
          value={timer.toDate}
          clearIcon={null}
          calendarIcon={null}
        />
      </div>
    </div>
  );
};

export default TimeSelector;
