const express = require('express');
const bodyParser = require('body-parser'); // <-- Missing import
const app = express();
require('dotenv').config();
const db=require("./database/db")
const PORT = process.env.PORT || 3000;
const userRoutes=require("./routes/users.routes")
const categoryRoutes=require("./routes/category.routes")
const classRoute=require('./routes/classes.routes')
const subjectsRoute=require('./routes/subjects.routes')
const chapterRoute=require('./routes/chapters.routes')
const videoRouter=require('./routes/video.routes')

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/status', (req, res) => {
  res.send('Server is Running!');
});



app.use("/api/users",userRoutes)
app.use("/api/category",categoryRoutes)
app.use("/api/class",classRoute)
app.use('/api/subject',subjectsRoute)
app.use('/api/chapter',chapterRoute)
app.use('/api/video',videoRouter)



// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
