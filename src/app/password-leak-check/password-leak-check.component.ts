import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WebService } from '../web.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-password-leak-check',
  templateUrl: './password-leak-check.component.html',
  styleUrls: ['./password-leak-check.component.css'],
})
export class PasswordLeakCheckComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  constructor(public webService: WebService) {}

  ngOnInit(): void {}

  leakCount: any;
  passDict: { [key: string]: string } = {};

  checkPasswordStrength(passToCheck: string) {
    document
      .getElementById('spinner')
      ?.setAttribute('style', 'display: block;');
    const HashValues = this.preparePass(passToCheck);
    this.webService.checkLeaks(HashValues.firstFiveDigits).subscribe(
      (response) => {
        var splitResponse = response.split('\r\n');
        for (let i = 0; i < splitResponse.length; i++) {
          var splitLine = splitResponse[i].split(':');
          this.passDict[splitLine[0]] = splitLine[1];
        }
        this.leakCount = this.passDict[HashValues.otherDigits.toUpperCase()];
        if (this.leakCount == null) {
          this.leakCount = '0';
        }
        document
          .getElementById('spinner')
          ?.setAttribute('style', 'display: none;');
        document
          .getElementById('password-details')
          ?.setAttribute('style', 'display: block;');
      },
      (error) => {
        console.error('Error while Checking Creds:', error);
      }
    );
  }

  preparePass(password: string) {
    const hashedPassString = CryptoJS.SHA1(password).toString();
    const firstFiveDigits = hashedPassString.substring(0, 5);
    const otherDigits = hashedPassString.substring(5);
    return { firstFiveDigits, otherDigits };
  }
}
