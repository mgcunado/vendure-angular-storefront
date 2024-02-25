import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StripeService } from 'ngx-stripe';
import { StripeCardElement, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
    selector: 'vsf-checkout-form',
    standalone: true,
    templateUrl: './checkout-form.component.html',
    // styleUrls: ['./checkout-form.component.css'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutFormComponent implements OnInit {
    @Input() orderCode: string;
    @Input() clientSecret$: Observable<string>;
    clientSecret = '';

    stripe: any;
    elements: any;
    card: StripeCardElement;
    cardOptions: StripeCardElementOptions = {
        style: {
            base: {
                iconColor: '#666EE8',
                color: '#31325F',
                fontWeight: '300',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                    color: '#CFD7E0'
                }
            }
        }
    };
    stripeTest: FormGroup;
    elementsOptions: StripeElementsOptions;

    constructor(
        private fb: FormBuilder,
        private stripeService: StripeService,
    ) {}

    async ngOnInit() {
        this.stripeService.setKey(environment.stripePublishableKey, { locale: 'es' });
        this.stripe = this.stripeService.getInstance();

        this.clientSecret = await this.clientSecret$.toPromise();

        this.stripeTest = this.fb.group({ name: ['', [Validators.required]] });

        this.elementsOptions = { clientSecret: this.clientSecret };

        this.stripeService.elements(this.elementsOptions)
            .subscribe(elements => {
                this.elements = elements;

                // Only mount the element the first time
                if (!this.card) {
                    this.card = this.elements.create('card', this.cardOptions);
                    this.card.mount('#card-element');
                }
            });
    }


    async handleSubmit(event: Event) {
        event.preventDefault();

        if (!this.stripe || !this.elements) {
            return;
        }

        const { error } = await this.stripe.confirmPayment({
            // Elements instance that was used to create the Payment Element
            elements: this.elements,
            confirmParams: {
                payment_method_data: {
                    name: this.stripeTest.get('name')?.value,
                    card: this.card,
                },
                return_url: window.location.origin + `/checkout/confirmation/${this.orderCode}`,
            },
        });

        if (error) {
            console.log(error.message);
        } else {
            // Your customer will be redirected to your `return_url`.
            window.location.assign('/');
        }
    }

    // async createToken(event: Event) {
    //     event.preventDefault();
    //
    //     const name = this.stripeTest.get('name')?.value;
    //     this.stripeService.createToken(this.card, { name }).subscribe((result) => {
    //     if (result.token) {
    //     console.log('');
    //     } else if (result.error) {
    //     console.log(result.error.message);
    //     }
    //     });
    // }
}
