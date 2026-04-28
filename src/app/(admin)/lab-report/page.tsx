"use client";

import Alert from "@mui/material/Alert";
import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
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

export default function LabReport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/image-analysis2", {
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

  return (
    <div className="bg-[#0f172a] text-white min-h-screen p-8 font-sans">

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex justify-end mb-2">
          <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded-lg shadow">
            <AddIcon fontSize="small" />
            Add Medical History
          </button>
        </div>

        <div className="flex flex-col items-center justify-center">
          <SlideInText text="Lab Report Analysis" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button className="bg-green-500 px-3 py-2 rounded-lg">Summary</button>
          <button className="bg-orange-500 px-3 py-2 rounded-lg">
            Detailed Mode
          </button>
          <button className="bg-red-500 px-3 py-2 rounded-lg">
            Export PDF
          </button>

          <WhatsappShareButton
            url={"https://www.yourapp.com/lab-report"}
            title={"Check out this lab report analysis!"}
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
      </div>

     
      <div className="w-full flex flex-col md:flex-row gap-6 mb-10 items-stretch justify-center">

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <Card
            className="relative text-white shadow-xl flex flex-col justify-center min-h-[400px] p-6 w-full max-w-2xl bg-cover bg-center overflow-hidden rounded-xl"
            style={{ backgroundImage: "url('/images/bg/img5.png')" }}
          >
            {/* LIGHT OVERLAY (not dark anymore) */}
            <div className="absolute inset-0 bg-black/30"></div>
            <CardContent className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                Upload Lab Report Image
              </h2>
              {/* FILE BUTTON */}
              <label className="cursor-pointer">
                <span className="inline-block bg-white text-gray-800 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 transition">
                  Choose File
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {/* FILE NAME */}
              {file && (
                <p className="text-white text-sm mt-1 drop-shadow">
                  {file.name}
                </p>
              )}
              {loading && (
                <div className="mt-3">
                  <CircularProgress color="inherit" />
                </div>
              )}
            </CardContent>
          </Card>
          <Button
            variant="contained"
            onClick={handleUpload}
            sx={{
              mt: 3,
              bgcolor: "#06b6d4",
              fontWeight: "bold",
              px: 5,
              py: 1.5,
              borderRadius: "12px",
              textTransform: "uppercase",
              boxShadow: "0px 6px 20px rgba(0,0,0,0.3)",
              "&:hover": {
                bgcolor: "#0891b2",
              },
            }}
          >
            ANALYZE
          </Button>
        </div>

        {/* PREVIEW CARD */}
        {preview && (
          <div className="w-full md:w-1/2 flex justify-center">
            <Card className="bg-[#1e293b] text-white shadow-xl flex flex-col min-h-[350px] w-full max-w-2xl">
              <CardMedia
                component="img"
                height="250"
                image={preview}
                className="object-cover"
              />
              <CardContent className="flex justify-center items-center">
                <Typography>Uploaded Image Preview</Typography>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div className="space-y-6">

          <Accordion className="bg-[#1e293b] text-white">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Findings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {result.findings}
            </AccordionDetails>
          </Accordion>

          <Accordion className="bg-[#1e293b] text-white">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Impression</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {result.impression}
            </AccordionDetails>
          </Accordion>

          <Accordion className="bg-[#1e293b] text-white">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Summary</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {result.summary}
            </AccordionDetails>
          </Accordion>

          <Accordion className="bg-[#1e293b] text-white">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Full Report</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {result.report}
            </AccordionDetails>
          </Accordion>

        </div>
      )}
    </div>
  );
}