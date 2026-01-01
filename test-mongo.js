const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://medisystem:medisystem@cluster0.mc9jmng.mongodb.net/medical_health_system?retryWrites=true&w=majority';

console.log('🔄 Testing connection...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB Connected!');
    console.log('📊 Database:', mongoose.connection.name);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED:', err.message);
    process.exit(1);
  });