"use client";

import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { supabase } from "@/supabase";
import { PieChart } from "@mui/x-charts/PieChart";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

const GROQ_API_KEY = "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";

type Summary = {
  id: number;
  summary: string;
  created_at: string;
  user_id: string;
  status?: boolean | null;
};

const MedicalHistory: React.FC = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [groqChartData, setGroqChartData] = useState<any[]>([]);
  const [notepadOpen, setNotepadOpen] = useState(false);
  const [notepadValue, setNotepadValue] = useState("");
  const [notes, setNotes] = useState<string[]>([]);

  
  useEffect(() => {
    const fetchSummaries = async () => {
      setLoading(true);

      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setSummaries([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("summary_master")
        .select("id, summary, created_at, user_id, status")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setSummaries([]);
        setLoading(false);
        return;
      }

      const filtered = (data || []).filter((row) => row.status !== null);
      setSummaries(filtered);

      if (filtered.length > 0) {
        const allText = filtered.map(s => s.summary).join("\n");
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: [
                {
                  role: "system",
                  content: "You are a medical data analyst. Given the following medical summaries, extract the 5-7 most important medical issues, findings, or keywords, and count how many times each appears. Respond ONLY with a JSON array of objects with 'label' and 'value' (frequency), e.g. [{\"label\":\"back pain\",\"value\":3},...]"
                },
                {
                  role: "user",
                  content: allText
                }
              ],
              temperature: 0.2
            })
          });
          const groqData = await groqRes.json();
          let content = groqData.choices?.[0]?.message?.content || "";
          
          let parsed = [];
          try {
            parsed = JSON.parse(content);
          } catch {
          
          const match = content.match(/\[[\s\S]*?\]/);
            if (match) parsed = JSON.parse(match[0]);
          }
          // Map to PieChart format
          setGroqChartData(
            (parsed || []).map((item: any, idx: number) => ({
              id: idx,
              label: item.label,
              value: item.value
            }))
          );
        } catch (e) {
          setGroqChartData([]);
        }
      }

      setLoading(false);
    };

    fetchSummaries();
  }, []);



  const extractPoints = (text: string) => {
    return text
      .split(/\n|\r|\.|\u2022|\-/)
      .map((l) => l.trim().toLowerCase())
      .filter(Boolean);
  };

  const allPoints = summaries.flatMap((s) => extractPoints(s.summary));
  const uniquePoints = Array.from(new Set(allPoints)).slice(0, 15);

  return (
    <div className="p-6">
     <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">
  Medical History of patient according to Radiology Report
</h1>

      {loading ? (
        <div>Loading...</div>
      ) : summaries.length === 0 ? (
        <div>No medical history found.</div>
      ) : (
        <>
   

          <div className="mb-6">
            <Accordion defaultExpanded className="rounded-xl shadow border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <span className="font-semibold text-blue-900 text-lg">Key Medical Insights</span>
              </AccordionSummary>
              <AccordionDetails>
                <ul className="list-disc ml-6 mb-4">
                  {uniquePoints.map((point, idx) => (
                    <li key={idx} className="text-blue-900 text-base">{point.charAt(0).toUpperCase() + point.slice(1)}</li>
                  ))}
                </ul>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ borderRadius: 8, fontWeight: 600 }}
                    onClick={() => setNotepadOpen(true)}
                  >
                    Add Context
                  </Button>
                          {/* Notepad Modal for manual context input */}
                          <Dialog open={notepadOpen} onClose={() => setNotepadOpen(false)} maxWidth="sm" fullWidth>
                            <DialogTitle>Add Context Note</DialogTitle>
                            <DialogContent>
                              <TextField
                                label="Write additional context or upload info"
                                multiline
                                minRows={5}
                                value={notepadValue}
                                onChange={e => setNotepadValue(e.target.value)}
                                variant="outlined"
                                fullWidth
                                autoFocus
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={() => setNotepadOpen(false)} color="secondary">Cancel</Button>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  if (notepadValue.trim()) {
                                    setNotes(prev => [notepadValue, ...prev]);
                                    setNotepadValue("");
                                  }
                                  setNotepadOpen(false);
                                }}
                              >
                                Save
                              </Button>
                            </DialogActions>
                          </Dialog>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

   
      
          {notes.length > 0 && (
            <Paper className="p-4 mb-6 bg-yellow-50 border-l-4 border-yellow-400">
              <h2 className="text-lg font-semibold mb-2 text-yellow-900">Added to memory</h2>
              <ul className="list-disc ml-6">
                {notes.map((note, idx) => (
                  <li key={idx} className="text-yellow-900 whitespace-pre-line">{note}</li>
                ))}
              </ul>
            </Paper>
          )}

          <Paper className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              Health Chart :- Important medical issues extracted from history
            </h2>

            {groqChartData.length > 0 ? (
              <PieChart
                series={[
                  {
                    data: groqChartData,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                height={300}
              />
            ) : (
              <div>No chart data available</div>
            )}
          </Paper>
        </>
      )}
    </div>
  );
};

export default MedicalHistory;