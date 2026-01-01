// server.js - Production-Ready Medical System Backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const http = require('http');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ============================================
// PRODUCTION CORS CONFIGURATION
// ============================================
const allowedOrigins = [
  'https://medical-system0.netlify.app',     // Replace with your Netlify URL
  
  'http://localhost:3000',                   // For local testing
  'http://localhost:5500',                   // For local Live Server
  'http://127.0.0.1:5500'                    // For local development
];

// Dynamic CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Socket.IO with production CORS
const io = new Server(server, { 
  cors: { 
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  } 
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => { 
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`); 
  next(); 
});

// ============================================
// ENVIRONMENT VARIABLES
// ============================================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medical_health_system';
const JWT_SECRET = process.env.JWT_SECRET || 'medical_health_super_secret_key_2024';
const BLOOD_THRESHOLD = parseInt(process.env.BLOOD_THRESHOLD) || 10;
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || '';
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// DATABASE CONNECTION
// ============================================
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

// ============================================
// SCHEMAS (same as before)
// ============================================
const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  address: { type: String, required: true },
  registeredBy: { type: String, default: 'self' },
  createdAt: { type: Date, default: Date.now }
});

const hospitalSchema = new mongoose.Schema({
  hospitalId: { type: String, unique: true, required: true },
  hospitalName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const hospitalVisitSchema = new mongoose.Schema({
  visitId: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  hospitalId: { type: String, required: true },
  hospitalName: { type: String, required: true },
  visitDate: { type: Date, default: Date.now },
  diagnosis: { type: String, required: true },
  prescription: { type: String, required: true },
  labResults: String,
  doctorName: { type: String, required: true },
  notes: String
});

const bloodBankSchema = new mongoose.Schema({
  hospitalId: { type: String, required: true },
  bloodType: { type: String, required: true },
  availableUnits: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

const criticalStockAlertSchema = new mongoose.Schema({
  alertId: { type: String, unique: true, required: true },
  hospitalId: { type: String, required: true },
  hospitalName: { type: String, required: true },
  bloodType: { type: String, required: true },
  currentUnits: { type: Number, required: true },
  threshold: { type: Number, default: 10 },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  acknowledgedBy: [{ hospitalId: String, hospitalName: String, response: String, timestamp: Date }]
});

const emergencyAlertSchema = new mongoose.Schema({
  alertId: { type: String, unique: true, required: true },
  hospitalId: { type: String, required: true },
  hospitalName: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'general' },
  priority: { type: String, default: 'medium' },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  acknowledgedBy: [{ hospitalId: String, hospitalName: String, response: String, timestamp: Date }]
});

// Models
const User = mongoose.model('User', userSchema);
const Hospital = mongoose.model('Hospital', hospitalSchema);
const HospitalVisit = mongoose.model('HospitalVisit', hospitalVisitSchema);
const BloodBank = mongoose.model('BloodBank', bloodBankSchema);
const CriticalStockAlert = mongoose.model('CriticalStockAlert', criticalStockAlertSchema);
const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema);

// ============================================
// UTILITY FUNCTIONS
// ============================================
function generateUniqueId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Medical Management System API',
    version: '1.0.0',
    status: 'running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ALL YOUR EXISTING ENDPOINTS
// (Copy all your endpoints here - registration, login, etc.)
// ============================================

// AUTHENTICATION ENDPOINTS
app.post('/api/register/patient', async (req, res) => {
  try {
    const { name, email, password, dateOfBirth, bloodGroup, emergencyContact, address, registeredBy } = req.body;
    if (!name || !email || !dateOfBirth || !bloodGroup || !emergencyContact || !address) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email exists' });
    
    const hashedPassword = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('temp123', 10);
    const userId = generateUniqueId('PAT');
    await new User({ userId, name, email, password: hashedPassword, dateOfBirth, bloodGroup, emergencyContact, address, registeredBy: registeredBy || 'self' }).save();
    res.status(201).json({ success: true, userId, name });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/register/hospital', async (req, res) => {
  try {
    const { hospitalName, email, password } = req.body;
    if (!hospitalName || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
    const existing = await Hospital.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const hospitalId = generateUniqueId('HOSP');
    await new Hospital({ hospitalId, hospitalName, email, password: hashedPassword }).save();
    res.status(201).json({ success: true, hospitalId, hospitalName });
  } catch (error) {
    console.error('Hospital registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/login/patient', async (req, res) => {
  try {
    const { name, email, userId } = req.body;
    const user = await User.findOne({ email, userId, name });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user.userId, email: user.email, role: 'patient' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, user: { userId: user.userId, name: user.name, email: user.email, bloodGroup: user.bloodGroup, dateOfBirth: user.dateOfBirth, emergencyContact: user.emergencyContact, address: user.address } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/login/hospital', async (req, res) => {
  try {
    const { hospitalName, email, hospitalId } = req.body;
    const hospital = await Hospital.findOne({ email, hospitalId, hospitalName });
    if (!hospital) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const token = jwt.sign({ hospitalId: hospital.hospitalId, email: hospital.email, role: 'hospital' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, hospital: { hospitalId: hospital.hospitalId, hospitalName: hospital.hospitalName, email: hospital.email } });
  } catch (error) {
    console.error('Hospital login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATIENT ROUTES
app.get('/api/user/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/visits/:userId', authenticateToken, async (req, res) => {
  try {
    const visits = await HospitalVisit.find({ userId: req.params.userId }).sort({ visitDate: -1 });
    res.json({ success: true, visits });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// HOSPITAL ROUTES
app.post('/api/addVisit', authenticateToken, async (req, res) => {
  try {
    const { userId, hospitalId, hospitalName, diagnosis, prescription, labResults, doctorName, notes } = req.body;
    if (!userId || !hospitalId || !diagnosis || !prescription || !doctorName) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }
    const patient = await User.findOne({ userId });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    
    const visitId = generateUniqueId('VISIT');
    await new HospitalVisit({ visitId, userId, hospitalId, hospitalName, diagnosis, prescription, labResults, doctorName, notes }).save();
    res.status(201).json({ success: true, message: 'Visit added' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/patient/search/:userId', authenticateToken, async (req, res) => {
  try {
    const patient = await User.findOne({ userId: req.params.userId }).select('-password');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    const visits = await HospitalVisit.find({ userId: req.params.userId }).sort({ visitDate: -1 });
    res.json({ success: true, patient, visits });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// BLOOD BANK ROUTES
app.get('/api/blood/:hospitalId', authenticateToken, async (req, res) => {
  try {
    const bloodData = await BloodBank.find({ hospitalId: req.params.hospitalId });
    res.json({ success: true, bloodData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/blood/add', authenticateToken, async (req, res) => {
  try {
    const { hospitalId, hospitalName, bloodType, units } = req.body;
    let blood = await BloodBank.findOne({ hospitalId, bloodType });
    if (blood) {
      blood.availableUnits += units;
      blood.lastUpdated = Date.now();
      await blood.save();
    } else {
      blood = await new BloodBank({ hospitalId, bloodType, availableUnits: units }).save();
    }
    if (blood.availableUnits >= BLOOD_THRESHOLD) {
      await CriticalStockAlert.updateMany({ hospitalId, bloodType, status: 'active' }, { status: 'resolved' });
    }
    res.json({ success: true, bloodRecord: blood });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/blood/remove', authenticateToken, async (req, res) => {
  try {
    const { hospitalId, hospitalName, bloodType, units } = req.body;
    let blood = await BloodBank.findOne({ hospitalId, bloodType });
    if (!blood || blood.availableUnits < units) {
      return res.status(400).json({ success: false, message: 'Insufficient units' });
    }
    blood.availableUnits -= units;
    blood.lastUpdated = Date.now();
    await blood.save();
    
    if (blood.availableUnits < BLOOD_THRESHOLD) {
      const existing = await CriticalStockAlert.findOne({ hospitalId, bloodType, status: 'active' });
      if (!existing) {
        const alertId = generateUniqueId('ALERT');
        await new CriticalStockAlert({ alertId, hospitalId, hospitalName, bloodType, currentUnits: blood.availableUnits, threshold: BLOOD_THRESHOLD }).save();
        io.emit('criticalStock', { alertId, hospitalId, hospitalName, bloodType, currentUnits: blood.availableUnits });
      }
    }
    res.json({ success: true, bloodRecord: blood });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/blood/update', authenticateToken, async (req, res) => {
  try {
    const { hospitalId, hospitalName, bloodType, availableUnits } = req.body;
    let blood = await BloodBank.findOne({ hospitalId, bloodType });
    if (blood) {
      blood.availableUnits = availableUnits;
      blood.lastUpdated = Date.now();
      await blood.save();
    } else {
      blood = await new BloodBank({ hospitalId, bloodType, availableUnits }).save();
    }
    
    if (availableUnits < BLOOD_THRESHOLD) {
      const existing = await CriticalStockAlert.findOne({ hospitalId, bloodType, status: 'active' });
      if (!existing) {
        const alertId = generateUniqueId('ALERT');
        await new CriticalStockAlert({ alertId, hospitalId, hospitalName, bloodType, currentUnits: availableUnits, threshold: BLOOD_THRESHOLD }).save();
        io.emit('criticalStock', { alertId, hospitalId, hospitalName, bloodType, currentUnits: availableUnits });
      }
    } else {
      await CriticalStockAlert.updateMany({ hospitalId, bloodType, status: 'active' }, { status: 'resolved' });
    }
    res.json({ success: true, bloodRecord: blood });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ALERT ROUTES
app.get('/api/alerts/critical', authenticateToken, async (req, res) => {
  try {
    const alerts = await CriticalStockAlert.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/alerts/critical/acknowledge', authenticateToken, async (req, res) => {
  try {
    const { alertId, hospitalId, hospitalName, response } = req.body;
    const alert = await CriticalStockAlert.findOne({ alertId });
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    alert.acknowledgedBy.push({ hospitalId, hospitalName, response, timestamp: new Date() });
    await alert.save();
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/alerts/emergency', authenticateToken, async (req, res) => {
  try {
    const { hospitalId, hospitalName, message, type, priority } = req.body;
    const alertId = generateUniqueId('EMRG');
    const alert = await new EmergencyAlert({ alertId, hospitalId, hospitalName, message, type: type || 'general', priority: priority || 'medium' }).save();
    io.emit('emergencyAlert', { alertId, hospitalName, message, type, priority, timestamp: new Date() });
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/alerts/emergency', authenticateToken, async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/alerts/emergency/acknowledge', authenticateToken, async (req, res) => {
  try {
    const { alertId, hospitalId, hospitalName, response } = req.body;
    const alert = await EmergencyAlert.findOne({ alertId });
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    alert.acknowledgedBy.push({ hospitalId, hospitalName, response, timestamp: new Date() });
    await alert.save();
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// CHATBOT ENDPOINT (keep your existing chatbot code)
const chatCache = new Map();

function getFallbackResponse(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('diet') || msg.includes('food') || msg.includes('nutrition')) {
    return '🥗 Eat 5 servings of fruits/vegetables daily, choose whole grains, lean proteins. Stay hydrated with 8 glasses of water. Limit processed foods.';
  }
  
  if (msg.includes('exercise') || msg.includes('workout')) {
    return '💪 Aim for 150 minutes of moderate aerobic activity weekly. Include strength training 2-3 times per week. Start slowly and increase gradually.';
  }
  
  return '🩺 I can help with: Diet & Nutrition, Exercise, Diabetes, Blood Pressure, Sleep, Stress, Weight, Heart Health. Ask me anything!';
}

app.post('/api/chatbot', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });
    
    const cacheKey = message.toLowerCase().trim();
    if (chatCache.has(cacheKey)) {
      return res.json({ success: true, response: chatCache.get(cacheKey), cached: true });
    }

    if (!GOOGLE_AI_API_KEY) {
      const fallback = getFallbackResponse(message);
      return res.json({ success: true, response: fallback, fallback: true });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_AI_API_KEY}`;
    
    const response = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: `You are a helpful medical health assistant. Provide clear, accurate health advice in 2-3 sentences.\n\nUser: ${message}\n\nResponse:` }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
    }, { timeout: 20000 });

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (aiResponse) {
      if (chatCache.size > 100) chatCache.delete(chatCache.keys().next().value);
      chatCache.set(cacheKey, aiResponse);
      res.json({ success: true, response: aiResponse });
    } else {
      const fallback = getFallbackResponse(message);
      res.json({ success: true, response: fallback, fallback: true });
    }
  } catch (error) {
    console.error('Chatbot error:', error.message);
    const fallback = getFallbackResponse(req.body.message);
    res.json({ success: true, response: fallback, fallback: true });
  }
});

// TEST ENDPOINT
app.get('/api/test-ai', async (req, res) => {
  try {
    if (!GOOGLE_AI_API_KEY) {
      return res.json({ success: false, message: 'API Key not configured' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_AI_API_KEY}`;
    const response = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: 'Say hello in one sentence' }] }]
    }, { timeout: 10000 });

    res.json({
      success: true,
      message: '✅ Google AI API is working!',
      response: response.data?.candidates?.[0]?.content?.parts?.[0]?.text
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// ============================================
// SOCKET.IO
// ============================================
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// ============================================
// START SERVER
// ============================================
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🏥 Medical System Server                  ║
║  ✅ Status: Running                        ║
║  🌐 Port: ${PORT}                              ║
║  📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}                      ║
║  🤖 AI: ${GOOGLE_AI_API_KEY ? 'Enabled' : 'Disabled'}                          ║
║  🔧 Environment: ${NODE_ENV}              ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});