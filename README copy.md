🏥 Smart Medical Health Management System
A comprehensive full-stack medical record management system with AI-powered features for hospitals and patients.

📋 Features
For Patients
✅ Secure registration and login with unique Patient ID
✅ Personal health dashboard
✅ Complete medical history from all hospitals
✅ AI-powered health assistant chatbot
✅ AI-generated medical summary
✅ Downloadable medical reports
✅ Dark mode support
✅ Mobile responsive design
For Hospitals
✅ Secure registration and login with unique Hospital ID
✅ Patient search and records management
✅ Add new hospital visit records
✅ Blood bank inventory management
✅ Critical stock alerts (automatic when < 10 units)
✅ Emergency alert system (real-time to all hospitals)
✅ Hospital statistics dashboard
✅ Dark mode support
🛠️ Technology Stack
Frontend
HTML5
CSS3 (Responsive Design)
Vanilla JavaScript
Socket.io Client (Real-time features)
Backend
Node.js
Express.js
MongoDB with Mongoose
Socket.io (Real-time communication)
JWT Authentication
Bcrypt (Password hashing)
📦 Installation
Prerequisites
Node.js (v14 or higher)
MongoDB (v4.4 or higher)
npm or yarn
Step 1: Clone the Repository
bash
git clone <repository-url>
cd smart-medical-health-system
Step 2: Install Dependencies
bash
npm install
Step 3: Setup MongoDB
Install MongoDB on your system
Start MongoDB service:
bash
   mongod
Step 4: Configure Environment Variables
Create a .env file in the root directory:

env
MONGODB_URI=mongodb://localhost:27017/medical_health_system
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
Step 5: Start the Server
bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
The server will start on http://localhost:5000

Step 6: Open the Application
Open index.html in your browser
Or use a local server like Live Server in VS Code
📁 Project Structure
smart-medical-health-system/
├── server.js                 # Main backend server
├── package.json              # Dependencies
├── .env                      # Environment variables
├── README.md                 # Documentation
├── index.html               # Login/Registration page
├── patient-dashboard.html   # Patient dashboard
├── hospital-dashboard.html  # Hospital dashboard
└── node_modules/            # Dependencies (auto-generated)
🔐 Security Features
Password Hashing: Bcrypt with salt rounds
JWT Authentication: Token-based authentication
Role-Based Access: Separate access for patients and hospitals
Data Validation: Server-side validation
Secure APIs: Protected with JWT middleware
📊 Database Schema
Users Collection (Patients)
javascript
{
  userId: String (unique, auto-generated),
  name: String,
  email: String (unique),
  password: String (hashed),
  dateOfBirth: Date,
  bloodGroup: String,
  emergencyContact: String,
  address: String,
  createdAt: Date
}
Hospitals Collection
javascript
{
  hospitalId: String (unique, auto-generated),
  hospitalName: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
HospitalVisits Collection
javascript
{
  visitId: String (unique, auto-generated),
  userId: String,
  hospitalId: String,
  hospitalName: String,
  visitDate: Date,
  diagnosis: String,
  prescription: String,
  labResults: String,
  doctorName: String,
  notes: String
}
BloodBank Collection
javascript
{
  hospitalId: String,
  bloodType: String,
  availableUnits: Number,
  requiredUnits: Number,
  lastUpdated: Date
}
🚀 API Endpoints
Authentication
POST /api/register/patient - Register new patient
POST /api/register/hospital - Register new hospital
POST /api/login/patient - Patient login
POST /api/login/hospital - Hospital login
Patient Routes
GET /api/user/:id - Get patient details
GET /api/visits/:userId - Get patient visit history
Hospital Routes
POST /api/addVisit - Add new hospital visit
GET /api/patient/search/:userId - Search patient by ID
Blood Bank Routes
GET /api/blood/:hospitalId - Get blood bank data
POST /api/blood/update - Update blood stock
🤖 AI Features
Health Assistant Chatbot
Rule-based chatbot providing:

Diet and nutrition advice
Exercise recommendations
Diabetes management tips
Blood pressure management
Stress management techniques
Weight management guidance
Sleep improvement tips
AI Medical Summary Generator
Automatically generates summaries including:

Total hospital visits
Hospitals visited
Recent diagnoses
Current medications
Health status overview
Health recommendations
🔔 Real-Time Features
Socket.io Implementation
Emergency Alerts: Hospitals can broadcast emergency messages to all connected hospitals
Critical Stock Alerts: Automatic notifications when blood stock falls below 10 units
🎨 UI/UX Features
Modern gradient design
Responsive layout (mobile, tablet, desktop)
Dark mode support
Smooth animations
Intuitive navigation
Loading states
Error handling with user-friendly messages
📱 Mobile Responsive
The application is fully responsive and works on:

Desktop (1920px+)
Laptop (1024px - 1920px)
Tablet (768px - 1024px)
Mobile (320px - 768px)
🧪 Testing
Manual Testing Checklist
 Patient registration with unique ID generation
 Hospital registration with unique ID generation
 Patient login with credentials
 Hospital login with credentials
 Patient dashboard loads correctly
 Medical history displays all visits
 AI chatbot responds to queries
 AI summary generation works
 Hospital can search patients
 Hospital can add visit records
 Blood bank updates correctly
 Critical stock alerts trigger
 Emergency alerts broadcast
 Dark mode toggles properly
 Logout functionality works
🚀 Deployment
Backend (Render/Railway/Heroku)
Create account on deployment platform
Connect GitHub repository
Set environment variables
Deploy backend
Frontend (Vercel/Netlify)
Create account on deployment platform
Connect GitHub repository
Update API_URL in HTML files to backend URL
Deploy frontend
Database (MongoDB Atlas)
Create MongoDB Atlas account
Create cluster
Get connection string
Update MONGODB_URI in .env
🔧 Configuration
Changing Port
Update PORT in .env file

Changing JWT Secret
Update JWT_SECRET in .env file (required for production)

Adding New Blood Types
Modify the bloodTypes array in hospital-dashboard.html

Customizing Chatbot Responses
Edit the getChatbotResponse() function in patient-dashboard.html

📝 Usage Guide
For New Patients
Click "Register" tab
Select "Patient" role
Fill in all details
Save the generated Patient ID
Use ID, email, and name to login
For New Hospitals
Click "Register" tab
Select "Hospital" role
Fill in hospital details
Save the generated Hospital ID
Use ID, email, and name to login
Adding Patient Records (Hospital)
Login to hospital dashboard
Go to "Add Visit Record" tab
Enter patient ID and visit details
Submit form
Record is automatically added to patient's history
Viewing Medical History (Patient)
Login to patient dashboard
Medical history displays automatically
Click "Generate AI Summary" for overview
Click "Download Report" on any visit
🐛 Troubleshooting
MongoDB Connection Error
Ensure MongoDB is running: mongod
Check MONGODB_URI in .env
Verify MongoDB service is active
JWT Token Errors
Clear browser localStorage
Re-login to get new token
Check JWT_SECRET matches in .env
CORS Errors
Update FRONTEND_URL in .env
Ensure frontend and backend URLs match
Socket.io Not Connecting
Check if server is running
Verify port numbers match
Check firewall settings
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Open a Pull Request
📄 License
This project is licensed under the MIT License.

👨‍💻 Developer
Developed by [Your Name]

📧 Support
For issues and questions, please open an issue on GitHub.

🎯 Future Enhancements
 Email notifications
 SMS alerts
 Advanced AI features with machine learning
 Appointment booking system
 Prescription reminders
 Lab report image upload
 Video consultation
 Multi-language support
 Medicine inventory management
 Insurance integration
📊 Version History
v1.0.0 (Current)
Initial release
Complete authentication system
Patient and hospital dashboards
Blood bank management
AI chatbot and summary
Real-time emergency alerts
Made with ❤️ for better healthcare management

