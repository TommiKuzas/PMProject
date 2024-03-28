import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  constructor() {}
  @Output() profileToggle: EventEmitter<void> = new EventEmitter<void>();

  userFName = sessionStorage.getItem('userFName');

  onProfileToggle() {
    this.profileToggle.emit();
  }

  ngOnInit(): void {}
}
