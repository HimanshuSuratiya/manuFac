import cropData, { CropDataType } from "../../data/cropData.ts";
import {
  ReactECharts,
  ReactEChartsProps,
} from "../ReactEChart/ReactEChart.tsx";
import styles from "./AverageCrop.module.css";

type CropYields = {
  [cropName: string]: {
    totalYield: number;
    count: number;
  };
};

type CropAverageYield = [string, number];

// Function to calculate average yields for each crop
function calculateAverageYields(data: CropDataType[]): CropAverageYield[] {
  const cropYields: CropYields = {}; // Object to store cumulative yields and counts for each crop
  data.forEach((entry: CropDataType) => {
    const cropName = entry["Crop Name"]; // Extract crop name
    let yieldValue = entry["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]; // Extract yield value
    if (yieldValue === "") yieldValue = 0; // Handle missing yield values

    // Initialize crop entry in cropYields if not present
    if (!cropYields[cropName]) {
      cropYields[cropName] = { totalYield: 0, count: 0 };
    }

    // Accumulate yield and count only if yieldValue is a number
    if (typeof yieldValue === "number") {
      cropYields[cropName].totalYield += yieldValue;
      cropYields[cropName].count += 1;
    }
  });

  // Calculate average yield for each crop and return as an array
  return Object.entries(cropYields).map(([cropName, stats]) => [
    cropName,
    Math.round(stats.totalYield / stats.count), // Calculate and round the average yield
  ]);
}

const AverageCropYields = () => {
  const result = calculateAverageYields(cropData);

  // Configuration for the bar chart
  const option: ReactEChartsProps["option"] = {
    dataset: {
      source: result,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {},
    },
    grid: {
      left: "5%",
      right: "0%",
      top: "2%",
      bottom: "10%",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2>Average Crop in each yield </h2>
      <ReactECharts option={option} />
    </div>
  );
};

export default AverageCropYields;
