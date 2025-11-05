📁 Smart Medical Health System - File Structure
Complete File Organization
smart-medical-health-system/
│
├── 📄 server.js                      # Main backend server with Express & Socket.io
├── 📄 package.json                   # Project dependencies and scripts
├── 📄 .env                           # Environment variables (NOT in git)
├── 📄 .gitignore                     # Git ignore rules
├── 📄 README.md                      # Complete project documentation
│
├── 📁 frontend/                      # Frontend HTML files
│   ├── 📄 index.html                # Login/Registration page
│   ├── 📄 patient-dashboard.html    # Patient portal
│   └── 📄 hospital-dashboard.html   # Hospital portal
│
├── 📁 node_modules/                  # Dependencies (auto-generated, NOT in git)
│
└── 📁 docs/                          # Additional documentation
    ├── 📄 API_DOCUMENTATION.md      # API endpoints guide
    ├── 📄 SETUP_GUIDE.md            # Detailed setup instructions
    └── 📄 USER_MANUAL.md            # End-user guide
File Descriptions
Root Level Files
server.js
Purpose: Main backend server file Contains:

Express.js server configuration
MongoDB connection and schemas
All API endpoints
JWT authentication middleware
Socket.io real-time functionality
Password hashing with bcrypt
Unique ID generation logic Size: ~500 lines
package.json
Purpose: Project configuration and dependencies Contains:

Project metadata
NPM scripts (start, dev)
Production dependencies
Development dependencies Key Dependencies:
express (v4.18.2)
mongoose (v8.0.3)
bcrypt (v5.1.1)
jsonwebtoken (v9.0.2)
socket.io (v4.6.1)
cors (v2.8.5)
.env
Purpose: Environment variables Contains:

MongoDB connection URI
JWT secret key
Server port
Frontend URL
Node environment Security: NEVER commit to git!
Frontend Files
index.html
Purpose: Authentication page Features:

Patient/Hospital registration forms
Patient/Hospital login forms
Unique ID generation display
Form validation
API integration
Responsive design Size: ~450 lines
patient-dashboard.html
Purpose: Patient portal interface Features:

Personal information display
Medical history viewer
AI chatbot interface
AI summary generator
Report download functionality
Dark mode toggle
Real-time updates Size: ~550 lines
hospital-dashboard.html
Purpose: Hospital management interface Features:

Patient search functionality
Visit record management
Blood bank inventory
Emergency alert system
Hospital statistics
Real-time notifications
Dark mode toggle Size: ~600 lines
How Files Interact
┌─────────────────┐
│  index.html     │ ──── Login/Register ───▶ server.js
│ (Auth Page)     │ ◀─── JWT Token ────────  (API)
└─────────────────┘
         │
         ├── Patient Login ──▶ patient-dashboard.html
         │                           │
         │                           ▼
         │                    ┌────────────────┐
         │                    │  server.js     │
         │                    │  - GET /visits │
         │                    │  - GET /user   │
         │                    │  - Chatbot     │
         │                    └────────────────┘
         │
         └── Hospital Login ──▶ hospital-dashboard.html
                                      │
                                      ▼
                                ┌────────────────┐
                                │  server.js     │
                                │  - Search      │
                                │  - Add Visit   │
                                │  - Blood Bank  │
                                │  - Socket.io   │
                                └────────────────┘
                                      │
                                      ▼
                                ┌────────────────┐
                                │  MongoDB       │
                                │  - Users       │
                                │  - Hospitals   │
                                │  - Visits      │
                                │  - BloodBank   │
                                └────────────────┘
Data Flow
Patient Registration Flow
1. User fills form in index.html
2. Frontend sends POST to /api/register/patient
3. server.js validates data
4. Password hashed with bcrypt
5. Unique ID generated (PAT-xxxxx)
6. Data saved to MongoDB Users collection
7. Success response with ID returned
8. Frontend displays generated ID
Hospital Visit Record Flow
1. Hospital searches patient in hospital-dashboard.html
2. Frontend sends GET to /api/patient/search/:userId
3. server.js fetches patient data
4. Hospital adds visit record
5. Frontend sends POST to /api/addVisit
6. server.js validates and saves to HospitalVisits collection
7. Visit automatically appears in patient's history
8. Success confirmation shown
Blood Bank Alert Flow
1. Hospital updates blood stock in hospital-dashboard.html
2. Frontend sends POST to /api/blood/update
3. server.js updates BloodBank collection
4. If units < 10, server emits Socket.io event
5. All connected hospitals receive real-time alert
6. Critical stock badge shown on dashboard
Database Collections Structure
Users Collection
javascript
Collection: users
Indexes: userId (unique), email (unique)
Average Size: ~500 bytes per document
Hospitals Collection
javascript
Collection: hospitals
Indexes: hospitalId (unique), email (unique)
Average Size: ~300 bytes per document
HospitalVisits Collection
javascript
Collection: hospitalvisits
Indexes: visitId (unique), userId, hospitalId
Average Size: ~800 bytes per document
BloodBank Collection
javascript
Collection: bloodbanks
Indexes: hospitalId, bloodType
Average Size: ~200 bytes per document
API Endpoint Organization
Authentication Endpoints
POST /api/register/patient
POST /api/register/hospital
POST /api/login/patient
POST /api/login/hospital
Patient Endpoints
GET  /api/user/:id              [Protected]
GET  /api/visits/:userId        [Protected]
Hospital Endpoints
GET  /api/patient/search/:userId [Protected]
POST /api/addVisit               [Protected]
GET  /api/blood/:hospitalId      [Protected]
POST /api/blood/update           [Protected]
Environment Variables Explained
env
# Database connection string
MONGODB_URI=mongodb://localhost:27017/medical_health_system

# Secret key for JWT token signing (min 32 characters)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Port for backend server
PORT=5000

# Frontend URL for CORS configuration
FRONTEND_URL=http://localhost:3000

# Development or production mode
NODE_ENV=development
Security Files & Considerations
.gitignore
gitignore
node_modules/
.env
*.log
.DS_Store
package-lock.json
Protected Routes
All API endpoints except register and login require JWT token in Authorization header:

Authorization: Bearer <jwt_token>
Deployment File Modifications
For Production Deployment
Update API URLs in all HTML files:
javascript
// Change from:
const API_URL = 'http://localhost:5000/api';
const socket = io('http://localhost:5000');

// To:
const API_URL = 'https://your-backend-url.com/api';
const socket = io('https://your-backend-url.com');
Update .env with production values:
env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=<strong-random-secret>
PORT=5000
FRONTEND_URL=https://your-frontend-url.com
NODE_ENV=production
Update CORS in server.js for production domain
File Size Estimates
server.js              → ~35 KB
index.html             → ~25 KB
patient-dashboard.html → ~30 KB
hospital-dashboard.html→ ~35 KB
package.json           → ~1 KB
.env                   → <1 KB
README.md              → ~15 KB
─────────────────────────────
Total Project Size     → ~140 KB (without node_modules)
With node_modules      → ~50 MB
Backup Strategy
Critical Files to Backup
server.js (backend logic)
All HTML files (frontend)
package.json (dependencies)
.env (configuration) - Store securely!
MongoDB database (use mongodump)
Backup Command
bash
# Backup MongoDB
mongodump --db medical_health_system --out ./backup

# Restore MongoDB
mongorestore --db medical_health_system ./backup/medical_health_system
Development Workflow
1. Edit server.js → Test API with Postman
2. Edit HTML files → Test in browser
3. Check MongoDB → Verify data structure
4. Test Socket.io → Multiple browser tabs
5. Test authentication → Login/logout flow
6. Test all features → Complete walkthrough
Maintenance Files (Optional)
Consider adding:

CHANGELOG.md - Track version changes
CONTRIBUTING.md - Contribution guidelines
LICENSE - License information
.dockerignore - Docker ignore rules
docker-compose.yml - Docker configuration
This structure ensures clean organization, easy maintenance, and smooth deployment!

