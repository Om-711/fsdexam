import mongoose  from "mongoose";


const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  role: String 
});

const assignmentSchema = new mongoose.Schema({
  title: String,
  course: String,
  due_date: String,
  description: String
});

const submissionSchema = new mongoose.Schema({
  student_name: String,
  assignment_title: String,
  answer: String,
  submission_date: String,
  status: String,
  marks: { type: Number, default: 20 }
});

export const User = mongoose.model("User", userSchema)
export const Assignment = mongoose.model("Assignment", assignmentSchema)
export const Submission = mongoose.model("Submission", submissionSchema)
