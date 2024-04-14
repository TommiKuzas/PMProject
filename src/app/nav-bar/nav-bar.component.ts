import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  constructor(private router: Router, public auth: AuthService) {}

  @Output() profileToggle: EventEmitter<void> = new EventEmitter<void>();
  @Output() PassStrengthToggle: EventEmitter<void> = new EventEmitter<void>();

  userFName = sessionStorage.getItem('userFName');

  onProfileToggle() {
    this.profileToggle.emit();
  }

  checkPassStrengthToggle() {
    this.PassStrengthToggle.emit();
  }

  ngOnInit(): void {}
}
