import { useRef, useEffect, JSX } from "react";
import { init, getInstanceByDom } from "echarts";
import type { CSSProperties } from "react";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";

export interface ReactEChartsProps {
  option: EChartsOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
}

export function ReactECharts({
  option,
  style,
  settings,
  loading,
  theme,
}: ReactEChartsProps): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);

  // Effect to initialize and clean up the ECharts instance
  useEffect(() => {
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme);
    }

    // Resize chart on window resize
    function resizeChart() {
      chart?.resize();
    }

    window.addEventListener("resize", resizeChart);

    // Cleanup: Dispose of the chart and remove the resize event listener
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  // Effect to set or update chart options when `option` or `settings` changes
  useEffect(() => {
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      if (chart) {
        chart.setOption(option, settings);
      }
    }
  }, [option, settings, theme]);

  // Effect to show or hide the loading spinner based on the `loading` prop
  useEffect(() => {
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      if (chart) {
        loading === true ? chart.showLoading() : chart.hideLoading();
      }
    }
  }, [loading, theme]);

  return (
    <div ref={chartRef} style={{ width: "100%", height: "900px", ...style }} />
  );
}
