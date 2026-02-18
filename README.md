# AI Technical Interviewer Platform

An advanced AI-powered technical interview platform featuring a premium React frontend, Node.js backend, and a dedicated Python AI analysis service. The system conducts real-time technical interviews, provides live coding environments, and generates detailed performance reports using OpenAI's GPT models.

![Dashboard Preview](./frontend/public/dashboard-preview.png)

## 🚀 Technology Stack

- **Frontend**: React, Vite, Tailwind CSS (Premium "Apple-style" UI), Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **AI Service**: Python, Flask, OpenAI API, Scikit-learn (for candidate analysis metrics).

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

1.  **Node.js** (v16+) & **npm**
2.  **Python** (v3.8+)
3.  **MongoDB** (Local instance or Atlas URI)
4.  **OpenAI API Key** (Required for AI analysis features)

---

## 🛠️ Installation & Setup

Follow these steps in order to set up the complete system.

### 1. Backend Setup (Node.js)

The backend handles user sessions, interview data, and communication with the AI service.

```bash
cd backend

# Install dependencies
npm install

# Create environment file
# You can copy the example or create one manually
cp .env.example .env

# Configure .env with your details:
# PORT=3000
# MONGO_URI=mongodb://localhost:27017/ai-interviewer
# OPENAI_API_KEY=your_openai_api_key_here
# AI_ANALYSIS_URL=http://localhost:5001
# FRONTEND_URL=http://localhost:5173

# Start the server
npm start
```
*Server will run on `http://localhost:3000`*

### 2. AI Analysis Service (Python)

This service runs the advanced analytics and ML models for candidate evaluation.

```bash
cd ai-analysis

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# Windows:
# venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# PORT=5001
# OPENAI_API_KEY=your_openai_api_key_here

# Run the service
python api.py
```
*AI Service will run on `http://localhost:5001`*

### 3. Frontend Setup (React)

The premium user interface for candidates and recruiters.

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
# Create a .env file in the frontend directory:
# VITE_AI_BACKEND_URL=http://localhost:3000
# VITE_RECRUITER_BACKEND_URL=http://localhost:3000

# Start development server
npm run dev
```
*Frontend will run on `http://localhost:5173`*

---

## 🏃‍♂️ Running the Application

To run the full application, you need **three terminal windows** running concurrently:

1.  **Terminal 1 (Backend)**:
    ```bash
    cd backend && npm start
    ```
2.  **Terminal 2 (AI Service)**:
    ```bash
    cd ai-analysis && source venv/bin/activate && python api.py
    ```
3.  **Terminal 3 (Frontend)**:
    ```bash
    cd frontend && npm run dev
    ```

Open your browser and navigate to `http://localhost:5173` to start using the platform.

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Port for the backend server (default: 3000) |
| `MONGO_URI` | Connection string for MongoDB |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `AI_ANALYSIS_URL` | URL of the Python AI service (default: http://localhost:5001) |
| `FRONTEND_URL` | URL of the frontend (CORS whitelisting) |

### AI Service (`ai-analysis/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Port for the AI service (default: 5001) |
| `OPENAI_API_KEY` | Your OpenAI API key (for accessing GPT models) |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_AI_BACKEND_URL` | URL of the Node.js backend |
| `VITE_RECRUITER_BACKEND_URL` | URL of the Node.js backend (for admin features) |

---

## 🐛 Troubleshooting

- **MongoDB Connection Error**: Ensure your local MongoDB instance is running (`mongod`) or your Atlas URI is correct.
- **OpenAI API Errors**: Verify your API key is correct in both `backend/.env` and `ai-analysis/.env`. Check your billing status/credits.
- **CORS Issues**: Ensure `FRONTEND_URL` in `backend/.env` matches the URL your frontend is actually running on (e.g., `http://localhost:5173`).
- **Python Module Errors**: Ensure you have activated the virtual environment (`source venv/bin/activate`) before running `api.py`.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Project Link: [https://github.com/your-username/ai-technical-interviewer](https://github.com/your-username/ai-technical-interviewer)
