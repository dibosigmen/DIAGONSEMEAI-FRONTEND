"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import { supabase } from "@/supabase";
interface UserData {
  id: string;
  username: string | null;
  address: string | null;
  gender: string | null;
  phone: string | null;
  country: string | null;
  state: string | null;
  created_at: string;
}

export default function AdminPanelPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
const [actionOpen, setActionOpen] = useState<string | null>(null);
  // Fetch users
  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("medbot")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setUsers(data || []);

      setLoading(false);
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-6">

      <PageBreadcrumb pageTitle="Admin Panel" />

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Users Information
        </h1>
        <p className="text-gray-500">
          All registered users list
        </p>
      </div>


      {/* CARD */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl overflow-hidden">

        {loading ? (
          <div className="p-6">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-6">No users found</div>
        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              {/* HEADER */}
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">Sl</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Gender</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>


              {/* BODY */}
              <tbody>

                {users.map((user, index) => (

                  <tr
                    key={user.id}
                    className="
                      group
                      border-t dark:border-gray-700
                      transition-all duration-200
                      hover:bg-blue-50
                      dark:hover:bg-gray-800
                      hover:shadow-lg
                      hover:scale-[1.01]
                    "
                  >

                    {/* INDEX */}
                    <td className="px-4 py-3">
                      {index + 1}
                    </td>


                    {/* USER */}
                    <td className="px-4 py-3 group-hover:text-blue-600">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                        {user.username || "N/A"}
                      </div>
                    </td>


                    {/* GENDER */}
                    <td className="px-4 py-3 group-hover:text-blue-600">
                      {user.gender || "N/A"}
                    </td>


                    {/* PHONE */}
                    <td className="px-4 py-3 group-hover:text-blue-600">
                      {user.phone || "N/A"}
                    </td>


                    {/* LOCATION */}
                    <td className="px-4 py-3 group-hover:text-blue-600">
                      {(user.state || "N/A") +
                        ", " +
                        (user.country || "")}
                    </td>


                    {/* DATE */}
                    <td className="px-4 py-3 text-sm text-gray-500 group-hover:text-blue-600">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>


                    {/* ACTIONS */}
                    <td className="px-4 py-3">

                      <div className="flex gap-2">

                        {/* VIEW */}
                        <button
                          className="p-2 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white transition"
                          title="View"
                        >
                          👁
                        </button>

                        {/* BILLING */}
                        <button
                          className="p-2 rounded-lg bg-gray-200 hover:bg-green-500 hover:text-white transition"
                          title="Billing"
                        >
                          💳
                        </button>
                      
                        {/* EDIT */}
                        <div className="relative">

  <button
    onClick={() =>
      setActionOpen(
        actionOpen === user.id ? null : user.id
      )
    }
    className="p-2 rounded-lg bg-gray-200 hover:bg-yellow-500 hover:text-white transition"
    title="Edit"
  >
    ✏
  </button>


  {actionOpen === user.id && (

    <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50">

      {/* UPDATE */}
      <button
        className="block w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => {
          console.log("Update", user.id);
          setActionOpen(null);
        }}
      >
        Update user data
      </button>


      {/* INSERT */}
      <button
        className="block w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => {
          console.log("Insert");
          setActionOpen(null);
        }}
      >
        Insert
      </button>


      {/* DELETE */}
      <button
        className="block w-full px-3 py-2 text-left text-red-500 hover:bg-red-100"
        onClick={() => {
          console.log("Delete", user.id);
          setActionOpen(null);
        }}
      >
        Delete
      </button>
                        <button
                          className="p-2 rounded-lg bg-gray-200 hover:bg-green-500 hover:text-white transition"
                          title="package"
                        >
                          💳
                        </button>
    </div>


  )}

</div>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}