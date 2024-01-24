import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SignInMutation, SignInMutationVariables } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';
import { StateService } from '../../../core/providers/state/state.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SIGN_IN } from './sign-in.graphql';

@Component({
    selector: 'vsf-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
    @Input() navigateToOnSuccess: any[] | undefined;
    @Input() displayRegisterLink = true;

    signInForm: FormGroup;

    emailAddress: string;
    password: string;
    rememberMe = false;

    invalidCredentials = false;

    constructor(
        private dataService: DataService,
        private stateService: StateService,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder, // Add formBuilder
    ) {
        this.signInForm = this.formBuilder.group({
            emailAddress: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [false],
        });
    }

    signIn() {
        if (this.signInForm.valid) {
            const emailAddress = this.signInForm.get('emailAddress')?.value;
            const password = this.signInForm.get('password')?.value;
            const rememberMe = this.signInForm.get('rememberMe')?.value;

            this.dataService.mutate<SignInMutation, SignInMutationVariables>(SIGN_IN, {
                emailAddress,
                password,
                rememberMe,
            }).subscribe({
                    next: ({login}) => {
                        switch (login.__typename) {
                            case 'CurrentUser': {
                                this.stateService.setState('signedIn', true);
                                const commands = this.navigateToOnSuccess || ['/'];
                                this.router.navigate(commands);
                                break;
                            }
                            case 'NativeAuthStrategyError':
                            case 'InvalidCredentialsError':
                                this.displayCredentialsError();
                                break;
                        }
                    },
                });
        }
    }

    private displayCredentialsError() {
        this.invalidCredentials = false;
        this.changeDetector.markForCheck();
        setTimeout(() => {
            this.invalidCredentials = true;
            this.changeDetector.markForCheck();
        }, 50);
    }
}
