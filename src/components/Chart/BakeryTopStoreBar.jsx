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

const BakeryTopStoreBar = ({ data }) => {
  const { fromDate, toDate } = useSelector((state) => state.timer);

  const dispatch = useDispatch();
  const chartRef = useRef();
  const onClick = (event) => {
    dispatch(
      setFilter({
        filter:
          filteredData[getElementAtEvent(chartRef.current, event)[0]?.index][0],
        filterType: "id",
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

    const groupingByTypes = filterData.reduce((acc, entry) => {
      acc[entry.branch] = (acc[entry.branch] ? acc[entry.branch] : 0) + 1;
      return acc;
    }, {});

    const findTopBranches = Object.entries(groupingByTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return findTopBranches.slice(0, 5);
  }, [fromDate, toDate, data]);

  const chartData = {
    labels: filteredData.map((entry) => entry[0]),
    datasets: [
      {
        label: "Bakery Id",
        data: filteredData.map((entry) => entry[1]),
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
        text: "Top 5 Bakery Stores",
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

export default BakeryTopStoreBar;
