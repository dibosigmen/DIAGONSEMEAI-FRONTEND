"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/supabase";
import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import jsPDF from "jspdf";

type User = {
  username: string;
};

type Summary = {
  id: number;
  summary: string;
  created_at: string;
  user_id: string;
  usr2?: User[];
  status?: boolean | null;
};

export default function UserSummaryDetailsPage() {
  const params = useParams();
  const userId = params?.userId as string;

  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [username, setUsername] = useState<string>("");

  // Soft delete support: status === null means deleted
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("summary_master")
        .select("id, summary, created_at, user_id, usr2(username), status")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      // Only show not-deleted (status !== null)
      setSummaries((data || []).filter((row) => row.status !== null));

      let uname = data?.[0]?.usr2?.[0]?.username || "";

      if (!uname) {
        const { data: userRow } = await supabase
          .from("usr2")
          .select("username")
          .eq("id", userId)
          .single();

        uname = userRow?.username || userId;
      }

      setUsername(uname);
    };

    fetchData();
  }, [userId]);
  // Soft delete handler
  const handleSoftDelete = async (id: number) => {
    await supabase
      .from("summary_master")
      .update({ status: null })
      .eq("id", id);
    setSummaries((prev) => prev.filter((row) => row.id !== id));
  };


  const generatePDF = (row: Summary) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Summary Report", 20, 20);

    doc.setFontSize(12);
    const res=username
  const text = username
  .split(" ")
  .map(word => word.charAt(0))
  .join("");
    doc.text(`User: ${text}`, 20, 40);
    doc.text(
      `Date: ${new Date(row.created_at).toLocaleString()}`,
      20,
      50
    );

    const status =
      row.status === true
        ? "Completed"
        : row.status === false
        ? "Pending"
        : "true";

    doc.text(`Status: ${status}`, 20, 60);

    doc.text("Summary:", 20, 80);

    // Multi-line support
    const splitText = doc.splitTextToSize(row.summary, 170);
    doc.text(splitText, 20, 90);

    doc.save(`summary_${row.id}.pdf`);
  };

  const columns: GridColDef[] = [
    {
      field: "summary",
      headerName: "Summary",
      flex: 1,
    },
    {
      field: "created_at",
      headerName: "Date",
      flex: 1,
      valueGetter: (params: any) =>
        params?.value
          ? new Date(params.value).toLocaleString()
          : "",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      valueGetter: (params: any) => {
        if (params?.value === true) return "Completed";
        if (params?.value === false) return "Pending";
        return "true";
      },
    },
    {
      field: "pdf",
      headerName: "Download",
      flex: 1,
      renderCell: (params: any) => (
        <Button
          variant="contained"
          color="success"
          onClick={() => generatePDF(params.row)}
        >
          PDF
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      renderCell: (params: any) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleSoftDelete(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const rows = summaries.map((row) => ({
    id: row.id,
    summary: row.summary,
    created_at: row.created_at,
    status: row.status,
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Summaries for: {username}
        </h1>
      </div>

      <Paper sx={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}