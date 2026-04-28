"use client";
import React from "react";
import { supabase } from "@/supabase";
interface ConsultationFormProps {
  onClose?: () => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ onClose }) => {
  const [form, setForm] = React.useState({
    caregiverName: "",
    email: "",
    phone: "",
    patientName: "",
    patientAge: "",
    primaryConcern: "",
    additionalMessage: "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSkip = () => {
    if (onClose) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
     
      alert("Form submitted!\n" + JSON.stringify(form, null, 2));
      if (onClose) onClose();
    } catch (err) {
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: "700px",
      background: "#fff",
      borderRadius: "12px",
      padding: "30px",
      position: "relative",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    closeBtn: {
      position: "absolute",
      right: "15px",
      top: "10px",
      border: "none",
      background: "transparent",
      fontSize: "22px",
      cursor: "pointer",
    },
    title: {
      textAlign: "center",
      marginBottom: "25px",
    },
    formGrid: {
      display: "flex",
      gap: "20px",
    },
    column: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    input: {
      padding: "12px",
      border: "none",
      background: "#eef3f3",
      borderRadius: "4px",
      fontSize: "14px",
    },
    textarea: {
      padding: "12px",
      border: "none",
      background: "#eef3f3",
      borderRadius: "4px",
      fontSize: "14px",
      height: "100px",
      resize: "none",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginTop: "25px",
    },
    submitBtn: {
      background: "#18b394",
      color: "#fff",
      padding: "10px 30px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    skipBtn: {
      background: "transparent",
      border: "1px solid #ccc",
      padding: "10px 30px",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <button style={styles.closeBtn} onClick={handleClose} aria-label="Close">×</button>

        <h2 style={styles.title}>Book a Free Consultation</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.column}>
              <input
                style={styles.input}
                type="text"
                name="caregiverName"
                placeholder="Caregiver Name"
                value={form.caregiverName}
                onChange={handleChange}
                required
              />
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                style={styles.input}
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <input
                style={styles.input}
                type="text"
                name="patientName"
                placeholder="Patient's Name"
                value={form.patientName}
                onChange={handleChange}
                required
              />
              <input
                style={styles.input}
                type="number"
                name="patientAge"
                placeholder="Patient's Age"
                value={form.patientAge}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.column}>
              <textarea
                style={styles.textarea}
                name="primaryConcern"
                placeholder="Primary concern"
                value={form.primaryConcern}
                onChange={handleChange}
                required
              />
              <textarea
                style={styles.textarea}
                name="additionalMessage"
                placeholder="Additional message"
                value={form.additionalMessage}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" style={styles.skipBtn} onClick={handleSkip} disabled={submitting}>Skip</button>
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationForm;