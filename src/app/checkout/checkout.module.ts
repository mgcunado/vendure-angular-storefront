import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { routes } from './checkout.routes';
import { CheckoutConfirmationComponent } from './components/checkout-confirmation/checkout-confirmation.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import { CheckoutProcessComponent } from './components/checkout-process/checkout-process.component';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping.component';
import { CheckoutSignInComponent } from './components/checkout-sign-in/checkout-sign-in.component';
import { CheckoutStageIndicatorComponent } from './components/checkout-stage-indicator/checkout-stage-indicator.component';
import { AppTranslateModule } from '../translate/translate.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutFormComponent } from './components/checkout-payment/stripe/checkout-form.component';
import { StripePaymentsComponent } from './components/checkout-payment/stripe/stripe-payments.component';

const DECLARATIONS = [
    CheckoutConfirmationComponent,
    CheckoutPaymentComponent,
    CheckoutShippingComponent,
    CheckoutSignInComponent,
    CheckoutProcessComponent,
    CheckoutStageIndicatorComponent,
];

@NgModule({
    declarations: DECLARATIONS,
    imports: [
        SharedModule,
        AppTranslateModule,
        AppTranslateModule,
        ReactiveFormsModule,
        StripePaymentsComponent,
        CheckoutFormComponent,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class CheckoutModule {
}
