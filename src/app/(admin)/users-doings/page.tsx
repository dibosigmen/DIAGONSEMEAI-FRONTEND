"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/supabase";

export default function UsersDoingsPage() {
  const [userName, setUserName] = useState("Alex Henderson");
  const [activeTab, setActiveTab] = useState("profile");

  // ✅ States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");

  // ✅ Get username from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUserName(storedUser);
  }, []);

  
  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("usr2")
      .select("*")
      .eq("username", userName) 
      .single();

    if (error) {
      console.error("Fetch error:", error.message);
    } else if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setCountry(data.country || "");
    }
  };

  useEffect(() => {
    if (userName) fetchUserData();
  }, [userName]);

  // ✅ Save Changes
  const handleSave = async () => {
    const { error } = await supabase
      .from("usr2")
      .update({
        name,
        email,
        phone,
        address,
        country,
      })
      .eq("username", userName);

    if (error) {
      alert("Error updating profile");
      console.error(error.message);
    } else {
      alert("Profile updated successfully ✅");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {userName} - Admin Profile
          </h1>

          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>

        {/* TABS */}
        <div className="flex bg-gray-200 p-1 rounded-xl w-fit mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-2 rounded-xl font-semibold ${
              activeTab === "profile"
                ? "bg-white shadow text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("payment")}
            className={`px-5 py-2 rounded-xl font-semibold ${
              activeTab === "payment"
                ? "bg-white shadow text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Payment
          </button>
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* PROFILE CARD */}
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <img
                src="https://i.pravatar.cc/150"
                className="w-28 h-28 rounded-full mx-auto border-4 border-indigo-500"
              />
              <h2 className="mt-4 text-xl font-bold">{name || userName}</h2>
              <p className="text-gray-500">System Admin</p>
            </div>

            {/* PROFILE DETAILS */}
            <div className="lg:col-span-3 space-y-6">

              {/* PERSONAL INFO */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
                  <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <input className="input" value="System Admin" readOnly />
                </div>

                <textarea className="input mt-4 w-full" rows={3} />
              </div>

              {/* ADDRESS */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="font-semibold mb-4">Address</h2>

                <input className="input mb-3" value={address} onChange={(e) => setAddress(e.target.value)} />
                <input className="input" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>

              {/* STATUS */}
              <div className="bg-indigo-600 text-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-sm">System Uptime</h3>
                <h1 className="text-3xl font-bold mt-2">99.98%</h1>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT TAB */}
        {activeTab === "payment" && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-xl">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>

            <div className="bg-gray-50 p-6 rounded-2xl shadow">
              <p className="font-semibold">Premium Plan</p>
              <p>Expiry: 12 Dec 2026</p>
              <p>Card: **** 4242</p>
            </div>
          </div>
        )}
      </main>

      {/* STYLE */}
      <style jsx>{`
        .input {
          @apply w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400;
        }
      `}</style>
    </div>
  );
}