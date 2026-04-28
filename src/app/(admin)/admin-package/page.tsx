"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase";

interface Package {
  id?: number;
  name: string;
  price: string;
  features: string[];
  created_at?: string;
}

export default function SetPackagesPage() {
  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [liveTime, setLiveTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from("package_set")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      // Ensure features is always an array
      const safePackages = (data || []).map((pkg: any) => ({
        ...pkg,
        features:
          Array.isArray(pkg.features)
            ? pkg.features
            : typeof pkg.features === "string"
            ? (() => {
                try {
                  const arr = JSON.parse(pkg.features);
                  return Array.isArray(arr) ? arr : [];
                } catch {
                  return [];
                }
              })()
            : [],
      }));
      setPackages(safePackages);
    }
    setLoading(false);
  };

  // ➕ Add Feature
  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput]);
      setFeatureInput("");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log the data being sent
    console.log("Submitting package:", {
      name: packageName,
      price,
      features
    });

    const { data, error } = await supabase.from("package_set").insert([
      {
        name: packageName,
        price,
        features
      },
    ]);

    if (error) {
      alert("❌ Error saving package: " + error.message);
      console.error("Supabase insert error:", error);
      return;
    }

    console.log("✅ Package Saved! Response:", data);
    alert("✅ Package Saved!");

    // Reset
    setPackageName("");
    setPrice("");
    setFeatures([]);

    fetchPackages();
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-purple-100 p-6">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Pricing Plans</h1>
        <p className="text-gray-500 mt-2">🕒 {liveTime}</p>
      </div>

      {/* FORM */}
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg mb-12">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Package Name"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              className="input"
              required
            />
            <input
              type="number"
              placeholder="Price ₹"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="flex gap-2">
            <input
              placeholder="Add Feature"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              className="input w-full"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 bg-blue-500 text-white rounded-xl"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {features.map((f, i) => (
              <span key={i} className="chip">
                {f}
              </span>
            ))}
          </div>

          <button className="btn-primary w-full">
            ➕ Create Package
          </button>
        </form>
      </div>

      {/* LOADING */}
      {loading && <p className="text-center">Loading...</p>}

      {/* PRICING CARDS */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {packages.map((pkg, index) => (
          <div
            key={pkg.id}
            className="relative p-6 rounded-3xl backdrop-blur-xl border shadow-xl transition hover:scale-105 bg-gray-900 text-white border-yellow-400"
          >
            
              <span className="absolute top-4 right-4 text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <svg xmlns='http://www.w3.org/2000/svg' className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.75L18.2 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.44 4.73L5.8 21z" /></svg>
                Popular
              </span>
            
            <h2 className="text-xl font-semibold mb-2">
              {pkg.name}
            </h2>
            <p className="text-3xl font-bold mb-4">
              ₹{pkg.price}
              <span className="text-sm"> /month</span>
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              {pkg.features?.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>
            <button
              className="w-full py-2 rounded-full font-semibold bg-yellow-400 text-black"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {/* STYLES */}
      <style jsx>{`
        .input {
          @apply px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none;
        }

        .btn-primary {
          @apply py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold;
        }

        .chip {
          @apply bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm;
        }
      `}</style>
    </div>
  );
}