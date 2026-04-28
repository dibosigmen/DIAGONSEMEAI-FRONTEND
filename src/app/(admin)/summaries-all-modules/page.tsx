"use client";

import { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import TextField from "@mui/material/TextField";
import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import IconButton from "@mui/material/IconButton";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Tooltip from "@mui/material/Tooltip";
import { supabase } from "@/supabase";
export default function RadSummariesPage() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("rad_summaries") || "[]");
    setRows(local);
  }, []);

  const filteredRows = rows.filter((row) =>
    `${row.module} ${row.summary} ${row.date}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Summaries of RAD Modules" />

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Radiology Summaries
      </h1>

      <Box className="mb-6">
        <TextField
          fullWidth
          label="Search summaries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Summary</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">PDF</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => {
                  setSelectedReport(row.report);
                  setShowReport(true);
                }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.module}</TableCell>
                <TableCell>{row.summary}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Open PDF">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (row.pdf_url)
                          window.open(row.pdf_url, "_blank");
                      }}
                    >
                      <PictureAsPdfIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 40, right: 40 }}
        onClick={() => alert("Add new summary")}
      >
        <AddIcon />
      </Fab>

      {showReport && (
        <div
          onClick={() => setShowReport(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 10,
              maxWidth: 600,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2>Full Report</h2>
            <p style={{ whiteSpace: "pre-line" }}>
              {selectedReport}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}