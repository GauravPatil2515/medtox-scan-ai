# Start Backend and Frontend Together

## Windows (PowerShell)
```powershell
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend  
cd frontend
npm start
```

## Linux/Mac (Bash)
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
```

## Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Notes
- Ensure Python 3.8+ and Node.js 16+ are installed
- Backend must be running for frontend predictions to work
- Models are automatically loaded on backend startup