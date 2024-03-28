import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { WebService } from '../web.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    public webService: WebService
  ) {}

  ngOnInit(): void {
    let uuid = uuidv4();
    this.authService.user$
      .pipe(
        filter((user) => !!user),
        tap((user) => {
          const userName = user?.name ?? '';
          const userEmail = user?.email ?? '';

          sessionStorage.setItem('userFName', userName);
          sessionStorage.setItem('userEmail', userEmail);

          this.callLoginFunction({
            id: uuid,
            'user-email': user?.email,
            name: user?.name,
          });
        })
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }
  loginResponse: any;

  login() {
    this.authService.loginWithRedirect();
  }
  callLoginFunction(email: any) {
    this.webService.login(email).subscribe(
      (response) => {
        this.loginResponse = response;
      },
      (error) => {
        console.error('Error while logging in:', error);
      }
    );
  }
}
