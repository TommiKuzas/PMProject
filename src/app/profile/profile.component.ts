import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router, public auth: AuthService) {}

  userFName = sessionStorage.getItem('userFName');
  userEmail = sessionStorage.getItem('userEmail');

  logout(): void {
    sessionStorage.clear();
    this.auth.logout({ returnTo: window.location.origin });
  }
  ngOnInit(): void {}
}
