
<br />
<div align="center">
  <img src="frontend/public/favicon.svg" alt="Logo" width="80" height="80">

  <h1 align="center">AI Technical Interviewer</h1>

  <p align="center">
    The next generation of technical hiring. An AI-powered platform that conducts real-time interviews, analyzes code, and provides actionable feedback.
    <br />
    <a href="#demo"><strong>View Demo</strong></a>
    ·
    <a href="https://github.com/QuantumBreakz/Master-the-Interview/issues">Report Bug</a>
    ·
    <a href="https://github.com/QuantumBreakz/Master-the-Interview/issues">Request Feature</a>
  </p>
</div>


<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-%23412991.svg?style=for-the-badge&logo=openai&logoColor=white)

</div>

<br />

![Dashboard Preview](frontend/public/dashboard-preview.png)

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#-running-the-application)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 💡 About The Project

**AI Technical Interviewer** is a state-of-the-art platform designed to automate and enhance the technical interview process. By leveraging the power of Large Language Models (LLMs), it acts as an intelligent interviewer that can:

1.  **Conduct Interviews**: Engage candidates in real-time technical discussions.
2.  **Assess Coding Skills**: Provide a live coding environment with real-time analysis.
3.  **Evaluate Performance**: Analyze technical accuracy, communication clarity, and problem-solving patterns.

The goal is to provide a fair, consistent, and deep evaluation of candidates while saving countless hours for engineering teams.

---

## ✨ Key Features

- **🧠 Advanced AI Analysis**: utilizes GPT-4 to understand context, follow up on answers, and provide deep technical insights.
- **🎨 Premium UI/UX**: A "True Black" aesthetic inspired by Apple and Linear, featuring glassmorphism, bento-grids, and fluid animations.
- **⚡ Real-time Performance**: Built on Vite and React for instant feedback and zero latency.
- **📊 Comprehensive Reports**: Generates detailed PDF reports with score breakdowns for Technical Knowledge, Communication, and Problem Solving.
- **🔒 Secure & Private**: Candidate data is processed securely with session-based access control.

---

## 🏗 Architecture & Tech Stack

The application is built as a microservices-based architecture to ensure scalability and separation of concerns.

### **1. Frontend (Client)**
- **Framework**: [React](https://reactjs.org/) (v18) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom design system.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Features**: Route management with React Router, animations with Framer Motion, and state management with React Hooks.

### **2. Backend (Server)**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Role**: Handles API requests, user session management, data persistence, and orchestration between the Frontend and AI Service.

### **3. AI Analysis Service (Microservice)**
- **Runtime**: [Python](https://www.python.org/) (v3.8+)
- **Framework**: [Flask](https://flask.palletsprojects.com/)
- **AI Models**: OpenAI (GPT-4/3.5-turbo), Scikit-learn (for custom metrics).
- **Role**: Dedicated service for heavy-lifting AI tasks, prompt engineering, and generating analysis reports.

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

*   **Node.js** (v16 or higher)
*   **Python** (v3.8 or higher)
*   **MongoDB** (running locally or a cloud URI)
*   **OpenAI API Key** (Essential for AI features)

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/QuantumBreakz/Master-the-Interview.git
    cd Master-the-Interview
    ```

2.  **Setup the Backend**
    ```sh
    cd backend
    npm install
    cp .env.example .env
    # Update .env with your keys (see Environment Variables section)
    ```

3.  **Setup the AI Service**
    ```sh
    cd ../ai-analysis
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    cp .env.example .env
    ```

4.  **Setup the Frontend**
    ```sh
    cd ../frontend
    npm install
    cp .env.example .env
    ```

---

## 🏃‍♂️ Running the Application

To run the full stack, you will need **3 terminal windows**:

**Terminal 1: Backend**
```sh
cd backend
npm start
```

**Terminal 2: AI Service**
```sh
cd ai-analysis
source venv/bin/activate
python api.py
```

**Terminal 3: Frontend**
```sh
cd frontend
npm run dev
```

OPEN: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Port for the backend server (default: `3000`) |
| `MONGO_URI` | MongoDB Connection String |
| `OPENAI_API_KEY` | Your OpenAI API Key |
| `AI_ANALYSIS_URL` | URL of the AI Service (default: `http://localhost:5001`) |
| `FRONTEND_URL` | URL of the Frontend (for CORS, default: `http://localhost:5173`) |

### AI Service (`ai-analysis/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Port for the Flask server (default: `5001`) |
| `OPENAI_API_KEY` | Your OpenAI API Key |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_AI_BACKEND_URL` | URL of the Node.js Backend (e.g., `http://localhost:3000`) |

---

## 📂 Project Structure

```text
/
├── frontend/             # React Application
│   ├── src/
│   │   ├── components/   # Reusable UI components (Bento cards, Glass panels)
│   │   ├── pages/        # Main application pages (Dashboard, Interview, Results)
│   │   └── ...
│   └── ...
├── backend/              # Node.js API Server
│   ├── models/           # Mongoose Schemas
│   ├── routes/           # API Endpoints
│   └── ...
├── ai-analysis/          # Python AI Microservice
│   ├── api.py            # Flask App Entry Point
│   ├── data/             # Training/Context data
│   └── ...
└── README.md             # This file
```

---

## 🤝 Contributing

Contributions make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

Project Link: [https://github.com/QuantumBreakz/Master-the-Interview](https://github.com/QuantumBreakz/Master-the-Interview)
