import Router from "koa-router";
import validateRequest from "../../globals/middlewares/validator.middleware";
import ClassroomController from "./classroom.controller";

const classroomController = new ClassroomController();

const classroomRouter = new Router({ prefix: "/classroom" });

// add student to classroom
classroomRouter.post(
  "/:id/students",
  validateRequest,
  classroomController.addStudent
);

// update student in classroom
classroomRouter.patch(
  "/:id/students/:email",
  validateRequest,
  classroomController.updateStudent
);

// create classroom
classroomRouter.post("/", validateRequest, classroomController.createClassroom);

// get classroom using Id
classroomRouter.get("/:id", classroomController.getClassroomById);

// update a classroom
classroomRouter.patch(
  "/:id",
  validateRequest,
  classroomController.updateClassroom
);

// get classroom using Id
classroomRouter.delete("/:id", classroomController.deleteClassroom);

export default classroomRouter;
