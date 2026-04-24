Backend Setup:

bash
cd backend
pip install -r requirements.txt
python server.py
Frontend Setup:

bash
cd frontend
npx create-react-app .
npm install html2canvas jspdf
# Replace src/App.js, src/App.css, src/index.html
# Add src/TargetBullseye.js
npm start
