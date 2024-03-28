import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class WebService {
  workoutList: any;

  constructor(private http: HttpClient, public router: Router) {}
  checkCredsURL: string =
    'https://prod-04.northeurope.logic.azure.com:443/workflows/114a056f8e0a461b9e2709ba4914b583/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=xNWGuqwdNj2EugCH6PW-C-_R3G6t4-ZZCE6VSA3pjLE';
  loginURL: string =
    'https://prod-11.northeurope.logic.azure.com:443/workflows/dba1c4384af04f86acccfdb890b09bc0/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=EF9Vbr7sQlGRKtX-sbO5UhEdbc4JJycfeRubttZN5Us';

  login(userDoc: any) {
    return this.http.post(this.loginURL, userDoc);
  }
  getCreds(email: any) {
    return this.http.post(this.checkCredsURL, email);
  }
}