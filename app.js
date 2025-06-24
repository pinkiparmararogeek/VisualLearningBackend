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
const notesRouter=require("./routes/notespdf.routes")
const testPaperRouter=require("./routes/testPaperpdf.routes")
const quizRouter=require("./routes/quiz.routes")
const feedbackRoute=require("./routes/feedback.routes")
const organization=require("./routes/organization.routes")
const subscriptionPlanRoutes=require("./routes/subscriptionPlan.routes")

const path = require("path");
// Middleware
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
// Routes
app.get('/status', (req, res) => {
  res.send('Server is Running!');
});


// Make the uploads folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/users",userRoutes)
app.use("/api/category",categoryRoutes)
app.use("/api/class",classRoute)
app.use('/api/subject',subjectsRoute)
app.use('/api/chapter',chapterRoute)
app.use('/api/video',videoRouter)
app.use("/api/notes-pdf",notesRouter)
app.use("/api/test-paper",testPaperRouter)
app.use('/api/quiz',quizRouter)
app.use("/api/feedback",feedbackRoute)
app.use('/api/organization',organization)
app.use("/api/subscription-plan",subscriptionPlanRoutes)
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
