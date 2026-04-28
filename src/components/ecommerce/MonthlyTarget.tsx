"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function HealthScoreCard() {
  const series = [82]; 

  const options: ApexOptions = {
    colors: ["#22c55e"],

    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },

    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,

        hollow: {
          size: "80%",
        },

        track: {
          background: "#E5E7EB",
          strokeWidth: "100%",
        },

        dataLabels: {
          name: { show: false },

          value: {
            fontSize: "36px",
            fontWeight: "700",
            offsetY: -40,
            color: "#111827",
            formatter: (val) => val + "%",
          },
        },
      },
    },

    fill: {
      type: "solid",
      colors: ["#22c55e"],
    },

    stroke: {
      lineCap: "round",
    },

    labels: ["Health"],
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">

      {/* Top */}
      <div className="px-5 pt-5 bg-white rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">

        <div className="flex justify-between">

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              AI Health Score
            </h3>

            <p className="text-sm text-gray-500">
              AI Medical Assistant Analysis
            </p>
          </div>

          {/* Dropdown */}
          <div className="relative">

            <button onClick={() => setIsOpen(!isOpen)}>
              <MoreDotIcon className="text-gray-400" />
            </button>

            <Dropdown
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              className="w-40 p-2"
            >
              <DropdownItem onItemClick={() => setIsOpen(false)}>
                View Report
              </DropdownItem>

              <DropdownItem onItemClick={() => setIsOpen(false)}>
                Reset Score
              </DropdownItem>

            </Dropdown>

          </div>
        </div>


        {/* Chart */}
        <div className="relative">

          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={330}
          />

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
            Healthy
          </span>

        </div>


        <p className="text-center text-sm text-gray-500 mt-6">
          AI detected good health condition today. Keep following
          exercise and diet plan.
        </p>

      </div>



      {/* Bottom Stats */}

      <div className="flex justify-center gap-6 py-5">

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Target
          </p>

          <p className="font-semibold text-lg">
            90%
          </p>
        </div>


        <div className="w-px bg-gray-300"></div>


        <div className="text-center">
          <p className="text-xs text-gray-500">
            Health Score
          </p>

          <p className="font-semibold text-lg text-green-600">
            82%
          </p>
        </div>


        <div className="w-px bg-gray-300"></div>


        <div className="text-center">
          <p className="text-xs text-gray-500">
            Today
          </p>

          <p className="font-semibold text-lg text-blue-600">
            Good
          </p>
        </div>

      </div>

    </div>
  );
}