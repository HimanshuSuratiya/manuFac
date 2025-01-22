import cropData, { CropDataType } from "../../data/cropData.ts";
import { Table } from "@mantine/core";
import styles from "./MinMaxCrop.module.css";

type MaxMinResult = {
  year: string;
  max: { "Crop Name": string; production: number } | null;
  min: { "Crop Name": string; production: number } | null;
};

// Function to calculate the maximum and minimum crop production for each year
const findMaxMinProductionByYear = (data: CropDataType[]): MaxMinResult[] => {
  // Group data by year
  const groupedByYear = data.reduce(
    (acc: Record<string, CropDataType[]>, crop) => {
      const year = crop.Year; // Extract year from the crop data
      if (!acc[year]) acc[year] = []; // Initialize year group if not present
      acc[year].push(crop);
      return acc;
    },
    {}
  );

  // Map over grouped data to calculate max and min production for each year
  return Object.entries(groupedByYear).map(([year, crops]) => {
    // Filter out crops with missing production data
    const filteredCrops = crops.filter(
      (crop) => crop["Crop Production (UOM:t(Tonnes))"] !== ""
    );

    if (filteredCrops.length === 0) return { year, max: null, min: null }; // Handle case with no valid data

    // Find the crop with the maximum production
    const maxCrop = filteredCrops.reduce((max, crop) => {
      const production =
        parseFloat(crop["Crop Production (UOM:t(Tonnes))"] as string) || 0;
      return production >
        (parseFloat(max["Crop Production (UOM:t(Tonnes))"] as string) || 0)
        ? crop
        : max;
    });

    // Find the crop with the minimum production
    const minCrop = filteredCrops.reduce((min, crop) => {
      const production =
        parseFloat(crop["Crop Production (UOM:t(Tonnes))"] as string) || 0;
      return production <
        (parseFloat(min["Crop Production (UOM:t(Tonnes))"] as string) || 0)
        ? crop
        : min;
    });

    // Return the calculated max and min data for the year
    return {
      year,
      max: {
        "Crop Name": maxCrop["Crop Name"],
        production: parseFloat(
          maxCrop["Crop Production (UOM:t(Tonnes))"] as string
        ),
      },
      min: {
        "Crop Name": minCrop["Crop Name"],
        production: parseFloat(
          minCrop["Crop Production (UOM:t(Tonnes))"] as string
        ),
      },
    };
  });
};

const MinMaxCropProduction = () => {
  const data = findMaxMinProductionByYear(cropData);
  const rows = data.map((row: MaxMinResult) => (
    <Table.Tr key={row.year}>
      {/* Extract and display the year */}
      <Table.Td>{row.year.match(/\b\d{4}\b/)?.[0]}</Table.Td>{" "}
      <Table.Td>{`${row.max?.["Crop Name"]} / ${row.max?.production} Tonnes`}</Table.Td>{" "}
      <Table.Td>{`${row.min?.["Crop Name"]} / ${row.min?.production} Tonnes`}</Table.Td>{" "}
    </Table.Tr>
  ));

  return (
    <>
      <h2>Maximum and minimum crop production for each year</h2>
      <div className={styles.container}>
        <Table
          stickyHeader
          verticalSpacing="sm"
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Year</Table.Th>
              <Table.Th>Maximum Production / (in Tonnes)</Table.Th>
              <Table.Th>Minimum Production / (in Tonnes)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
    </>
  );
};

export default MinMaxCropProduction;
