import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Admin() {
  const [results, setResults] = useState([]);
  const [email, setEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [newQ, setNewQ] = useState({
    id: "",
    description: "",
    A: "",
    B: "",
    C: "",
    D: "",
    correct: ""
  });

  // Fetch results
  const loadResults = async () => {
    const res = await axios.get("http://localhost:5000/admin/results");
    setResults(res.data);
  };

  useEffect(() => {
    loadResults();
  }, []);

  // Create test link
  const createTestLink = async () => {
    const res = await axios.post("http://localhost:5000/admin/create-test", { email });
    setGeneratedLink(res.data.link);
  };

  // Copy to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Copied to clipboard!");
  };

  // Add question
  const addQuestion = async () => {
    await axios.post("http://localhost:5000/admin/add-question", newQ);
    alert("Question Added!");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Admin Dashboard</h1>

      {/* CREATE TEST */}
      <div style={{
        border: "1px solid #ccc",
        padding: "25px",
        borderRadius: "10px",
        marginBottom: "30px",
        boxShadow: "0px 3px 10px rgba(0,0,0,0.1)"
      }}>
        <h2>Create Test Link</h2>

        <input
          type="email"
          placeholder="Enter user email"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px",
            border: "1px solid #aaa",
            fontSize: "16px"
          }}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button
          onClick={createTestLink}
          style={{
            padding: "10px 20px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "15px"
          }}
        >
          Generate Test Link
        </button>

        {/* Show generated link */}
        {generatedLink && (
          <div style={{ marginTop: "15px", padding: "10px", background: "#f7f7f7", borderRadius: "6px" }}>
            <p style={{ margin: 0, wordBreak: "break-all" }}>
              <b>Generated Link:</b> {generatedLink}
            </p>

            <button
              onClick={copyLink}
              style={{
                marginTop: "8px",
                padding: "8px 15px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Copy Link
            </button>
          </div>
        )}
      </div>

      {/* ADD QUESTION */}
      <div style={{
        border: "1px solid #ccc",
        padding: "25px",
        borderRadius: "10px",
        marginBottom: "30px",
        boxShadow: "0px 3px 10px rgba(0,0,0,0.1)"
      }}>
        <h2>Add Question</h2>

        {Object.keys(newQ).map(key => (
          <input
            key={key}
            placeholder={key}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #aaa",
              fontSize: "16px"
            }}
            value={newQ[key]}
            onChange={e => setNewQ({ ...newQ, [key]: e.target.value })}
          />
        ))}

        <button
          onClick={addQuestion}
          style={{
            padding: "12px 20px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "15px"
          }}
        >
          Add Question
        </button>
      </div>

      {/* RESULTS */}
      <div>
        <h2>Submitted Results</h2>

        {results.map(r => (
          <div
            key={r.testId}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "15px",
              background: "white",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.08)"
            }}
          >
            <p><b>Email:</b> {r.email}</p>
            <p><b>Score:</b> {r.score ?? "Not submitted yet"}</p>
            <p><b>Test ID:</b> {r.testId}</p>
            <p><b>Created:</b> {r.createdAt}</p>
            {r.submittedAt && <p><b>Submitted:</b> {r.submittedAt}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
