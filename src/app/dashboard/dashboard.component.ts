import { Component, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { Clipboard } from '@angular/cdk/clipboard';

interface SectionData {
  key: string;
  buttonText: string;
  isExpanded: boolean;
  initialButtonText: string;
  email: string;
  password: string;
  showEditBtn: boolean;
  showUpdateBtn: boolean;
  showCreds: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // initialised all sections here to avoid typing everything out 5 times
  sections: SectionData[] = [
    {
      key: 'facebook',
      buttonText: '',
      isExpanded: false,
      email: '',
      initialButtonText: '',
      password: '',
      showEditBtn: false,
      showUpdateBtn: false,
      showCreds: false,
    },
    {
      key: 'linkedin',
      buttonText: '',
      isExpanded: false,
      initialButtonText: '',
      email: '',
      password: '',
      showEditBtn: false,
      showUpdateBtn: false,
      showCreds: false,
    },
    {
      key: 'x',
      buttonText: '',
      isExpanded: false,
      initialButtonText: '',
      email: '',
      password: '',
      showEditBtn: false,
      showUpdateBtn: false,
      showCreds: false,
    },
    {
      key: 'snapchat',
      buttonText: '',
      isExpanded: false,
      initialButtonText: '',
      email: '',
      password: '',
      showEditBtn: false,
      showUpdateBtn: false,
      showCreds: false,
    },
    {
      key: 'instagram',
      buttonText: '',
      isExpanded: false,
      initialButtonText: '',
      email: '',
      password: '',
      showEditBtn: false,
      showUpdateBtn: false,
      showCreds: false,
    },
  ];

  constructor(public webService: WebService, private clipboard: Clipboard) {}
  ngOnInit(): void {
    const userEmail = sessionStorage.getItem('userEmail');
    this.callGetCredsFunction({ 'user-email': userEmail }); // gets creds
  }

  loginResponse: any;
  showProfileModal: boolean = false;
  getCredsResponse: any;

  toggleProfileModal() {
    this.showProfileModal = !this.showProfileModal;
  }

  callGetCredsFunction(email: any) {
    this.webService.getCreds(email).subscribe(
      (response) => {
        this.getCredsResponse = response;

        // saves all creds to session storage based on key/social media name
        for (const key in this.getCredsResponse) {
          if (this.getCredsResponse.hasOwnProperty(key)) {
            const obj = this.getCredsResponse[key];
            sessionStorage.setItem(key.toUpperCase(), JSON.stringify(obj));
          }
        }

        this.initialiseCreds(); // Sets buttons text and updates creds
      },
      (error) => {
        console.error('Error while Checking Creds:', error);
      }
    );
  }

  initialiseCreds() {
    this.sections.forEach((section) => {
      // loop through each cred
      // check if cred exists, if not set button text to Add
      const sessionItem = sessionStorage.getItem(section.key.toUpperCase());
      if (!sessionItem) {
        section.buttonText = 'Add Credentials';
        section.initialButtonText = 'Add Credentials';
      } else {
        // set button to view and update section with new data
        section.buttonText = 'View Credentials';
        section.initialButtonText = 'View Credentials';
        const { email, password } = JSON.parse(sessionItem);
        section.email = email;
        section.password = password;
      }
    });
    document.getElementById('spinner')?.setAttribute('style', 'display: none;');
  }
  // when button click change to hide or view/add
  toggleCollapse(section: SectionData) {
    section.isExpanded = !section.isExpanded;
    if (section.isExpanded) {
      section.buttonText = 'Hide';
      section.showEditBtn = true;
    } else {
      section.buttonText = section.initialButtonText;
      section.showEditBtn = false;
    }
  }

  onEditButtonClick(section: SectionData) {
    section.showEditBtn = false;
    section.showUpdateBtn = true;
  }

  onUpdateButtonClick() {
    // take info and make API call
  }

  toggleDetails(section: SectionData) {
    section.showCreds = !section.showCreds;
  }
  copyDetails(section: SectionData, emailPass: string) {
    if (emailPass == 'Email') {
      this.clipboard.copy(section.email);
    } else {
      this.clipboard.copy(section.password);
    }
  }
}
