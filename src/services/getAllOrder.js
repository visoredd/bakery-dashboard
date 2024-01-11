import { processData } from "../utils/util";

export const fetchData = async (setData) => {
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
        break; // Terminate the loop when done is true
      }

      chunks.push(value);
      processData(chunks, setData);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
