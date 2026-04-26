import { useState } from "react";

function App() {
  const [resumeInput, setResumeInput] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_API_KEY;

  function handleInput(e) {
    if (e.target.name === "Resume-input") {
      setResumeInput(e.target.value);
    } else if (e.target.name === "Job-description") {
      setJobDescription(e.target.value);
    }

    setAnalysisResult("");
  }

  async function clickedAnalyze() {
    if (resumeInput.trim() === "" || jobDescription.trim() === "") {
      alert("Please fill in both the resume and job description fields.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysisResult("");

    try {
      const result = await analyzeResume(resumeInput, jobDescription);
      setAnalysisResult(result);
    } catch (err) {
      console.log(err);
      setError("An error occurred while analyzing the resume.");
    } finally {
      setLoading(false);
    }
  }

  function buildPrompt(resume, jobDescription) {
    return `
              You are an expert recruiter and resume reviewer.

              Analyze the provided resume against the given job description.

              Your feedback must be:
              - Concise
              - Specific and actionable
              - Tailored to the industry implied by the job description
              - Focused on improving alignment with the job description
              - Free of generic or vague advice

              Return ONLY valid JSON in the following structure:

              {
                "matchScore": number,
                "missingKeywords": [string, string, string],
                "improvements": [string, string, string, string, string]
              }

              Rules:
              - matchScore must be a number between 0 and 100 (no % sign)
              - missingKeywords must contain the most important missing terms based on the job description
              - improvements must contain up to 5 actionable bullet points
              - If fewer than 3 missing keywords exist, return only those available
              - If fewer than 5 improvements exist, return only those available
              - Do NOT include any text outside the JSON
              - Do NOT include explanations
              - Do NOT include markdown formatting
              - Do NOT hallucinate experience not present in the resume

              Resume:
              ${resume}

              Job Description:
              ${jobDescription}
      `;
  }

  async function analyzeResume(resume, jobDesc) {
    const prompt = buildPrompt(resume, jobDesc);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (!response.ok) {
      throw new Error(data?.error?.message || "API request failed");
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No valid response from AI");
    }

    return text;
  }

  return (
    <>
      <h1>Resume Builder</h1>
      <label htmlFor="Resume-input">Resume Upload: </label>
      <textarea
        name="Resume-input"
        id="Resume-input"
        cols="50"
        rows="2"
        value={resumeInput}
        onChange={handleInput}
      ></textarea>
      <label htmlFor="Job-description">Job Description: </label>
      <textarea
        name="Job-description"
        id="Job-description"
        cols="50"
        rows="2"
        value={jobDescription}
        onChange={handleInput}
      ></textarea>
      <button onClick={clickedAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      <div>
        {resumeInput.trim() && (
          <section>
            <h2>Resume Preview:</h2>
            {resumeInput}
          </section>
        )}
        {jobDescription.trim() && (
          <section>
            <h2>Job Description Preview:</h2>
            {jobDescription}
          </section>
        )}
      </div>

      {loading || analysisResult || error ? (
        <section>
          {error ? <h2>Error:</h2> : <h2>Result:</h2>}
          {error ? (
            <p>{error}</p>
          ) : (
            <p>{loading ? "Analyzing..." : analysisResult}</p>
          )}
        </section>
      ) : null}
    </>
  );
}

export default App;
