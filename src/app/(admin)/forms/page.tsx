"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {
  ChevronLeftIcon,
  EyeCloseIcon,
  EyeIcon,
} from "@/icons";

import Link from "next/link";


import { useAuth } from "@/context/auth";
import { supabase } from "@/supabase";

const forms = [
  {
    title: "Personal Information",
    fields: ["Full Name", "Age", "Gender", "Phone"]
  },
  {
    title: "Your reports",
    fields: ["Any chronic disease?", "Past surgeries", "Allergies", "Medications"]
  },
  {
    title: "Lifestyle",
    fields: ["Smoking?", "Alcohol?", "Exercise frequency", "Diet type"]
  },
  {
    title: "Tutorial Video",
    video: "/images/video/vdeo.mp4"
  },
  {
    title: "Emergency Contact",
    fields: ["Contact Name", "Relation", "Phone", "Address"]
  }
];


export default function MultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const filledFields = Object.values(formData).filter(v => v && v !== "").length;
  const totalFields = forms.reduce((acc, f) => acc + (Array.isArray(f.fields) ? f.fields.length : 0), 0);
  const progress = (filledFields / totalFields) * 100;

  const nextStep = () => {
    if (step < forms.length - 1) {
      setStep(step + 1);
    } else {
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2,2);
  const guestName = "Guest" +" " + uniqueId;

  localStorage.setItem("username", guestName);
     
      router.push("/");
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2966/2966480.png"
          alt="medical"
          className="w-16 mx-auto mb-4"
        />

        <h2 className="text-xl font-bold text-center mb-4">
          {forms[step].title}
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
          >
            {forms[step].fields && Array.isArray(forms[step].fields) && forms[step].fields.map((field: string, index: number) => (
              <input
                key={index}
                type="text"
                placeholder={field}
                className="w-full mb-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onChange={(e) => handleChange(field, e.target.value)}
                value={formData[field] || ""}
              />
            ))}
            {forms[step].video && (
              <video controls className="w-full rounded-lg mt-4">
                <source src={forms[step].video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Skip
          </button>
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {step === forms.length - 1 ? "Finish" : "Next"}
          </button>
        </div>

        {progress >= 60 && (
          <div className="mt-4 text-green-600 text-center font-semibold">
            Minimum 60% completed to proceed to diagnosis
          </div>
        )}
      </div>
    </div>
  );
}
