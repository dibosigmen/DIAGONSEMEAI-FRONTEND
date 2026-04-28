"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

function CameraModal({ open, onClose, onCapture }: { open: boolean; onClose: () => void; onCapture: (file: File, previewUrl: string) => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  React.useEffect(() => {
    if (open) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) videoRef.current.srcObject = mediaStream;
        })
        .catch(() => {
          alert("Unable to access camera");
          onClose();
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
    // Cleanup on unmount
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line
  }, [open]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(file);
      onCapture(file, previewUrl);
      onClose();
    }, "image/jpeg");
  };

  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ background: "#111827", borderRadius: 16, padding: 24, boxShadow: "0 8px 32px #0008", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <video ref={videoRef} width={320} height={240} autoPlay playsInline style={{ borderRadius: 12, background: "#222", objectFit: "cover" }} />
        <canvas ref={canvasRef} width={320} height={240} style={{ display: "none" }} />
        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <Button variant="contained" color="primary" onClick={handleCapture} sx={{ bgcolor: "#10b981", fontWeight: "bold" }}>Capture</Button>
          <Button variant="outlined" color="secondary" onClick={onClose} sx={{ color: "#fff", borderColor: "#fff" }}>Close</Button>
        </div>
      </div>
    </div>
  );
}
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { supabase } from "@/supabase";
const SlideInText = ({ text }: { text: string }) => (
  <h1 className="text-4xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: i * 0.015 }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </h1>
);
export default function BodyImageAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  // When a photo is captured from camera modal
  const handleCameraCapture = async (capturedFile: File, previewUrl: string) => {
    setFile(capturedFile);
    setPreview(previewUrl);
    setResult(null);
    setLoading(true);
    await analyzeImageFile(capturedFile);
    setLoading(false);
  };

  // Camera modal handles all camera logic now

  const analyzeImageFile = async (fileToAnalyze: File) => {
    const formData = new FormData();
    formData.append("file", fileToAnalyze);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8002/api/body_image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    await analyzeImageFile(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white p-6 md:p-10">
      {/* Camera Modal */}
      <CameraModal open={cameraModalOpen} onClose={() => setCameraModalOpen(false)} onCapture={handleCameraCapture} />

    <div className="flex">
  <button className="ml-auto flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl shadow-lg transition"
    onClick={() => router.push("/med-history")}>
      <AddIcon fontSize="small" />
      Medical History
    </button>
</div>

      
      <div className="mb-12">
        <SlideInText text="Body Image Analysis" />
        <p className="text-center mt-4 text-gray-400 max-w-xl mx-auto">
          Upload a body image to detect posture, anomalies, or visual indicators
          using AI-powered medical analysis.
        </p>
      </div>

      {/* MAIN SECTION */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* UPLOAD CARD */}
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl flex flex-col justify-center items-center p-8">
          <CardContent className="text-center space-y-5 w-full">
            <Typography variant="h5" className="font-bold">
              Upload or Capture Image
            </Typography>
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-cyan-400/50 rounded-xl px-6 py-10 hover:bg-cyan-400/10 transition">
                <p className="text-gray-300">Click or drag image here</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setCameraModalOpen(true)}
                sx={{
                  bgcolor: "#f97316",
                  px: 4,
                  py: 1,
                  borderRadius: "8px",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#ea580c" },
                }}
              >
                📷 Camera
              </Button>
            </div>
            {file && (
              <p className="text-sm text-gray-400">{file.name}</p>
            )}
            {loading && <CircularProgress color="inherit" />}
          </CardContent>
          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            sx={{
              mt: 2,
              bgcolor: "#06b6d4",
              px: 6,
              py: 1.5,
              borderRadius: "10px",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#0891b2" },
            }}
          >
            Analyze Image
          </Button>
        </Card>
        {/* PREVIEW */}
        {preview && (
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl">
            <CardMedia
              component="img"
              image={preview}
              className="h-[300px] object-cover rounded-t-2xl"
            />
            <CardContent>
              <Typography className="text-center text-gray-300">
                Preview
              </Typography>
            </CardContent>
          </Card>
        )}
      </div>
      {loading && (
        <div className="flex flex-col items-center mt-12">
          <CircularProgress color="inherit" />
          <p className="mt-4 text-cyan-300 font-semibold">Analyzing image...</p>
        </div>
      )}
      {result && !loading && (
        <div className="mt-12 space-y-4 text-bold-black">
          {["findings", "impression", "summary", "report"].map((key) => (
            <Accordion
              key={key}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon className="text-black" />}>
                <Typography className="capitalize font-semibold">
                  {key}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="text-black-300">
                {result[key]}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
}