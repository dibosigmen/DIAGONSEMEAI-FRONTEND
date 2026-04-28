"use client";

import Image from "next/image";

interface Report {
  id: number;
  patient: string;
  disease: string;
  confidence: string;
  status: "Normal" | "Warning" | "Critical";
  image: string;
}

const reports: Report[] = [
  {
    id: 1,
    patient: "Patient 001",
    disease: "Pneumonia",
    confidence: "92%",
    status: "Critical",
    image: "/images/xray/img1.jpg",
  },
  {
    id: 2,
    patient: "Patient 002",
    disease: "Normal Lung",
    confidence: "98%",
    status: "Normal",
    image: "/images/xray/img1.jpg",
  },
  {
    id: 3,
    patient: "Patient 003",
    disease: "COVID Pattern",
    confidence: "87%",
    status: "Warning",
    image: "/images/xray/img1.jpg",
  },
];

export default function ImageAnalysisCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          AI Image Analysis
        </h3>

        <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Upload Image
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {reports.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-gray-200 p-4 shadow-sm bg-white dark:bg-gray-900"
          >

            {/* Image */}
            <div className="w-full h-40 relative mb-3">
              <Image
                src={r.image}
                alt="xray"
                fill
                className="object-cover rounded-lg"
              />
            </div>

            {/* Patient */}
            <h4 className="font-semibold text-gray-800 dark:text-white">
              {r.patient}
            </h4>

            {/* Disease */}
            <p className="text-sm text-gray-500">
              AI Detected: <span className="font-medium">{r.disease}</span>
            </p>

            {/* Confidence */}
            <p className="text-sm text-gray-500">
              Confidence: <span className="text-blue-600">{r.confidence}</span>
            </p>

            {/* Status */}
            <div className="mt-2 mb-3">
              <span
                className={`px-2 py-1 text-xs rounded-full
                ${
                  r.status === "Normal"
                    ? "bg-green-100 text-green-600"
                    : r.status === "Warning"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {r.status}
              </span>
            </div>

            {/* Button */}
            <button className="w-full py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
              View Full Report
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}