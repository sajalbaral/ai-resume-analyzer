# AI Resume Analyzer

A modern AI-powered web app that analyzes resumes against job descriptions and provides structured, actionable feedback. Users receive a match score, missing keywords, and targeted improvements to better align their resume with specific roles.

---

## Features

- Analyze resumes against job descriptions using AI (Gemini API)
- Match score (0–100%) based on alignment with job requirements
- Missing keywords detection to improve ATS compatibility
- Actionable improvement suggestions tailored to the role
- Clean, modern dark-mode UI inspired by SaaS design systems
- Secure API integration using Vercel serverless functions (API key hidden)
- Responsive layout for desktop and mobile

---

## Live Demo

https://resume-builder-wine-seven.vercel.app/

---

## Built With

- React
- Vite
- JavaScript
- CSS (custom dark UI)
- Google Gemini API
- Vercel (serverless functions + hosting)

---

## Architecture

- Frontend built with React and component-based structure
- Serverless API route (`/api/analyze`) on Vercel acts as a secure proxy
- AI responses are parsed into structured JSON for predictable rendering
- Separation of concerns between UI components and business logic

---

## What I Learned

- Building and deploying a full-stack app using Vercel serverless functions
- Securing API keys by moving sensitive logic to the backend
- Designing structured prompts to enforce consistent AI output (JSON)
- Parsing and handling dynamic AI responses reliably in React
- Managing async workflows (loading, error, success states)
- Structuring a React app with reusable, modular components
- Designing clean, modern UI with a consistent design system

---

## Future Improvements

- Save analysis history (persistent storage)
- Resume version comparison (track score improvements over time)
- AI-powered rewrite suggestions for resume bullet points
- User authentication and personalized dashboards
- Export results (PDF or copy-ready resume updates)

---

## Why I Built This

I wanted to go beyond basic resume tools and create something that not only analyzes resumes, but provides **clear, actionable guidance** to improve them. This project also served as a way to explore full-stack patterns using serverless architecture and AI integration.
