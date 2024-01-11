import React, { useEffect, useState } from "react";
import TimeSelector from "../TimeSelector/TimeSelector";
import TimeSeriesChart from "../Chart/TimeSeriesChart";
import BakeryTypeBar from "../Chart/BakeryTypeBar";
import BakeryStateBar from "../Chart/BakeryStateBar";
import BakeryTopStoreBar from "../Chart/BakeryTopStoreBar";
import styles from "./dashboard.module.scss";
import { processData } from "../../utils/util";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/order");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const reader = response.body.getReader();
        let chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setLoading(false);
            break;
          }
          chunks.push(value);
          processData(chunks, setData);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <TimeSelector />
      <div>
        <TimeSeriesChart data={data} loading={loading} />
      </div>
      <div className={styles.chartSelector}>
        <div>
          <BakeryTypeBar data={data} />
        </div>
        <div>
          <BakeryStateBar data={data} />
        </div>
        <div>
          <BakeryTopStoreBar data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
