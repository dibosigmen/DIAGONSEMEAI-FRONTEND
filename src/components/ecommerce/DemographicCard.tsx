"use client";

import Image from "next/image";
import { useState } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function UpcomingConsultationsCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 
    shadow-sm hover:shadow-lg transition-all duration-300">

      {/* Header */}

      <div className="flex justify-between items-start">

        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Upcoming Consultations
          </h3>

          <p className="text-sm text-gray-500">
            Join or reschedule your appointments
          </p>
        </div>

        <div className="relative">
          <button onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700" />
          </button>

          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">

            <DropdownItem onItemClick={closeDropdown}>
              View All
            </DropdownItem>

            <DropdownItem onItemClick={closeDropdown}>
              Settings
            </DropdownItem>

          </Dropdown>
        </div>
      </div>



      {/* Doctor List */}

      <div className="mt-6 space-y-4">


        {/* Doctor 1 */}

        <div className="flex items-center justify-between 
        p-4 rounded-xl border bg-gray-50">

          <div className="flex items-center gap-3">

            <Image
              src="/images/doctors/img2.jpg"
              width={40}
              height={40}
              alt="doctor"
              className="rounded-full"
            />

            <div>

              <p className="font-semibold text-gray-800">
                Dr. Rahul Sen
              </p>

              <span className="text-xs text-gray-500">
                Senior Cardiologist • 5:30 PM
              </span>

            </div>

          </div>


          <div className="flex gap-2">

            <button
              className="px-3 py-1 text-sm rounded-lg 
              bg-blue-500 text-white hover:bg-blue-600"
            >
              Join
            </button>

            <button
              className="px-3 py-1 text-sm rounded-lg 
              bg-gray-200 hover:bg-gray-300"
            >
              Reschedule
            </button>

          </div>

        </div>



        {/* Doctor 2 */}

        <div className="flex items-center justify-between 
        p-4 rounded-xl border bg-gray-50">

          <div className="flex items-center gap-3">

            <Image
              src="/images/doctors/img2.jpg"
              width={40}
              height={40}
              alt="doctor"
              className="rounded-full"
            />

            <div>

              <p className="font-semibold text-gray-800">
                Dr. Priya Sharma
              </p>

              <span className="text-xs text-gray-500">
                Neurologist • 7:00 PM
              </span>

            </div>

          </div>


          <div className="flex gap-2">

            <button
              className="px-3 py-1 text-sm rounded-lg 
              bg-green-500 text-white hover:bg-green-600"
            >
              Join
            </button>

            <button
              className="px-3 py-1 text-sm rounded-lg 
              bg-gray-200 hover:bg-gray-300"
            >
              Reschedule
            </button>

          </div>

        </div>



        {/* Doctor 3 */}

        <div className="flex items-center justify-between 
        p-4 rounded-xl border bg-gray-50">

          <div className="flex items-center gap-3">

            <Image
              src="/images/doctors/img2.jpg"
              width={40}
              height={40}
              alt="doctor"
              className="rounded-full"
            />

            <div>

              <p className="font-semibold text-gray-800">
                Dr. Amit Roy
              </p>

              <span className="text-xs text-gray-500">
                General Physician • 9:00 PM
              </span>

            </div>

          </div>


          <div className="flex gap-2">

            <button
              className="px-3 py-1 text-sm rounded-lg 
              bg-purple-500 text-white hover:bg-purple-600"
            >
              Join
            </button>

            <button
              className="px-3 py-1 text-sm rounded-lg 
              bg-gray-200 hover:bg-gray-300"
            >
              Reschedule
            </button>

          </div>

        </div>


      </div>
    </div>
  );
}