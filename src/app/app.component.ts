import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public auth0: AuthService) {}
  showProfileModal: boolean = false;
  title = 'APMProject';

  toggleProfileModal() {
    this.showProfileModal = !this.showProfileModal;
    console.log('Profile modal toggled:', this.showProfileModal);
  }
}
