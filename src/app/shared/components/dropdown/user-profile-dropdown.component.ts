import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SignOutService } from 'src/app/core/providers/sign-out/sign-out.service';
import { StateService } from 'src/app/core/providers/state/state.service';

@Component({
  selector: 'vsf-user-profile-dropdown',
  templateUrl: './user-profile-dropdown.component.html',
  styleUrls: ['./user-profile-dropdown.component.scss']
})
export class UserProfileDropdownComponent {
  @Input() userName = '';
  isDropdownOpen = false;

    constructor(
        private signOutService: SignOutService,
        private stateService: StateService,
        private router: Router,
    ) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logOut() {
    this.signOutService.signOut().subscribe({
      next: () => {
        this.stateService.setState('signedIn', false);
        this.router.navigate(['/']);
      },
    });
  }
}

