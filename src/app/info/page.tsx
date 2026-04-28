"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { supabase } from "@/supabase";

export default function InfoPage() {
  const router = useRouter();
  const { session } = useAuth();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // normalize gender
  const normalizeGender = (g: string) => {
    if (!g) return null;
    const val = g.toLowerCase();
    if (val === "male") return "Male";
    if (val === "female") return "Female";
    if (val === "other") return "Other";
    return null;
  };


  const handleSubmit = async (e: any) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    if (!name) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }




    if (!session?.user) {
      setError("Please sign in first");
      setLoading(false);
      return;
    }



    const { error: dbError } = await supabase
      .from("usr2")
      .upsert(
        {
          id: session.user.id,
          username: name,
          address,
          gender: normalizeGender(gender),
          phone,
          country,
          state: stateRegion,
        },
        { onConflict: "id" }
      );

    if (dbError) {
      console.error("Database error:", dbError);
      setError(`Database error: ${dbError.message}`);
      setLoading(false);
      return;
    }


    // 3️⃣ fetch user_code and username

    const { data: profile } = await supabase
      .from("usr2")
      .select("user_code, username")
      .eq("id", session.user.id)
      .single();


    if (profile?.user_code) {

      localStorage.setItem("user_id", session.user.id);
      localStorage.setItem("user_code", profile.user_code);

    }

    if (profile?.username) {
      localStorage.setItem("username", profile.username);
    } else if (name) {
      localStorage.setItem("username", name);
    }


    // 4️⃣ show success and redirect to dashboard

    alert("Profile completed successfully!");
    console.log(session.user.id);
    router.push("/");

    setLoading(false);

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">

      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Complete Your Profile
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Tell us more about yourself
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">


          <Input
            placeholder="Full Name *"
            onChange={(e: any) => setName(e.target.value)}
          />



          <Input
            placeholder="Address"
            onChange={(e: any) => setAddress(e.target.value)}
          />


          <select
            className="w-full border rounded-lg p-2"
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>


          <Input
            placeholder="Phone"
            onChange={(e: any) => setPhone(e.target.value)}
          />

          <Input
            placeholder="Country"
            onChange={(e: any) => setCountry(e.target.value)}
          />

          <Input
            placeholder="State"
            onChange={(e: any) => setStateRegion(e.target.value)}
          />




          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}


          <Button className="w-full" disabled={loading}>

            {loading ? "Saving..." : "Complete Profile"}

          </Button>

        </form>

      </div>

    </div>
  );
}