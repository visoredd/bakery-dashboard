import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  LineController,
  LineElement,
  registerables,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { generateDateArray } from "../../utils/util";
import { resetFilter } from "../../redux/timeSlice";
import styles from "./timeSeriestChart.module.scss";
import Loader from "../Loader/Loader";

ChartJS.register(
  LinearScale,
  LineElement,
  PointElement,
  CategoryScale,
  Tooltip,
  Legend,
  zoomPlugin,
  TimeScale,
  LineController,
  ...registerables
);

const TimeSeriesChart = ({ data, loading }) => {
  const { fromDate, toDate, filter, filterType } = useSelector(
    (state) => state.timer
  );
  const dispatch = useDispatch();
  const [series, setSeries] = useState("month");

  const filteredData = useMemo(() => {
    let originalData = data;
    if (filter) {
      switch (filterType) {
        case "id":
          originalData = originalData.filter(
            (entry) => entry?.branch === filter
          );
          break;
        case "state":
          originalData = originalData.filter(
            (entry) => entry?.orderState === filter
          );
          break;
        case "type":
          originalData = originalData.filter(
            (entry) => entry?.itemType === filter
          );
          break;
        default:
          break;
      }
    }
    const filterBasedOnTime = originalData.filter((entry) => {
      const entryDate = new Date(entry.lastUpdateTime);
      const from = new Date(fromDate);
      const end = new Date(toDate);
      return (!from || entryDate >= from) && (!end || entryDate <= end);
    });
    const groupingByDate = filterBasedOnTime.reduce((acc, entry) => {
      const date = new Date(entry.lastUpdateTime).toLocaleDateString();
      return {
        ...acc,
        [date]: {
          price:
            (acc[date] ? parseInt(acc[date].price) : 0) + parseInt(entry.price),
          count: (acc[date] ? acc[date].count : 0) + 1,
        },
      };
    }, {});

    let resultArray = [];
    switch (series) {
      case "day":
        resultArray = generateDateArray(fromDate, toDate, 1).map((item) => {
          return {
            x: item,
            y: groupingByDate[new Date(item).toLocaleDateString()]?.price,
            y1: groupingByDate[new Date(item).toLocaleDateString()]?.count,
          };
        });
        break;
      case "week":
        resultArray = generateDateArray(fromDate, toDate, 7).map((item) => {
          return {
            x: item,
            y: groupingByDate[new Date(item).toLocaleDateString()]?.price,
            y1: groupingByDate[new Date(item).toLocaleDateString()]?.count,
          };
        });
        break;
      case "month":
        resultArray = generateDateArray(fromDate, toDate).map((item) => {
          return {
            x: item,
            y: groupingByDate[new Date(item).toLocaleDateString()]?.price,
            y1: groupingByDate[new Date(item).toLocaleDateString()]?.count,
          };
        });
        break;
      default:
        return [];
    }
    return resultArray;
  }, [fromDate, toDate, data, series, filter, filterType]);

  const chartData = {
    //labels: filteredData.map((entry) => entry[0]),
    datasets: [
      {
        label: "Total Value of Orders",
        data: filteredData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Number of Orders",
        data: filteredData.map((item) => ({ x: item.x, y: item.y1 })),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1",
      },
    ],
  };

  // Chart options
  const options = useMemo(
    () => ({
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: "Time Series Chart for Bakery",
        },
        zoom: {
          pan: {
            enabled: true,
            modifierKey: "ctrl",
          },
          zoom: {
            drag: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },

            mode: "xy",
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: { unit: series },
        },
        y: {
          type: "linear",
          display: true,
          text: "Chart.js Line Chart",
          position: "left",
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, ticks) {
              return "Rs." + value;
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: "Chart.js Line Chart",

          grid: {
            drawOnChartArea: false,
          },
        },
      },
    }),
    [series]
  );

  const chartRef = React.useRef(null);

  const handleResetZoom = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom();
    }
  };
  const handleResetFilter = () => {
    dispatch(resetFilter());
  };

  const handleToggleChange = (toggle) => {
    setSeries(toggle);
  };

  return (
    <div className={styles.container}>
      {loading && <Loader loading={loading} />}
      <Line ref={chartRef} data={chartData} options={options} />
      <div className={styles.buttonContainer}>
        <div>
          <button onClick={handleResetZoom}>Reset Zoom</button>
        </div>
        <div>
          <button
            onClick={() => handleToggleChange("day")}
            style={{
              backgroundColor: series === "day" ? "lightblue" : "white",
            }}
          >
            D
          </button>
          <button
            onClick={() => handleToggleChange("week")}
            style={{
              backgroundColor: series === "week" ? "lightblue" : "white",
            }}
          >
            W
          </button>
          <button
            onClick={() => handleToggleChange("month")}
            style={{
              backgroundColor: series === "month" ? "lightblue" : "white",
            }}
          >
            M
          </button>
        </div>
        <div>
          <button onClick={handleResetFilter}>Reset Filter</button>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesChart;
