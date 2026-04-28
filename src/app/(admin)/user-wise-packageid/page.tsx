"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useState, useEffect } from "react";

export default function UserInfo() {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");

  // form states
  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username") || "";
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="ADMIN VIEW" />

      <h2 className="text-2xl font-bold mb-4">
        Billings for {username || "User"}
      </h2>

      {/* Add Package Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-5 py-2.5 mb-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Package
      </button>

      {/* Main Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-[400px] relative">
            <h3 className="text-lg font-semibold mb-4">Add Package</h3>
            {/* Form */}
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="Package Name"
              className="w-full mb-3 px-3 py-2 border rounded-lg dark:bg-gray-800"
            />
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-full mb-3 px-3 py-2 border rounded-lg dark:bg-gray-800"
            />
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Features (comma separated)"
              className="w-full mb-3 px-3 py-2 border rounded-lg dark:bg-gray-800"
            />
            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const data = {
                    packageName,
                    price,
                    features: features.split(","),
                  };
                  console.log("Saved:", data);
                  // reset
                  setPackageName("");
                  setPrice("");
                  setFeatures("");
                  setShowModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}