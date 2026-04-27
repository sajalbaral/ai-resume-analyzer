import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import InputCard from "./components/InputCard";
import AnalyzeButton from "./components/AnalyzeButton";
import ResultCard from "./components/ResultCard";
import { ResumeIcon, BriefcaseIcon } from "./components/Icons";

function App() {
  const [resumeInput, setResumeInput] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleInput(e) {
    if (e.target.name === "Resume-input") {
      setResumeInput(e.target.value);
    } else if (e.target.name === "Job-description") {
      setJobDescription(e.target.value);
    }
    setAnalysisResult(null);
  }

  async function clickedAnalyze() {
    if (resumeInput.trim() === "" || jobDescription.trim() === "") {
      alert("Please fill in both the resume and job description fields.");
      return;
    }
    setLoading(true);
    setError("");
    setAnalysisResult(null);
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

  function buildPrompt(resume, jobDesc) {
    return `
      You are an expert recruiter and resume reviewer.
      Analyze the provided resume against the given job description.
      Your feedback must be concise, specific, actionable, tailored to the industry implied by the job description, focused on improving alignment with the job description, and free of generic or vague advice.
      Return ONLY valid JSON in the following structure:
      {
        "matchScore": number,
        "matchedKeywords": [string],
        "missingKeywords": [string],
        "improvements": [string]
      }
      Rules:
      - matchScore must be a number between 0 and 100 (no % sign)
      - matchedKeywords must contain up to 10 keywords present in both the resume and job description
      - missingKeywords must contain up to 8 of the most important missing terms based on the job description
      - improvements must contain up to 5 actionable bullet points
      - Do NOT include any text outside the JSON
      - Do NOT include explanations, markdown formatting, or hallucinated experience
      Resume:
      ${resume}
      Job Description:
      ${jobDesc}
    `;
  }

  async function analyzeResume(resume, jobDesc) {
    const prompt = buildPrompt(resume, jobDesc);
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data?.error?.message || "API request failed");
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No valid response from AI");
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  }

  return (
    <div className="app">
      <Header />

      <div className="input-grid">
        <InputCard
          label="Resume"
          name="Resume-input"
          id="Resume-input"
          value={resumeInput}
          onChange={handleInput}
          placeholder="Paste your resume here — work experience, skills, education..."
          icon={<ResumeIcon />}
        />
        <InputCard
          label="Job Description"
          name="Job-description"
          id="Job-description"
          value={jobDescription}
          onChange={handleInput}
          placeholder="Paste the job description — requirements, responsibilities, qualifications..."
          icon={<BriefcaseIcon />}
        />
      </div>

      <AnalyzeButton onClick={clickedAnalyze} loading={loading} />

      <ResultCard result={analysisResult} error={error} />
    </div>
  );
}

export default App;
