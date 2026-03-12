import mongoose from "mongoose"
import express from "express"
import cors from "cors"

import { User  } from "./db.js"
import { Assignment } from "./db.js"
import { Submission  } from "./db.js"

const app = express()
app.use(cors())
app.use(express.json())

app.post("/login", async function(req, res){
    console.log(req)
    const name = req.body.name
    const password =  req.body.password
    const role = req.body.role
    
    const user = await User.create({
        name, password, role
    }) 
    res.json({
        message:"Work"
    })
});


app.post("/assignment/create", async function(req, res){
    const {title, course, due_date, description} = req.body
    await Assignment.create({
        title, course, due_date, description
    })
    res.json({
        message : "Assign Created"
    })
})

app.get("/assignment", async function(req, res){
    const data = await Assignment.find()
    res.json({data})
})

app.post("/submit", async function(req, res){
    const { student_name, assignment_title, answer } = req.body

    if(!student_name || !assignment_title || !answer){
        return res.status(400).json({message: "Missing fields"})
    }

    await Submission.create({
        student_name, assignment_title,  answer,
        submission_date:new Date().toISOString().split('T')[0], 
        status:"Submitted"
        // marks
    })
    res.json({message : "Submitted"})
})


app.get("/submission", async function(req, res){
    const data = await Submission.find();
    res.json(data);
})

app.get("/submission/:id", async function(req, res){
    const data = await Submission.findById(req.params.id);
    res.json(data);
})

app.post("/submission/:id/grade", async function(req, res){
    const { marks } = req.body;
    const data = await Submission.findByIdAndUpdate(req.params.id, { marks, status: "Graded" }, { new: true });
    res.json(data);
})

app.get("/submission/student/:student_name", async function(req, res){
    const data = await Submission.find({ student_name: req.params.student_name });
    res.json(data);
})

app.listen(3000, async ()=>{
    await mongoose.connect('mongodb://localhost:27017/exam')
    console.log('Server running on http://localhost:3000');
})