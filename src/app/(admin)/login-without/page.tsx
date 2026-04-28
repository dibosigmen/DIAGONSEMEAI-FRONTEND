"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/supabase";

export default function SessionManager() {
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState("Initializing...");

 
  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    let existingSession = localStorage.getItem("session_id");

    if (!existingSession) {
      
      const newSession = crypto.randomUUID();
      localStorage.setItem("session_id", newSession);

      
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 2);

      // Save in DB
      const { error } = await supabase.from("user_sessions").insert({
        session_id: newSession,
        expires_at: expiresAt.toISOString(),
      });

      if (error) {
        console.error("Session create error:", error);
        setStatus("Error creating session");
        return;
      }

      setSessionId(newSession);
      setStatus("New session created");
    } else {
      setSessionId(existingSession);
      setStatus("Existing session loaded");

   
      await validateSession(existingSession);
    }
  };

 
  const validateSession = async (session_id) => {
    const { data, error } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("session_id", session_id)
      .single();

    if (error || !data) {
      setStatus("Session invalid, creating new...");
      localStorage.removeItem("session_id");
      initSession();
      return;
    }

    const now = new Date();
    const expiry = new Date(data.expires_at);

    if (expiry < now) {
      setStatus("Session expired, creating new...");
      localStorage.removeItem("session_id");
      initSession();
    } else {
      setStatus("Session valid");
    }
  };


  const saveDummyData = async () => {
    const session_id = localStorage.getItem("session_id");

    const { error } = await supabase.from("body_image").insert({
      session_id,
      response: "Test AI response",
    });

    if (error) {
      console.error(error);
      alert("Insert failed");
    } else {
      alert("Data saved successfully");
    }
  };


  const linkWithUser = async () => {
    const session_id = localStorage.getItem("session_id");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not logged in");
      return;
    }

    const { error } = await supabase
      .from("user_sessions")
      .update({ user_id: user.id })
      .eq("session_id", session_id);

    if (error) {
      console.error(error);
      alert("Link failed");
    } else {
      alert("Session linked to user");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Session Management System</h2>

      <p><b>Status:</b> {status}</p>
      <p><b>Session ID:</b> {sessionId}</p>

      <button onClick={saveDummyData} style={{ marginRight: "10px" }}>
        Save Data
      </button>

      <button onClick={linkWithUser}>
        Link Session After Login
      </button>
    </div>
  );
}