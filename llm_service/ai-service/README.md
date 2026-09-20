# AI Service - SIH26091 (Rural Micro-Entrepreneur Advisory)

Independent Python FastAPI microservice providing AI intelligence, explanations, and risk assessments for rural micro-enterprises via Amazon Bedrock. Integrated downstream with a Java Spring Boot backend and React frontend.

## Architecture Principle
- **Backend = Source of Truth** (Calculates EMI, loan amounts, interest, scheme eligibility).
- **AI Service = Source of Intelligence** (Synthesizes risk, SWOT, and context).
- **LLM = Source of Explanation** (Explains validated numbers in English, Hindi, or Punjabi).

## Setup & Run

1. Create virtual environment:
   ```bash
   python -m venv venv