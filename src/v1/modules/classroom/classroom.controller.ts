import { Context, Next } from "koa";
import { AuthenticationException } from "../../globals/exceptions";
import ApiResponse from "../../helpers/response";
import { Classroom, ClassroomUser } from "./classroom.interface";
import ClassroomModel from "./classroom.model";

const classroomModel = new ClassroomModel();

class ClassroomController {
  async getClassroomById(ctx: Context) {
    // let id: string = ctx.params.id;

    ctx.body = JSON.stringify({
      hello: "world",
    });
    ctx.status = 200;
    throw new AuthenticationException();
  }

  async createClassroom(ctx: Context) {
    let classroom = ctx.request.body as Classroom;
    const created = await classroomModel.create(classroom);
    const res = ApiResponse.success(
      201,
      "classroom created successfully",
      created
    );
    ctx.body = JSON.stringify(res);
    ctx.status = res.code;
  }
  
  async updateClassroom(ctx: Context) {
    let classroomUpdate = ctx.request.body as Partial<Classroom>;
    let classId = ctx.params.id as string;
    const updated = await classroomModel.update(classId, classroomUpdate);
    const res = ApiResponse.success(
      200,
      "classroom updated successfully",
      updated
    );
    ctx.body = JSON.stringify(res);
    ctx.status = res.code;
  }

  async deleteClassroom(ctx: Context) {
    let classId = ctx.params.id as string;
    const deleted = await classroomModel.delete({ classId });
    const res = ApiResponse.success(200, "classroom deleted successfully");
    ctx.body = JSON.stringify(res);
    ctx.status = res.code;
  }

  async addStudent(ctx: Context) {
    let student = ctx.request.body as ClassroomUser;
    let classId = ctx.params.id as string;
    const added = await classroomModel.addStudent(classId, student);
    const res = ApiResponse.success(
      200,
      "student added successfully",
      added
    );
    ctx.body = JSON.stringify(res);
    ctx.status = res.code;
  }

  async updateStudent(ctx: Context) {
    let studentUpdate = ctx.request.body as Partial<ClassroomUser>;
    let classId = ctx.params.id as string;
    let studentEmail = ctx.params.email as string;
    const update = await classroomModel.updateStudent(classId, studentEmail, studentUpdate);
    const res = ApiResponse.success(
      200,
      "student updated successfully",
      update
    );
    ctx.body = JSON.stringify(res);
    ctx.status = res.code;
  }

}

export default ClassroomController;
