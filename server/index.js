const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');



// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Routes
const userRoute = require('./src/Users/user.route');
const profileRoute = require('./src/Users/profile.route');
const sermonsRoute = require('./src/Sermons/sermons.route');
const adminRoute = require('./src/Admin/admin.route');
const newsletterRoute = require('./src/Newsletter/newsletter.route');


app.use('/users', userRoute);
app.use('/profile', profileRoute);
app.use('/uploads', express.static('src/uploads'));
app.use('/uploads/audio', express.static(path.join(__dirname, 'uploads/audio')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/sermons', sermonsRoute);
app.use('/admin', adminRoute);
app.use("/newsletter", newsletterRoute);

// Database Connection
async function main() {
  await mongoose.connect(process.env.DB_URL);
  app.get('/', (req, res) => {
    res.send('Sermon server is running!')
  });
}

main().then(() => console.log('MongoDB connection successful!')).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
