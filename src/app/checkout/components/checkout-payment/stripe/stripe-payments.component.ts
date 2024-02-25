import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxStripeModule, StripeCardComponent } from "ngx-stripe";

import { Observable } from "rxjs";

import {FormsModule} from "@angular/forms";
import { environment } from 'src/environments/environment';
import { CheckoutFormComponent } from './checkout-form.component';
import { DataService } from 'src/app/core/providers/data/data.service';
import { CreateStripePaymentIntentMutation } from 'src/app/common/generated-types';
import { CREATE_STRIPE_PAYMENT_INTENT } from '../../checkout-shipping/checkout-shipping.graphql';
import { map } from 'rxjs/operators';

@Component({
    selector: 'vsf-stripe-payments',
    standalone: true,
    imports: [CommonModule, StripeCardComponent, NgxStripeModule, FormsModule, CheckoutFormComponent],
    templateUrl: './stripe-payments.component.html',
    // styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentsComponent implements OnInit {
    @Input() orderCode: any;

    public stripePublicKey = environment.stripePublishableKey;

    clientSecret$: Observable<string>;

    constructor(
        private dataService: DataService,
    ) {}

    async ngOnInit(): Promise<void> {
        try {
            this.clientSecret$ = this.dataService.mutate<CreateStripePaymentIntentMutation>(CREATE_STRIPE_PAYMENT_INTENT)
                .pipe(
                    map((data) => data.createStripePaymentIntent)
                );
        } catch (error) {
            console.error(error);
        }
    }
}
