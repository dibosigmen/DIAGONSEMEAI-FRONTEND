"use client";

import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { supabase } from "@/supabase";

interface HistoryItem {
  id: number;
  name: string;
  address: string;
  country: string;
}

export default function EncryptionPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const secretKey = "#1234abcd1234";

  const resetForm = () => {
    setName("");
    setAddress("");
    setCountry("");
    setEditingId(null);
  };

  const handleEdit = (item: HistoryItem) => {
    setEditingId(item.id);
    setName(decryptText(item.name));
    setAddress(decryptText(item.address));
    setCountry(decryptText(item.country));
  };

  // 🔐 Encrypt
  const encryptText = (text: string) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  };

  // 🔍 Check encrypted
  const isEncrypted = (text: string) => {
    return text.includes("U2FsdGVk");
  };

  // 🔓 Decrypt
  const decryptText = (text: string) => {
    try {
      if (!isEncrypted(text)) return text;

      const bytes = CryptoJS.AES.decrypt(text, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8) || "Decryption failed";
    } catch {
      return "Decryption failed";
    }
  };

  // 📥 Fetch
  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("user_history")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);


  const handleSubmit = async () => {
    if (!name || !address || !country) {
      return alert("Fill all fields");
    }

    const payload = {
      name: encryptText(name),
      address: encryptText(address),
      country: encryptText(country),
    };

    if (editingId) {
      const { error } = await supabase
        .from("user_history")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        console.error(error);
        alert("Update failed ❌");
      } else {
        resetForm();
        fetchHistory();
      }
      return;
    }

    const { error } = await supabase.from("user_history").insert([payload]);

    if (error) {
      console.error(error);
      alert("Insert failed ❌");
    } else {
      resetForm();
      fetchHistory();
    }
  };

  const handleUpdate = (item: HistoryItem) => {
    handleEdit(item);
  };

  // ❌ DELETE
  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("user_history")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Delete failed ❌");
    } else {
      fetchHistory();
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Encrypted Database System
      </h1>

      {/* Inputs */}
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      <input
        type="text"
        placeholder="Enter Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      <input
        type="text"
        placeholder="Enter Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      {/* Insert */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Save Changes" : "Encrypt & Save"}
        </button>
        {editingId && (
          <button
            onClick={resetForm}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      <h2 className="font-bold mt-6 mb-2">User History</h2>

      {history.map((item) => (
        <div key={item.id} className="border p-3 mb-2 rounded bg-gray-50">
          {/* Encrypted */}
          <p><b>Encrypted Name:</b> {item.name}</p>
          <p><b>Encrypted Address:</b> {item.address}</p>
          <p><b>Encrypted Country:</b> {item.country}</p>

          {/* Decrypted */}
          <p className="text-green-700">
            <b>Decrypted Name:</b> {decryptText(item.name)}
          </p>
          <p className="text-green-700">
            <b>Decrypted Address:</b> {decryptText(item.address)}
          </p>
          <p className="text-green-700">
            <b>Decrypted Country:</b> {decryptText(item.country)}
          </p>

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleUpdate(item.id)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Update
            </button>

            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}