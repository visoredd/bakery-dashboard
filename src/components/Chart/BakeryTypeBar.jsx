import React, { useMemo, useRef } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  registerables,
  CategoryScale,
  BarController,
  BarElement,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/timeSlice";

ChartJS.register(
  LinearScale,
  BarElement,
  PointElement,
  CategoryScale,
  Tooltip,
  Legend,
  TimeScale,
  BarController,
  ...registerables
);

const labels = ["Cake", "Muffins", "Cookies"];
const BakeryTypeBar = ({ data }) => {
  const { fromDate, toDate } = useSelector((state) => state.timer);
  const dispatch = useDispatch();
  const chartRef = useRef();
  const onClick = (event) => {
    dispatch(
      setFilter({
        filter: labels[getElementAtEvent(chartRef.current, event)[0]?.index],
        filterType: "type",
      })
    );
  };
  const filteredData = useMemo(() => {
    const filterData = data.filter((entry) => {
      const entryDate = new Date(entry.lastUpdateTime);
      const from = new Date(fromDate);
      const end = new Date(toDate);
      return (!from || entryDate >= from) && (!end || entryDate <= end);
    });

    const groupingByTypes = filterData.reduce(
      (acc, entry) => {
        let index = labels.findIndex((item) => item === entry.itemType);

        acc[index] = acc[index] + 1;

        return acc;
      },
      [0, 0, 0]
    );
    return groupingByTypes;
  }, [fromDate, toDate, data]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Bakery Items",
        data: filteredData,
        backgroundColor: "rgba(255, 99, 132)",
      },
    ],
  };
  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Bar Chart for Bakery Items",
      },
    },
  };

  return (
    <div>
      <Bar
        ref={chartRef}
        data={chartData}
        options={options}
        onClick={onClick}
      />
    </div>
  );
};

export default BakeryTypeBar;
