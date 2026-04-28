
"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";

const exampleDetailedReport = `The chest X-ray shows clear lung fields with no evidence of consolidation or effusion. The cardiac silhouette is normal in size. No acute bony abnormalities are seen. Overall, the findings are within normal limits.`;

const DetailedPage: React.FC = () => {
  const [detailedReport] = useState(exampleDetailedReport);
  return (
    <div className="p-4">
      <PageBreadcrumb pageTitle="Detailed View" />

      <div className="bg-gray-50 text-gray-900 rounded-lg p-4 mt-4">
        <h2 className="font-semibold mb-2">Detailed Report</h2>
        <p>{detailedReport}</p>
      
      </div>
    </div>
  );
};

export default DetailedPage;