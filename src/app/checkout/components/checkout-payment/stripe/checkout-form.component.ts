import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { StripePaymentElementComponent } from 'ngx-stripe';
import { PaymentIntentResult, StripeCardElementOptions, StripeElements, StripeElementsOptions, StripePaymentElementOptions, loadStripe } from '@stripe/stripe-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'vsf-checkout-form',
    standalone: true,
    templateUrl: './checkout-form.component.html',
    // styleUrls: ['./checkout-form.component.css'],
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [
        CommonModule,
    ]
})
export class CheckoutFormComponent implements OnInit {
    @Input() orderCode: string;
    @Input() clientSecret$: Observable<string>;

    clientSecret = '';

    @ViewChild('cardInfo') cardInfo: ElementRef = new ElementRef('');
    cardError: string | null = null;

    // @ViewChild(StripePaymentElementComponent, { static: false})
    // paymentElement: StripePaymentElementComponent | undefined;
    paying = false;
    // paymentElementOptions: StripePaymentElementOptions = {
    //     business: { name: "Boom's Black Market" },
    //     defaultValues: {
    //
    //     }
    // };
    status = "";
    paymentErrorMessage: string | undefined;

    // paymentElementForm = this.fb.group({
    //     name: ['', [Validators.required]],
    //     email: ['', [Validators.email]]
    // });

    stripe: any;
    elements: StripeElements;
    card: any;
    // card: StripeCardElement;
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
        private ngZone: NgZone,
    ) { }

    async ngOnInit() {
        // this.stripeService.setKey(environment.stripePublishableKey, { locale: 'es' });
        // this.stripe = this.stripeService.getInstance();
        this.stripe = await loadStripe(environment.stripePublishableKey);

        this.clientSecret = await this.clientSecret$.toPromise();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.elements = this.stripe!.elements({
            clientSecret: this.clientSecret,
        });

        // Only mount the element the first time
        if (!this.card) {
            this.card = this.elements.create('card', this.cardOptions);
            this.card.mount(this.cardInfo.nativeElement);
            this.card.addEventListener('change', this.onChange.bind(this));
        }

        this.stripeTest = this.fb.group({ name: ['', [Validators.required]] });
    }

    onChange = ({ error }: { error: any }) => {
        error ? this.ngZone.run(() => this.cardError = error.message) : this.ngZone.run(() => this.cardError = null);
    };

    async handleSubmit(event: Event) {
        event.preventDefault();

        if (!this.stripe || !this.elements) {
            return;
        }

        const orderCode = this.orderCode;
        const returnUrl = `${location.origin}/checkout/confirmation/${orderCode}`;

        const result: PaymentIntentResult = await this.stripe.confirmPayment({
            // Missing elements params here due next error: IntegrationError: Invalid value for stripe.confirmPayment(): elements should have a mounted Payment Element or Express Checkout Element. It looks like you have other Elements on the page.
            // elements: this.elements,
            clientSecret: this.clientSecret,
            redirect: 'if_required',
            confirmParams: {
                // When writing test code, use a PaymentMethod such as pm_card_visa instead of a card number.
                payment_method: 'pm_card_visa',
            },
        });


        this.paying = false;
        if (result.error) {
            // Show error to the customer
            console.log('error: ', result.error.message);
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                window.location.href = returnUrl;
            }
        }
    }
}
