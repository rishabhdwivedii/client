import React, { useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Admin() {
  const [results, setResults] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

  // FETCH RESULTS
  const loadResults = async () => {
    const res = await axios.get(`${API_BASE_URL}/admin/results`);
    setResults(res.data);
    setSortedResults(res.data);
  };

  useEffect(() => {
    loadResults();
  }, []);

  // CREATE TEST LINK
  const createTestLink = async () => {
    const res = await axios.post(`${API_BASE_URL}/admin/create-test`, { email });
    setGeneratedLink(res.data.link);
  };

  // COPY LINK
  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Copied to clipboard!");
  };

  // ADD QUESTION
  const addQuestion = async () => {
    await axios.post(`${API_BASE_URL}/admin/add-question`, newQ);
    alert("Question Added!");
  };

  // SORTING HANDLER
  const sortByColumn = (column) => {
    let key = "";

    if (column === "Email") key = "email";
    if (column === "Score") key = "score";
    if (column === "Test ID") key = "testId";
    if (column === "Created") key = "createdAt";
    if (column === "Submitted") key = "submittedAt";

    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...sortedResults].sort((a, b) => {
      const x = a[key] || "";
      const y = b[key] || "";

      if (key.includes("At")) {
        return direction === "asc"
          ? new Date(x) - new Date(y)
          : new Date(y) - new Date(x);
      }

      if (x < y) return direction === "asc" ? -1 : 1;
      if (x > y) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedResults(sorted);
    setSortConfig({ key, direction });
  };

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "12px"
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "1100px", margin: "auto" }}>
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

      {/* RESULTS TABLE */}
      <div>
        <h2>Submitted Results</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
            background: "white"
          }}
        >
          <thead>
            <tr style={{ background: "#f3f3f3" }}>
              {["Email", "Score", "Test ID", "Created", "Submitted"].map(column => (
                <th
                  key={column}
                  onClick={() => sortByColumn(column)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                >
                  {column} ⬍
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedResults.map(r => (
              <tr key={r.testId}>
                <td style={cellStyle}>{r.email}</td>
                <td style={cellStyle}>{r.score ?? "Not submitted"}</td>
                <td style={cellStyle}>{r.testId}</td>
                <td style={cellStyle}>{new Date(r.createdAt).toLocaleString()}</td>
                <td style={cellStyle}>
                  {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
