"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import ChartTab from "../common/ChartTab";
import { CalenderIcon } from "../../icons";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function HealthStatisticsChart() {

  const datePickerRef = useRef<HTMLInputElement>(null);


  // ---------- date picker ----------

  useEffect(() => {

    if (!datePickerRef.current) return;

    const today = new Date();
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      dateFormat: "M d",
      defaultDate: [sevenDaysAgo, today],
    });

    return () => {
      if (!Array.isArray(fp)) fp.destroy();
    };

  }, []);



  // ---------- chart options ----------

  const options: ApexOptions = {

    legend: {
      show: true,
      position: "top",
    },

    colors: [
      "#10B981", // green
      "#3B82F6", // blue
      "#F59E0B", // yellow
    ],

    chart: {
      height: 310,
      type: "line",
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    dataLabels: {
      enabled: false,
    },

    grid: {
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },

    xaxis: {
      categories: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ],
    },

    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
        },
      },
    },

    tooltip: {
      enabled: true,
    },

  };



  // ---------- medical data ----------

  const series = [

    {
      name: "Health Records",
      data: [20, 35, 40, 30, 50, 60, 55, 70, 75, 80, 90, 100],
    },

    {
      name: "Health Points",
      data: [10, 20, 25, 30, 40, 50, 60, 65, 70, 80, 85, 95],
    },

    {
      name: "Consultations",
      data: [5, 10, 15, 10, 20, 25, 30, 35, 40, 45, 50, 60],
    },

  ];



  return (

    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-gray-900">

      {/* header */}

      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">

        <div>

          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">

            Health Statistics

          </h3>

          <p className="text-gray-500 text-sm">

            Records, points and consultations overview

          </p>

        </div>


        <div className="flex items-center gap-3">

          <ChartTab />

          <div className="relative inline-flex items-center">

            <CalenderIcon className="absolute left-3 text-gray-500" />

            <input
              ref={datePickerRef}
              className="pl-10 pr-3 py-2 rounded-lg border bg-white dark:bg-gray-800"
              placeholder="Select date"
            />

          </div>

        </div>

      </div>



      {/* chart */}

      <div className="max-w-full overflow-x-auto">

        <Chart
          options={options}
          series={series}
          type="area"
          height={310}
        />

      </div>

    </div>

  );

}