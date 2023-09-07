import mongoose from "mongoose";
import { IClassroomDocument } from "./classroom.interface";

const userSchema = {
  name: {type: String, required: true},
  email: {type: String, required: true},
};

const lessonSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    status: Boolean,
  },
  { timestamps: true }
);

const subjectSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

const classroomSchema = new mongoose.Schema<IClassroomDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    link: String,
    curriculumLink: String,
    students: [userSchema],
    teacher: [userSchema],
    subjects: [subjectSchema],
  },
  { timestamps: true }
);

export default classroomSchema;
