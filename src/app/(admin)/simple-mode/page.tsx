
"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState,useEffect } from "react";


function getSimpleSummary(report: string): string {
  if (!report) return "No report available.";

  const firstSentence = report.split('. ')[0] + '.';
  return `Summary: ${firstSentence}`;
}

const exampleDetailedReport = `The chest X-ray shows clear lung fields with no evidence of consolidation or effusion. The cardiac silhouette is normal in size. No acute bony abnormalities are seen. Overall, the findings are within normal limits.`;

const SimpleMode: React.FC = () => {
  const [detailedReport] = useState(exampleDetailedReport);
  const [summary] = useState(getSimpleSummary(detailedReport));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Mode</h1>
      <div className="bg-blue-50 text-blue-900 rounded-lg p-4 mt-4">
        <h2 className="font-semibold mb-2">Simple English Summary</h2>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default SimpleMode;