import { Document, Model } from "mongoose";

export interface ClassroomUser {
  name: string;
  email: string;
}

export interface Lesson {
  name: string;
  description: string;
  status: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  name: string;
  description: string;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Classroom {
  name: string;
  description?: string;
  link?: string;
  curriculumLink?: string;
  students: ClassroomUser[];
  teacher: ClassroomUser[];
  subjects: Subject[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IClassroomDocument extends Classroom, Document {}

export interface IClassroomModel extends Model<IClassroomDocument> {}

