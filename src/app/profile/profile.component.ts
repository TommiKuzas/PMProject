import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { WebService } from '../web.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  constructor(public auth: AuthService, public webService: WebService) {}

  userFName = sessionStorage.getItem('userFName');
  userEmail = sessionStorage.getItem('userEmail');
  initialOptInBool: boolean = false;

  logout(): void {
    sessionStorage.clear();
    this.auth.logout({ returnTo: window.location.origin });
  }

  optInScan(optInBool: boolean) {
    const userEmail = sessionStorage.getItem('userEmail');
    const optInPayload = {
      optIn: optInBool,
      'user-email': userEmail,
    };

    this.webService.optInOut(optInPayload).subscribe(
      (response) => {
        var optInString = optInBool ? 'true' : 'false';
        sessionStorage.setItem('optIn', optInString);
        document
          .getElementById('opt-in-out-label')
          ?.setAttribute(
            'style',
            'display: flex; justify-content: center; align-items: center;'
          );
      },
      (error) => {
        console.error('Error while Checking Creds:', error);
      }
    );
  }

  ngOnInit(): void {
    // convert session optIn to boolean
    const initialOptInstring = sessionStorage.getItem('optIn');

    if (initialOptInstring == 'true') {
      this.initialOptInBool = true;
    } else {
      this.initialOptInBool = false;
    }
  }
}
