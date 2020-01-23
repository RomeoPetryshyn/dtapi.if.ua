import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetStudentsInterface } from '../interfaces/get-students-interface';
import { CreareUpdateStudentsInterface } from '../interfaces/creare-update-students-interface';
import { ResponseInterface } from '../interfaces/response-interface';

@Injectable()
export class StudentsService {

  private checkStudentNameURL = 'AdminUser/checkUserName';
  private checkStudentEmailURL = 'AdminUser/checkEmailAddress';

  private checkGradebookIdURL = 'Student/checkGradebookID';

  constructor(private httpClient: HttpClient) {}

  checkUsername(username: string) {
    return this.httpClient.get(`${this.checkStudentNameURL}/${username}`);
  }

  checkUserEmail(email: string) {
    return this.httpClient.get(`${this.checkStudentEmailURL}/${email}`);
  }

  checkGradebookID(gradebook_id: string) {
    return this.httpClient.get(`${this.checkGradebookIdURL}/${gradebook_id}`);
  }
}