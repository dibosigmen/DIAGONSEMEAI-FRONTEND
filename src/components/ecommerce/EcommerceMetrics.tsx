"use client";

import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon } from "@/icons";
import { Heart, Activity, Droplet } from "lucide-react";
import { Stethoscope } from "lucide-react";
import { User } from "lucide-react";
import { MessageCircleQuestion } from "lucide-react";
import { Watch } from "lucide-react";

import { supabase } from "@/supabase";

export const EcommerceMetrics = () => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUsername = async () => {
      let storedName = localStorage.getItem("username");
      if (storedName) {
        setUsername(storedName);
        return;
      }
      // Try to get user from supabase
      const { data } = await supabase.auth.getUser();
      let uname = data?.user?.user_metadata?.username || data?.user?.email || data?.user?.id || "";
      if (uname) {
        setUsername(uname);
        localStorage.setItem("username", uname);
      }
    };
    fetchUsername();
  }, []);

  return (
    <div>
      {username && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {username}!
          </h2>
          <p className="text-gray-500 text-sm">Here is your medical overview.</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">


      {/* ================= HEART RATE ================= */}

      <div
        className="rounded-2xl border border-gray-200 bg-white p-6
        shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        {/* top */}
        <div className="flex justify-between items-start">

          <div
            className="flex items-center justify-center w-12 h-12
            rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white"
          >
            <Heart className="size-6" />
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            +2% Normal
          </Badge>

        </div>

        {/* text */}
        <div className="mt-4">
          <span className="text-sm text-gray-500">
            HEART RATE
          </span>

          <h4 className="mt-2 font-bold text-2xl text-gray-800">
            72 bpm
          </h4>
        </div>
      </div>



      {/* ================= BLOOD PRESSURE ================= */}

      <div
        className="rounded-2xl border border-gray-200 bg-white p-6
        shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex justify-between items-start">

          <div
            className="flex items-center justify-center w-12 h-12
            rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white"
          >
            <Activity className="size-6" />
          </div>

          <Badge color="success">
            Stable
          </Badge>

        </div>

        <div className="mt-4">
          <span className="text-sm text-gray-500">
            Blood Pressure
          </span>

          <h4 className="mt-2 font-bold text-2xl text-gray-800">
            120 / 80
          </h4>
        </div>
      </div>



      {/* ================= GLUCOSE ================= */}

      <div
        className="rounded-2xl border border-gray-200 bg-white p-6
        shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex justify-between items-start">

          <div
            className="flex items-center justify-center w-12 h-12
            rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white"
          >
            <Droplet className="size-6" />
          </div>

          <Badge color="success">
            Optimal
          </Badge>

        </div>

        <div className="mt-4">
          <span className="text-sm text-gray-500">
            Glucose
          </span>

          <h4 className="mt-2 font-bold text-2xl text-gray-800">
            94 mg/dL
          </h4>
        </div>
      </div>

<div
        className="rounded-2xl border border-gray-200 bg-white p-6
        shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex justify-between items-start">

          <div
            className="flex items-center justify-center w-12 h-12
            rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white"
          >
            <Watch className="size-6" />
          </div>

          <Badge color="success">
            Waiting
          </Badge>

        </div>

        <div className="mt-4">
          <span className="text-sm text-gray-500">
            Appointments
          </span>

          <h4 className="mt-2 font-bold text-2xl text-gray-800">
            5
          </h4>
        </div>
      </div>
<div
        className="rounded-2xl border border-gray-200 bg-white p-6
        shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex justify-between items-start">

          <div
            className="flex items-center justify-center w-12 h-12
            rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white"
          >
            <Stethoscope className="size-6" />
          </div>

          <Badge color="success">
          🟢 Online
        </Badge>

        </div>

        <div className="mt-4">
          <span className="text-sm text-gray-500">
            Doctors online
          </span>

          <h4 className="mt-2 font-bold text-2xl text-gray-800">
            5
          </h4>
        </div>
      </div>
      <div
        className="rounded-2xl border border-gray-200 bg-white p-6
        shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex justify-between items-start">

          <div
            className="flex items-center justify-center w-12 h-12
            rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white"
          >
              <MessageCircleQuestion className="size-6" />
          </div>

          <Badge color="warning">
            2 requests pending
          </Badge>

        </div>

        <div className="mt-4">
          <span className="text-sm text-gray-500">
            Requests
          </span>

          <h4 className="mt-2 font-bold text-2xl text-gray-800">
            5
          </h4>
        </div>
      </div>


    </div>
    </div>
  );
};