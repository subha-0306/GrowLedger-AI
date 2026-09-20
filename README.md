<p align="center">
  <img src="screenshots/banner (2).png" width="100%" alt="GrowLedger">
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/REACT-FRONTEND-1F4B44?style=for-the-badge&labelColor=0b1210">
  <img alt="Flask" src="https://img.shields.io/badge/FLASK-BACKEND-1F4B44?style=for-the-badge&labelColor=0b1210">
  <img alt="LightGBM" src="https://img.shields.io/badge/LIGHTGBM-MODEL-1F4B44?style=for-the-badge&labelColor=0b1210">
  <img alt="SHAP" src="https://img.shields.io/badge/TREESHAP-EXPLAINABILITY-1F4B44?style=for-the-badge&labelColor=0b1210">
  <img alt="Vercel" src="https://img.shields.io/badge/VERCEL-DEPLOYED-1F4B44?style=for-the-badge&labelColor=0b1210">
</p>

<p align="center">
  <sub>
  <a href="https://growledger-ai.vercel.app"><b>LIVE DEMO</b></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#how-it-works">HOW IT WORKS</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#machine-learning">MODEL</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#api">API</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#local-development">SETUP</a>
  </sub>
</p>

<br>

<p align="center">
  <img src="screenshots/01-landing.png" width="31%" alt="Landing">
  <img src="screenshots/03-ai-engine.png" width="31%" alt="AI Engine">
  <img src="screenshots/04-financial-passport.png" width="31%" alt="Financial Passport">
</p>

<br>

## Overview

Traditional financial assessments reduce a person's financial behavior to a handful of static indicators. GrowLedger takes a broader approach.

The platform evaluates income patterns, expenses, savings behavior, payment activity, and debt indicators, applies a trained machine-learning classification model, uses **TreeSHAP** to explain the model's decision, and converts the result into a personalized **Financial Passport** — a financial story, coaching actions, and a 30 / 60 / 90-day improvement roadmap.

Instead of stopping at a prediction, GrowLedger explains *why*.

```text
Financial Inputs → Feature Engineering → ML Model → Prediction + Confidence
       → TreeSHAP Explainability → Financial Story
       → Counterfactual Coaching → 30 / 60 / 90 Day Roadmap → Financial Passport
```

<br>

## Key Features

| Feature | Description |
|---|---|
| **Financial Assessment** | Five-chapter conversational assessment covering work, income, cash flow, savings, and payment history |
| **ML-Based Classification** | A trained LightGBM model classifies financial readiness |
| **Explainable AI** | TreeSHAP identifies the strongest positive and negative contributors to each prediction |
| **Confidence Score** | Displays the model's prediction confidence alongside the assessment |
| **Financial Passport** | Converts model output into a structured financial profile |
| **Financial Story** | A plain-language explanation of the user's financial behavior |
| **Counterfactual Coaching** | Practical actions that could improve the user's financial position |
| **30 / 60 / 90 Roadmap** | Recommendations organized into short-, medium-, and longer-term milestones |
| **Demo Profiles** | Simulated financial profiles for exploring the product without manual entry |
| **Responsive Interface** | A polished web experience across desktop and smaller screens |

<br>

## Screenshots

<table>
<tr>
<td align="center" width="20%"><img src="screenshots/01-landing.png" width="100%"><br><sub>Landing Page</sub></td>
<td align="center" width="20%"><img src="screenshots/02-assessment.png" width="100%"><br><sub>Financial Assessment</sub></td>
<td align="center" width="20%"><img src="screenshots/03-ai-engine.png" width="100%"><br><sub>AI Passport Engine</sub></td>
<td align="center" width="20%"><img src="screenshots/04-financial-passport.png" width="100%"><br><sub>Financial Passport</sub></td>
<td align="center" width="20%"><img src="screenshots/05-coaching-roadmap.png" width="100%"><br><sub>Story &amp; Roadmap</sub></td>
</tr>
</table>

**The assessment** runs across five chapters — Primary Work, Income Stability, Monthly Cash Flow, Savings & Cushion, Payments & History.

**The passport** presents a readiness tier, prediction confidence, savings rate, expense ratio, digital transaction density, safety cushion, and key financial indicators — translated into a human-readable financial story and actionable milestones rather than a bare prediction.

<br>

## How It Works

<table>
<tr><td width="4%" valign="top"><b>1</b></td><td width="26%"><b>Understand the User</b></td><td>Collects occupation, income stability, monthly income and expenses, savings, average balance, digital and cash transaction patterns, missed payments, income growth, and EMI burden.</td></tr>
<tr><td valign="top"><b>2</b></td><td><b>Engineer Financial Signals</b></td><td>Raw inputs are transformed into model-ready features — savings rate, expense ratio, digital transaction density, cash transaction behavior, income variance and growth, EMI ratio, and debt-related indicators.</td></tr>
<tr><td valign="top"><b>3</b></td><td><b>Predict Financial Readiness</b></td><td>The feature set is passed to a trained LightGBM classification model, producing a readiness prediction and confidence score.</td></tr>
<tr><td valign="top"><b>4</b></td><td><b>Explain the Prediction</b></td><td>TreeSHAP identifies which financial signals contributed most strongly — both positive and negative drivers — and feeds that into the user's Financial Story.</td></tr>
<tr><td valign="top"><b>5</b></td><td><b>Generate Actionable Guidance</b></td><td>The prediction and signals pass through the coaching layer to produce priority actions, counterfactual guidance, 30/60/90-day milestones, and a future financial-tier projection.</td></tr>
</table>

<br>

## Machine Learning

**Model.** GrowLedger uses **LightGBM** for financial-readiness classification.

```text
Input Validation → Feature Engineering → Preprocessing
       → LightGBM Inference → Prediction + Probability → TreeSHAP Attribution
```

**Explainability.** TreeSHAP provides model-level attribution for individual predictions, extracting the strongest contributing signals to support the generated financial explanation. This lets the system answer not just *"what tier was predicted"* but *"which financial behaviors contributed to this result."*

<br>

## Financial Coaching

GrowLedger extends beyond classification — the coaching layer converts the assessment into practical next steps.

| Layer | What it does |
|---|---|
| **Financial Story** | A plain-language summary of the user's financial behavior based on the assessment signals |
| **Priority Action** | The single highest-impact improvement area identified from the financial profile |
| **Counterfactual Coaching** | Explores actionable changes that could improve the user's projected financial position |
| **30 / 60 / 90 Day Roadmap** | 30 days — immediate financial cleanup · 60 days — stabilization and progress · 90 days — longer-term strengthening |

<br>

## Demo Profiles

Simulated financial profiles let the assessment and Financial Passport be explored without entering a full financial history:

| Profile | Occupation |
|---|---|
| Rajesh Kumar | Chai Stall Owner |
| Lakshmi Devi | Tea Shop Owner |
| Arun Shankar | Auto Driver |
| Priya Nair | Freelance Tailor |
| Ramesh Babu | Street Vendor |

Each represents a distinct income pattern and financial behavior profile.

<br>

## Tech Stack

<table>
<tr>
<td valign="top" width="25%">

**Frontend**
- React
- Vite
- JavaScript
- CSS · Responsive UI

</td>
<td valign="top" width="25%">

**Backend**
- Python
- Flask
- REST API

</td>
<td valign="top" width="25%">

**Machine Learning**
- LightGBM
- Scikit-learn
- Pandas · NumPy
- SHAP / TreeSHAP

</td>
<td valign="top" width="25%">

**Deployment**
- Vercel — Frontend
- Python backend hosting
- REST frontend ↔ backend

</td>
</tr>
</table>

<br>

## Architecture

```text
GrowLedger-AI/
├── backend/
│   ├── app/
│   ├── data_generator/
│   ├── feature_engineering/
│   ├── ml/
│   ├── synthetic_data/
│   └── ...
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── data/
│       └── ...
├── assets/
├── screenshots/
└── README.md
```

<br>

## API

The backend exposes the core prediction service through a REST API.

<details>
<summary><b>Health Check</b></summary>
<br>

```http
GET /health
```
Used to verify backend availability.
</details>

<details>
<summary><b>Financial Prediction</b></summary>
<br>

```http
POST /predict
```

Accepts structured financial information and returns the generated assessment, including:

- Prediction and confidence
- Financial story
- Model drivers
- Coaching output
- 30 / 60 / 90 roadmap
- Future projection
</details>

<br>

## Local Development

**1. Clone the repository**
```bash
git clone https://github.com/subha-0306/GrowLedger-AI.git
cd GrowLedger-AI
```

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
```

**3. Backend**

Create and activate a Python virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
```

Install dependencies and start the Flask app:
```bash
pip install -r requirements.txt
```

Start the backend using the project's application entry point. The frontend communicates with it through the configured REST API.

<br>

## Design Philosophy

GrowLedger is built around three principles.

**Understand before judging.** Financial behavior is multidimensional — the platform weighs multiple signals instead of relying on a single metric.

**Explain, don't just predict.** A prediction without context is difficult to act on. TreeSHAP connects model output back to the underlying financial signals.

**Turn insight into action.**

```text
Prediction → Explanation → Financial Story → Priority Action → 30 / 60 / 90 Day Roadmap
```

<br>

## Responsible Use

GrowLedger is an experimental financial-readiness assessment and decision-support project. Its predictions are generated from the trained model and supplied financial inputs, and should **not** be treated as:

- A bank lending decision
- A credit bureau score
- A guaranteed loan approval
- Professional financial advice

The system is intended to demonstrate how machine learning, explainability, and product design can combine to produce more transparent financial insights.

<br>

## Project Status

**Live and deployed.** Current version includes:

- Working financial assessment
- ML prediction pipeline
- TreeSHAP explanations
- Financial Passport generation
- Financial story generation
- Counterfactual coaching
- 30 / 60 / 90 roadmap
- Demo profiles
- Deployed frontend and backend integration

<br>

## Roadmap

- [ ] Larger and more representative datasets
- [ ] Continuous model evaluation
- [ ] Additional financial signals
- [ ] Improved calibration and validation
- [ ] User accounts and persistent financial profiles
- [ ] More granular financial simulations
- [ ] Expanded explainability visualizations
- [ ] Exportable Financial Passport reports

<br>

---

<p align="center">
  <b>Subhalakshmi M</b><br>
  <sub>Computer Science & Engineering · Full-Stack Developer | AI &amp; Product Builder</sub><br>
  <sub><a href="https://github.com/subha-0306">github.com/subha-0306</a></sub>
</p>
