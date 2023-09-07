import mongoose from "mongoose";
import {
  IClassroomDocument,
  IClassroomModel,
} from "./classroom.interface";
import classroomSchema from "./classroom.schema";

const classRoomRepo: IClassroomModel = mongoose.model<IClassroomDocument, IClassroomModel>(
  "classroom",
  classroomSchema
);

export default classRoomRepo;