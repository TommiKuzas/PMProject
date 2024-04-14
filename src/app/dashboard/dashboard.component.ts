import { Component, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  readOnlyMode: boolean;
  loginURL: string;
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
      readOnlyMode: false,
      loginURL: 'https://www.facebook.com/login/',
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
      readOnlyMode: false,
      loginURL: 'https://www.linkedin.com/login',
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
      readOnlyMode: false,
      loginURL: 'https://twitter.com/i/flow/login',
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
      readOnlyMode: false,
      loginURL: 'https://accounts.snapchat.com/accounts/v2/login',
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
      readOnlyMode: false,
      loginURL: 'https://www.instagram.com/accounts/login/',
    },
  ];

  sectionForms: { [key: string]: FormGroup } = {};

  constructor(
    public webService: WebService,
    private clipboard: Clipboard,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.initaliseForms();
    const userEmail = sessionStorage.getItem('userEmail');
    this.callGetCredsFunction({ 'user-email': userEmail }); // gets creds
  }

  loginResponse: any;
  showProfileModal: boolean = false;
  showCheckPassStrengthModal: boolean = false;
  getCredsResponse: any;
  strongPassword: string = '';

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
      // check if cred exists, if not set button text to Add
      const sessionItem = sessionStorage.getItem(section.key.toUpperCase());
      if (!sessionItem) {
        section.buttonText = 'Add Credentials';
        section.initialButtonText = 'Add Credentials';
      } else {
        // sets button to view and updates section with new data
        section.buttonText = 'View Credentials';
        section.initialButtonText = 'View Credentials';
        const { email, password } = JSON.parse(sessionItem);
        section.email = email;
        section.password = password;
      }
      // Makes creds visible once everyting is retrieved
      setTimeout(() => {
        document
          .getElementById(section.key + 'Div')
          ?.setAttribute('style', 'display: block;');
      }, 0);
    });
    this.fillForms(); // takes values from db and ads them to form.
    this.initialiseReadOnly();
    document.getElementById('spinner')?.setAttribute('style', 'display: none;');
  }

  initaliseForms() {
    this.sections.forEach((section) => {
      const formGroup = this.formBuilder.group({
        Email: ['', Validators.required],
        Password: ['', Validators.required],
      });
      this.sectionForms[section.key] = formGroup;
    });
  }
  fillForms() {
    this.sections.forEach((section) => {
      this.sectionForms[section.key].patchValue({
        Email: section.email,
        Password: section.password,
      });
    });
  }

  // dynamically hide/show add button and enter creds label (i remembered :])
  isFormFilled(section: SectionData): boolean {
    const formGroup = this.sectionForms[section.key];
    if (formGroup) {
      const email = formGroup.get('Email')?.value;
      const password = formGroup.get('Password')?.value;
      return email && password;
    }
    return false;
  }

  initialiseReadOnly() {
    this.sections.forEach((section) => {
      if (section.email != '') {
        section.readOnlyMode = true;
      }
    });
  }
  // returns true if password is atleast 8 characters long with number and special character
  checkPassStrength(password: string): boolean {
    const strongPassRegex: RegExp =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@£$%^&*#?])[A-Za-z\d!@£$%^&*#?]{8,}$/;
    return strongPassRegex.test(password);
  }

  // <<<==================================================================>>
  //                               Buttons
  // <<<==================================================================>>

  toggleProfileModal() {
    this.showProfileModal = !this.showProfileModal;
  }
  toggleCheckPassStrengthModal() {
    this.showCheckPassStrengthModal = !this.showProfileModal;
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

  onAddButtonClick(section: SectionData) {
    const pass = this.sectionForms[section.key].get('Password')?.value;
    const email = this.sectionForms[section.key].get('Email')?.value;
    const userEmail = sessionStorage.getItem('userEmail');

    if (this.checkPassStrength(pass)) {
      document
        .getElementById('add-spinner')
        ?.setAttribute('style', 'display: block;');
      // hides label
      document
        .getElementById('weakPasswordLabel')
        ?.setAttribute('style', 'display: none;');
      document
        .getElementById('add-btn')
        ?.setAttribute('style', 'display: none;');
      // creates payload
      const payload = {
        'new-Cred': {
          [section.key]: {
            email: email,
            password: pass,
          },
        },
        'user-email': userEmail,
      };
      // sends new creds to DB
      this.webService.addCreds(payload).subscribe(
        (response) => {
          window.location.reload();
        },
        (error) => {
          console.error('Error while Adding Creds:', error);
        }
      );
    } else {
      // shows label that explain password requirements
      document
        .getElementById(section.key + 'weakPasswordLabel')
        ?.setAttribute('style', 'display: block;');
    }
  }

  onDeleteButtonClick(section: SectionData) {
    const key = section.key;
    const userEmail = sessionStorage.getItem('userEmail');
    const payload = {
      key: key,
      'user-email': userEmail,
    };
    // sends creds to delete
    this.webService.deleteCreds(payload).subscribe(
      (response) => {
        // clear session for that cred
        sessionStorage.removeItem(key.toUpperCase());
        window.location.reload();
      },
      (error) => {
        console.error('Error while Adding Creds:', error);
      }
    );
  }

  copyDetails(section: SectionData, emailPass: string) {
    if (emailPass == 'Email') {
      this.clipboard.copy(section.email);
    } else {
      this.clipboard.copy(section.password);
    }
  }

  toggleDetails(section: SectionData) {
    section.showCreds = !section.showCreds;
  }

  onEditButtonClick(section: SectionData) {
    section.readOnlyMode = false;
    section.showEditBtn = false;
    section.showUpdateBtn = true;
    section.showCreds = true;
  }

  onUpdateButtonClick(section: SectionData) {
    document
      .getElementById(section.key + 'update-spinner')
      ?.setAttribute('style', 'display: block;');
    const pass = this.sectionForms[section.key].get('Password')?.value;
    const email = this.sectionForms[section.key].get('Email')?.value;
    const userEmail = sessionStorage.getItem('userEmail');
    const key = section.key;

    if (this.checkPassStrength(pass)) {
      // make payload
      const payload = {
        key: key,
        email: email,
        password: pass,
        'user-email': userEmail,
      };
      // send request
      this.webService.updateCreds(payload).subscribe(
        (response) => {
          document
            .getElementById(section.key + 'btns-conainer')
            ?.setAttribute('style', 'display: none;');
          sessionStorage.removeItem(key.toUpperCase());
          window.location.reload();
        },
        (error) => {
          console.error('Error while Adding Creds:', error);
        }
      );
    } else {
      // shows label that explain password requirements -- this might not work / important
      document
        .getElementById('weakPasswordLabel')
        ?.setAttribute('style', 'display: block;');
      document
        .getElementById(section.key + 'update-spinner')
        ?.setAttribute('style', 'display: none;');
    }
  }

  onSocialLinkButtonClick(section: SectionData) {
    window.open(section.loginURL);
  }

  generatePass() {
    const possibleCharacters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPWRSTUVWXYZ0123456789!@£$%^&*#?';
    for (let i = 0; i < 20; i++) {
      this.strongPassword +=
        possibleCharacters[
          Math.floor(Math.random() * possibleCharacters.length)
        ];
    }
  }
}
