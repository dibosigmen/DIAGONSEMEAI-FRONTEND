
"use client";

import React, { useState, useEffect, useRef } from "react";
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import jsPDF from "jspdf";
import { supabase } from "@/supabase";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { FaPlus, FaRegFileAlt, FaChartLine } from "react-icons/fa";

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const SlideInText = ({ text }: { text: string }) => {
    return (
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </h1>
    );
};

export default function RadImageAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [report, setReport] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [showSummaryOnly, setShowSummaryOnly] = useState(false);

    const webcamRef = useRef<Webcam | null>(null);
    const [cameraOn, setCameraOn] = useState(false);

  

    const router = useRouter();

  
    const handleSummaryMode = () => {
        setShowSummaryOnly((prev) => !prev);
    };

    useEffect(() => {
        const getUser = async () => {
            let storedId = localStorage.getItem("user_id");
            let storedUsername = localStorage.getItem("username");
            if (storedId) setUserId(storedId);
            if (storedUsername) setUsername(storedUsername);

            const { data } = await supabase.auth.getUser();
            if (data?.user?.id) {
                setUserId(data.user.id);
                localStorage.setItem("user_id", data.user.id);
                const uname = data.user.user_metadata?.username || data.user.email || data.user.id;
                setUsername(uname);
                localStorage.setItem("username", uname);
            }
        };
        getUser();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setReport("");
            setError("");
        }
    };

    const captureImage = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setPreview(imageSrc);

            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "captured.png", { type: "image/png" });
                    setFile(file);
                });
        }
    };

    const analyzeImage = async () => {
        if (!file) return setError("Upload or capture image first");

        let uid = userId || localStorage.getItem("user_id");
        let uname = username || localStorage.getItem("username");
        let fallbackName = "unknown_user";
        let usedName = uname || fallbackName;
        if (!uid) {
            setError("User session not found. Please login again.");
            return;
        }

        setLoading(true);

        try {
     
            const ext = file.name.split(".").pop();
            const imgFileName = `${usedName}_${Date.now()}.${ext}`;
            const filePath = `${uid}/${imgFileName}`;
            await supabase.storage.from("image").upload(filePath, file);

          
            if (!uname) {
                await supabase.from('image_user_map').insert([
                    {
                        user_id: uid,
                        image_filename: imgFileName,
                        created_at: new Date().toISOString(),
                    }
                ]);
            }

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("http://localhost:8000/api/image-analysis", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setReport(data.report);
            setSummary(data.summary || "");

            const { data: userRow } = await supabase
                .from('usr2')
                .select('id')
                .eq('username', uname)
                .single();

            let usr2Id = userRow?.id || uid;


            // Insert into summary_master and get the id
            const { data: masterRows, error: masterError } = await supabase
                .from('summary_master')
                .insert([{
                    user_id: usr2Id,
                    summary: data.summary || "",
                    created_at: new Date().toISOString(),
                    created_by: usedName,
                    status: true
                }])
                .select();
            if (masterError) throw masterError;
            const summaryMasterId = masterRows?.[0]?.id;

            // Insert into summary_child with the correct summary_master_id
            if (summaryMasterId) {
                await supabase.from('summary_child').insert([{
                    summary_master_id: summaryMasterId,
                    summary: data.summary || "",
                    module_name: "Radiology"
                }]);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Radiology Diagnostic Report", 10, 20);
        doc.setFontSize(12);
        doc.text(report || "No report generated yet.", 10, 40, { maxWidth: 180 });
        doc.save("diagnostic_report.pdf");
    };
const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  console.log(files[0]);
};



    // Upload menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [uploadType, setUploadType] = useState<string | null>(null);
    const open = Boolean(anchorEl);

    // File input refs
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const imgInputRef = useRef<HTMLInputElement>(null);
    const dcmInputRef = useRef<HTMLInputElement>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleMenuItemClick = (type: string) => {
        setUploadType(type);
        setAnchorEl(null);
        // Trigger the correct file input
        if (type === 'pdf' && pdfInputRef.current) pdfInputRef.current.click();
        if (type === 'image' && imgInputRef.current) imgInputRef.current.click();
        if (type === 'dicom' && dcmInputRef.current) dcmInputRef.current.click();
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#050510] via-[#0a0a1a] to-[#000000] text-white">

            <main className="flex-1 p-6 md:p-12">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* HEADER ROW WITH TITLE AND MEDICAL HISTORY BUTTON */}
                    <div className="flex justify-between items-center mb-8">
                        <SlideInText text="Radiology Image Analysis" />
                        <button
                            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl shadow-lg transition"

                            onClick={() => router.push('/med-history')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Medical History
                        </button>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                        <div className="bg-[#f3f4f6] rounded-xl shadow flex flex-row gap-0 p-1 border border-gray-200">
                            <button
                                className="px-4 py-2  bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center gap-2"
                                onClick={() => router.push('/simple-mode')}
                            >
                                <FaChartLine className="text-lg" /> Simple Mode
                            </button>
                            <button
                                className="px-4 py-2  bg-red-500 hover:bg-red-600 text-white font-semibold border-r border-white flex items-center gap-2 disabled:opacity-60"
                                onClick={() => router.push('/detailed')}
                            >
                                <FaRegFileAlt className="text-lg" /> Detail Mode
                            </button>
                            <button
                                className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold border-r border-white flex items-center gap-2`}
                                onClick={() => router.push(`/user-wise-summary/${userId}`)}
                            >
                                <FaChartLine className="text-lg" />
                                Summary Mode
                            </button>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                        <div className="flex flex-col gap-3 mb-4">
                            <div>
                               
                                <Button
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}
                                    onClick={handleMenuClick}
                                >
                                    Upload
                                </Button>
                                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                                    <MenuItem onClick={() => handleMenuItemClick('pdf')}>Upload PDF</MenuItem>
                                    <MenuItem onClick={() => handleMenuItemClick('image')}>Upload Image (JPG/PNG)</MenuItem>
                                    <MenuItem onClick={() => handleMenuItemClick('dicom')}>Upload DICOM</MenuItem>
                                </Menu>
                               
                                <input
                                    ref={pdfInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    style={{ display: 'none' }}
                                    onChange={handleUpload}
                                />
                                <input
                                    ref={imgInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleUpload}
                                />
                                <input
                                    ref={dcmInputRef}
                                    type="file"
                                    accept=".dcm,application/dicom"
                                    style={{ display: 'none' }}
                                    onChange={handleUpload}
                                />
                            </div>
                        </div>

                        {cameraOn ? (
                            <Webcam ref={webcamRef} screenshotFormat="image/png" className="rounded-xl w-full h-[280px]" />
                        ) : (
                            <label className="cursor-pointer">
                                <div className="h-[280px] border-2 border-dashed rounded-xl flex items-center justify-center">
                                    {preview ? (
                                        <img src={preview} className="max-h-full rounded-lg" />
                                    ) : (
                                        <div className="text-center">
                                            <FaPlus className="mx-auto text-3xl text-cyan-400" />
                                            Upload Image
                                        </div>
                                    )}
                                </div>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        )}

                        <button onClick={analyzeImage} className="mt-5 w-full py-3 bg-cyan-400 text-black rounded-xl">
                            {loading ? "Analyzing..." : "Analyze Image"}
                        </button>

                        {error && <p className="text-red-400 mt-3">{error}</p>}
                    </div>

                  
                    <div className="p-10 rounded-3xl bg-white/5 border border-white/10">

                        <div className="max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg">
    
                        <h3 className="text-cyan-400 mb-5 font-semibold text-center text-lg">
                        Diagnostic Report
                        </h3>
                        </div>

                        <div className="flex justify-center mb-6">
                        
                        </div>


                                                {loading && (
                                                    <div className="flex flex-col items-center justify-center py-8">
                                                        <CircularProgress size={60} thickness={5} sx={{ color: '#22c55e' }} />
                                                        <span className="mt-4 text-green-400 font-semibold">Analyzing AI...</span>
                                                    </div>
                                                )}

                      

                        {report && (
                            <div className="space-y-4">
                             
                                {!showSummaryOnly && (
                                    <details open className="bg-black/10 rounded-lg p-4">
                                        <summary className="font-semibold cursor-pointer">Full Report</summary>
                                        <div className="whitespace-pre-line mt-2">{report}</div>
                                    </details>
                                )}
                                
                                <details open className="bg-black/10 rounded-lg p-4">
                                    <summary className="font-semibold cursor-pointer">Summary</summary>
                                    <div className="whitespace-pre-line mt-2">{summary}</div>
                                </details>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}