const mongoose = require('mongoose');

const MONGODB_URI ='mongodb+srv://karthikaiml00:karthikaiml00@cluster0.mc9jmng.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });