import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';

import { SIGN_OUT } from 'src/app/account/components/account/account.graphql';
import { SignOutMutation } from 'src/app/common/generated-types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignOutService {
  constructor(
    private dataService: DataService,
  ) {}

  signOut(): Observable<SignOutMutation> {
    return this.dataService.mutate<SignOutMutation>(SIGN_OUT);
  }
}

