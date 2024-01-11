import { faker } from "@faker-js/faker";

export const priceList = {
  Cake: 500,
  Cookies: 50,
  Muffins: 100,
};
export const generateSampleOrder = () => {
  const itemType = faker.helpers.arrayElement(["Cake", "Cookies", "Muffins"]);
  const orderState = faker.helpers.arrayElement([
    "Created",
    "Shipped",
    "Delivered",
    "Canceled",
  ]);
  const lastUpdateTime = faker.date
    .between({
      from: "2023-01-01T00:00:00.000Z",
      to: "2024-01-01T00:00:00.000Z",
    })
    .toISOString();
  const branch = faker.number.int({ min: 1, max: 1000 });
  const customer = faker.string.uuid();
  const price = priceList[itemType];
  return {
    itemType,
    orderState,
    lastUpdateTime,
    branch,
    customer,
    price,
  };
};

export const generateSampleOrders = (count) => {
  const orders = [];
  for (let i = 0; i < count; i++) {
    let order = generateSampleOrder();
    orders.push(order);
  }
  return orders;
};

export const generateDateArray = (startDate, endDate, interval) => {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    if (interval) {
      currentDate.setDate(currentDate.getDate() + interval);
    } else {
      // Handle month changes
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const daysInMonth = (nextMonth - currentDate) / (1000 * 60 * 60 * 24);
      currentDate.setDate(currentDate.getDate() + daysInMonth);
    }
  }

  return dateArray;
};

export const processData = (chunks, setData) => {
  try {
    const concatenatedChunks = chunks.reduce(
      (acc, chunk) => acc.concat(Array.from(chunk)),
      []
    );

    const jsonString = new TextDecoder("utf-8").decode(
      new Uint8Array(concatenatedChunks)
    ); // Log the raw JSON string
    const jsonStrings = jsonString.trim().split("\n");
    // Parse each JSON string separately
    const result = jsonStrings.map((jsonStr) => JSON.parse(jsonStr.trim()));

    setData(result);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
};
