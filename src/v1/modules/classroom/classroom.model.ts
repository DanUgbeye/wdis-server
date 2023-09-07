import BadRequestException from "../../globals/exceptions/BadRequestException";
import ServerException from "../../globals/exceptions/ServerException";
import {
  Classroom,
  ClassroomUser,
  Lesson,
  Subject,
} from "./classroom.interface";
import classRoomRepo from "./classroom.repository";

class ClassroomModel {
  /** creates a new classroom */
  async create(data: Classroom) {
    // TODO check that classroomm students >= 2
    let room;
    try {
      room = await classRoomRepo.findOne({ name: data.name });
    } catch (err) {
      throw new ServerException();
    }

    if (room) {
      throw new BadRequestException("classroom name already exists");
    }

    try {
      room = await classRoomRepo.create(data);
    } catch (err) {
      throw new ServerException();
    }

    if (!room) {
      throw new ServerException();
    }
    return room;
  }

  /** updates a new classroom */
  async update(classId: string, data: Partial<Classroom>) {
    let room;

    try {
      room = await classRoomRepo.findOneAndUpdate({ _id: classId }, data, {
        new: true,
      });
    } catch (err) {
      throw new ServerException();
    }

    if (!room) {
      throw new BadRequestException("classroom not found");
    }
    return room;
  }

  /** deletes a  classroom */
  async delete({ classId, name }: { classId?: string; name?: string }) {
    let deleted;
    try {
      if (classId) {
        deleted = await classRoomRepo.findOneAndDelete({ _id: classId });
      } else {
        deleted = await classRoomRepo.findOneAndDelete({ name });
      }
    } catch (err) {
      throw new ServerException();
    }

    if (!deleted) {
      throw new BadRequestException("classroom not found");
    }

    return true;
  }

  /** adds a student to a classroom */
  async addStudent(classId: string, student: ClassroomUser) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      throw new BadRequestException("classroom not found");
    }

    if (classroom.students.length === 10) {
      throw new BadRequestException("classroom is full");
    }

    // check if student exist
    const found = classroom.students.find(
      (savedStudent) => savedStudent.email === student.email
    );

    if (found) {
      throw new BadRequestException("student already enrolled in classroom");
    }

    classroom.students.push(student);

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return classroom;
  }

  /** updates a sudents */
  async updateStudent(
    classId: string,
    studentEmail: string,
    studentUpdate: Partial<ClassroomUser>
  ) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      throw new BadRequestException("classroom not found");
    }

    // find student
    const index = classroom.students.findIndex(
      (savedStudent) => savedStudent.email === studentEmail
    );

    if (index === -1) {
      throw new BadRequestException("student not found");
    }

    // check if new email exists
    if (studentUpdate.email) {
      let newEmailExists = classroom.students.findIndex(
        (savedStudent) => savedStudent.email === studentUpdate.email
      );

      if (newEmailExists !== -1) {
        throw new BadRequestException("new email already exists in classroom");
      }
    } else {
      studentUpdate.email = studentEmail;
    }
    
    let oldData = classroom.students[index];
    oldData = {
      ...oldData,
      ...studentUpdate
    }

    classroom.students[index] = oldData;

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return classroom;
  }

  // TODO continue from here

  /** deletes a student */
  async deleteStudent(classId: string, student: { email: string }) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      // TODO implement correct exception
      throw new Error("classroom not found");
    }

    const originalLength = classroom.students.length;
    // delete student
    const students = classroom.students.filter(
      (stud) => stud.email !== student.email
    );

    if (students.length === originalLength) {
      // TODO implement correct exception
      throw new Error("student not found");
    }

    classroom.students = students;

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return true;
  }

  /** adds a teacher */
  async addTeacher(classId: string, teacher: ClassroomUser) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      // TODO implement correct exception
      throw new Error("classroom not found");
    }

    // TODO check if max teachers is reached

    // checking if teacher already exists
    const found = classroom.teacher.find(
      (savedTeacher) => savedTeacher.email === teacher.email
    );

    if (found) {
      // TODO implement correct exception
      throw new Error("teacher already assigned to classroom");
    }

    classroom.teacher.push(teacher);

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return classroom;
  }

  /** updates a teacher */
  async updateTeacher(
    classId: string,
    teacherEmail: string,
    teacherUpdate: Partial<ClassroomUser>
  ) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      // TODO implement correct exception
      throw new Error("classroom not found");
    }

    // find teacher
    const index = classroom.teacher.findIndex(
      (savedTeacher) => savedTeacher.email === teacherEmail
    );

    if (index === -1) {
      // TODO implement correct exception
      throw new Error("teacher not found");
    }

    classroom.teacher[index] = {
      ...classroom.teacher[index],
      ...teacherUpdate,
    };

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return classroom;
  }

  /** deletes a teacher */
  async deleteTeacher(classId: string, teacher: { email: string }) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      // TODO implement correct exception
      throw new Error("classroom not found");
    }

    const originalLength = classroom.teacher.length;
    // delete teacher
    const filteredTeachers = classroom.teacher.filter(
      (stud) => stud.email !== teacher.email
    );

    if (filteredTeachers.length === originalLength) {
      // TODO implement correct exception
      throw new Error("teacher not found");
    }

    classroom.teacher = filteredTeachers;

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return true;
  }

  /** adds a subject */
  async addSubject(classId: string, subject: Subject) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      // TODO implement correct exception
      throw new Error("classroom not found");
    }

    // checking if subjects already exists
    const found = classroom.subjects.find(
      (savedSubjects) => savedSubjects.name === subject.name
    );

    if (found) {
      // TODO implement correct exception
      throw new Error("subject already exists");
    }

    classroom.subjects.push(subject);

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return classroom;
  }

  /** updates a subject */
  async updateSubject(
    classId: string,
    subjectName: string,
    subjectUpdate: Partial<Subject>
  ) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      // TODO implement correct exception
      throw new Error("classroom not found");
    }

    // find subject
    const index = classroom.subjects.findIndex(
      (savedsubject) => savedsubject.name === subjectName
    );

    if (index === -1) {
      // TODO implement correct exception
      throw new Error("subject not found");
    }

    classroom.subjects[index] = {
      ...classroom.subjects[index],
      ...subjectUpdate,
    };

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return classroom;
  }

  /** deletes a subject */
  async deleteSubject(classId: string, subject: { name: string }) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      // TODO implement correct exception
      throw new Error("classroom not found");
    }

    const originalLength = classroom.subjects.length;
    // delete subject
    const filteredSubjects = classroom.subjects.filter(
      (savedSubjects) => savedSubjects.name !== subject.name
    );

    if (filteredSubjects.length === originalLength) {
      // TODO implement correct exception
      throw new Error("subject not found");
    }

    classroom.subjects = filteredSubjects;

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return true;
  }

  /** adds a lesson to a subject */
  async addLesson(classId: string, subjectName: string, lesson: Lesson) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      // TODO implement correct exception
      throw new Error("classroom not found");
    }

    // checking if subject exists
    let index = classroom.subjects.findIndex(
      (savedSubjects) => savedSubjects.name === subjectName
    );

    if (index === -1) {
      // TODO implement correct exception
      throw new Error("subject not found");
    }

    // checking if lesson exists
    let found = classroom.subjects[index].lessons.find(
      (savedLessons) => savedLessons.name === lesson.name
    );

    if (found) {
      // TODO implement correct exception
      throw new Error("lesson already exists");
    }

    classroom.subjects[index].lessons.push(lesson);

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return classroom;
  }

  /** updates a lesson */
  async updateLesson(
    classId: string,
    subjectName: string,
    lessonName: string,
    lessonUpdate: Partial<Lesson>
  ) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      // TODO implement correct exception
      throw new Error("classroom not found");
    }

    // find subject
    let index = classroom.subjects.findIndex(
      (savedsubject) => savedsubject.name === subjectName
    );

    if (index === -1) {
      // TODO implement correct exception
      throw new Error("subject not found");
    }

    // find lesson
    let lessonIndex = classroom.subjects[index].lessons.findIndex(
      (savedsubject) => savedsubject.name === lessonName
    );

    if (lessonIndex === -1) {
      // TODO implement correct exception
      throw new Error("lesson not found");
    }

    classroom.subjects[index].lessons[lessonIndex] = {
      ...classroom.subjects[index].lessons[lessonIndex],
      ...lessonUpdate,
    };

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return classroom;
  }

  /** deletes a lesson */
  async deleteLesson(
    classId: string,
    subjectName: string,
    lesson: { name: string }
  ) {
    let classroom;

    try {
      classroom = await classRoomRepo.findOne({ _id: classId });
    } catch (err) {
      throw new ServerException();
    }

    if (classroom === null || classroom === undefined || !classroom) {
      // TODO implement correct exception
      throw new Error("classroom not found");
    }

    // find subject
    let index = classroom.subjects.findIndex(
      (savedsubject) => savedsubject.name === subjectName
    );

    if (index === -1) {
      // TODO implement correct exception
      throw new Error("subject not found");
    }

    const originalLength = classroom.subjects[index].lessons.length;
    // delete lesson
    const filteredSubjects = classroom.subjects[index].lessons.filter(
      (savedLesson) => savedLesson.name !== lesson.name
    );

    if (filteredSubjects.length === originalLength) {
      // TODO implement correct exception
      throw new Error("lesson not found");
    }

    classroom.subjects[index].lessons = filteredSubjects;

    try {
      await classroom.save();
    } catch (err) {
      throw new ServerException();
    }

    return true;
  }
}

export default ClassroomModel;
