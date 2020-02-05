export interface Group {
  group_id: number;
  group_name: string;
  speciality_id: number;
  faculty_id: number;
}

export interface Speciality {
  speciality_id: number;
  speciality_code: string;
  speciality_name: string;
}

export interface Faculty {
  faculty_id: number;
  faculty_name: string;
  faculty_description: string;
}

export interface DialogData {
    data: any;
  }

export interface TimeTable {
  timetable_id: number;
  group_id: number;
  group_name?: string;
  subject_id: number;
  start_date: number;
  start_time: number;
  end_date: number;
  end_time: number;
}

export interface ResponseInterface {
  response: string;
}

export interface Student {
  user_id: string;
  gradebook_id: string;
  student_surname: string;
  student_name: string;
  student_fname: string;
  group_id: string;
  plain_password: string;
  photo: string;
}
