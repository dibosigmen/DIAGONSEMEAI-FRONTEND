"use client";

import React, { useEffect, useState, useRef } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { supabase } from "../../supabase";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  username: string;
  address: string;
  gender: string;
  phone: string;
  country: string;
  state: string;
  created_at: string;
}

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch user
  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("usr2")
        .select("*")
        .eq("id", "277eb16a-9372-4f66-b2b5-25a80986e2c0")
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setUserData(data);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Save (you can connect update query here)
  const handleSave = async () => {
    console.log("Saving changes...");
    closeModal();
  };

  // ✅ Delete user
  const handleDelete = async () => {
    if (!userData) return;

    const { error } = await supabase
      .from("usr2")
      .delete()
      .eq("id", userData.id);

    if (error) {
      console.error(error);
    } else {
      alert("User deleted");
      setUserData(null);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>No user found.</div>;

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          {/* USER INFO */}
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border rounded-full">
              <Image
                width={80}
                height={80}
                src="/images/user/owner.jpg"
                alt="user"
              />
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                {userData.username}
              </h4>

              <p className="text-sm text-gray-500">
                {userData.gender}
              </p>

              <p className="text-sm text-gray-500">
                {userData.address}, {userData.state}, {userData.country}
              </p>
            </div>
          </div>

          {/* OPTIONS DROPDOWN */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="px-4 py-2 text-sm bg-gray-200 rounded-lg dark:bg-gray-700"
            >
              Options
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-xl shadow-lg z-50">

                <button
                  onClick={() => {
                    openModal();
                    setMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Edit Profile
                </button>
<button
  onClick={() => {
    router.push("/adminpanel");
    setMenuOpen(false);
  }}
  className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
  Users Information
</button>
                <button
                  onClick={() => {
                    handleDelete();
                    setMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🗑 Delete User
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🚪 Logout
                </button>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl">

          <h2 className="text-xl font-semibold mb-4">
            Edit Profile
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <Label>First Name</Label>
              <Input
                defaultValue={userData.username.split(" ")[0] || ""}
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                defaultValue={userData.username.split(" ")[1] || ""}
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input defaultValue={userData.phone} />
            </div>

            <div>
              <Label>Country</Label>
              <Input defaultValue={userData.country} />
            </div>

            <div>
              <Label>State</Label>
              <Input defaultValue={userData.state} />
            </div>

            <div>
              <Label>Address</Label>
              <Input defaultValue={userData.address} />
            </div>

          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>

            <Button onClick={handleSave}>
              Save
            </Button>
          </div>

        </div>
      </Modal>
    </>
  );
}