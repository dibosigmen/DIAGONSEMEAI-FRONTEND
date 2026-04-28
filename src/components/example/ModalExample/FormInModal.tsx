"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import { supabase } from "@/supabase";

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

export default function FormInModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Error loading user data123.</div>;
  }

  return (
    <ComponentCard title="Form In Modal">
      <Button size="sm" onClick={openModal}>
        Open Modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form className="">
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>First Name</Label>
              <Input type="text" defaultValue={userData.username.split(' ')[0] || ''} />
            </div>

            <div className="col-span-1">
              <Label>Last Name</Label>
              <Input type="text" defaultValue={userData.username.split(' ')[1] || ''} />
            </div>

            <div className="col-span-1">
              <Label>Email</Label>
              <Input type="email" defaultValue="" />
            </div>

            <div className="col-span-1">
              <Label>Phone</Label>
              <Input type="text" defaultValue={userData.phone} />
            </div>

            <div className="col-span-1">
              <Label>Country</Label>
              <Input type="text" defaultValue={userData.country} />
            </div>

            <div className="col-span-1">
              <Label>State</Label>
              <Input type="text" defaultValue={userData.state} />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label>Bio</Label>
              <Input type="text" defaultValue={userData.gender} />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label>Created At</Label>
              <Input type="text" defaultValue={new Date(userData.created_at).toLocaleString()} readOnly />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </ComponentCard>
  );
}
