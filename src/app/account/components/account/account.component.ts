import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SignOutMutation } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';
import { StateService } from '../../../core/providers/state/state.service';

import { SIGN_OUT } from './account.graphql';
import { SignOutService } from 'src/app/core/providers/sign-out/sign-out.service';

@Component({
    selector: 'vsf-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {

    isSignedIn$: Observable<boolean>;

  constructor(
    private signOutService: SignOutService,
    private stateService: StateService,
    private router: Router
  ) {
    this.isSignedIn$ = this.stateService.select((state) => state.signedIn);
  }

  signOut() {
    this.signOutService.signOut().subscribe({
      next: () => {
        this.stateService.setState('signedIn', false);
        this.router.navigate(['/']);
      },
    });
  }
}
