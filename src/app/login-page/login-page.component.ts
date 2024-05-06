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
        filter((user) => !!user), // get cookie
        tap((user) => {
          // get user from cookie
          var userName = user?.name ?? '';
          const userEmail = user?.email ?? '';
          if (userName.includes('@')) {
            userName = userName.split('@')[0];
          }

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

  login() {
    this.authService.loginWithRedirect();
  }

  //
  callLoginFunction(email: any) {
    this.webService.login(email).subscribe(
      (response) => {
        var optInString = response ? 'true' : 'false';
        sessionStorage.setItem('opt-in', optInString);
      },
      (error) => {
        console.error('Error while logging in:', error);
      }
    );
  }
}
