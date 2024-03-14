import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaymentIntentResult, StripeCardElementOptions, StripeElements, StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

interface StripeCardEvent {
    elementType: string;
    error?: any;
    value?: any;
    empty?: boolean;
    complete?: boolean;
}

@Component({
    selector: 'vsf-checkout-form',
    standalone: true,
    templateUrl: './checkout-form.component.html',
    styleUrls: ['./checkout-form.component.scss'],
    // styleUrls: ['../../../../../../src/styles/styles.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [
        CommonModule,
        SharedModule,
    ]
})
export class CheckoutFormComponent implements OnInit {
    @Input() orderCode: string;
    @Input() clientSecret$: Observable<string>;

    clientSecret = '';

    // @ViewChild('cardInfo') cardInfo: ElementRef = new ElementRef('');
    @ViewChild('cardInfo') cardInfo: ElementRef = new ElementRef('');
    @ViewChild('exp') exp: ElementRef = new ElementRef('');
    @ViewChild('cvc') cvc: ElementRef = new ElementRef('');
    cardError: string | null = null;

    paying = false;
    status = "";
    paymentErrorMessage: string | undefined;

    stripe: any;
    elements: StripeElements;
    card: any;
    cardNumber: any;
    cardCvc: any;
    cardExp: any;

    cardNumberComplete = false;
    cardExpiryComplete = false;
    cardCvcComplete = false;

    cardOptions: StripeCardElementOptions = {
        // classes: {
        // base: 'border-gray-300',
        // },
        style: {
            base: {
                iconColor: '#666EE8',
                color: '#31325F',
                fontWeight: '100',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '16px',
                '::placeholder': {
                    color: '#B5B5B5',
                },
            },
            invalid: {
                color: '#dc3545',
            },
        }
    };
    stripeTest: FormGroup;
    elementsOptions: StripeElementsOptions;

    constructor(
        private fb: FormBuilder,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef,
    ) {}

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
            this.cardNumber = this.elements.create('cardNumber', this.cardOptions);
            this.cardCvc = this.elements.create('cardCvc', this.cardOptions);
            this.cardExp = this.elements.create('cardExpiry', this.cardOptions);
            this.cardNumber.mount(this.cardInfo.nativeElement);
            this.cardNumber.addEventListener('change', (event: StripeCardEvent) => this.onChange(event));

            this.cardExp.mount(this.exp.nativeElement);
            this.cardExp.addEventListener('change', (event: StripeCardEvent) => this.onChange(event));

            this.cardCvc.mount(this.cvc.nativeElement);
            this.cardCvc.addEventListener('change', (event: StripeCardEvent) => this.onChange(event));

        }

        this.stripeTest = this.fb.group({ name: ['', [Validators.required]] });
    }

    onChange = (event: StripeCardEvent) => {
        const { elementType, complete, error } = event;

        if ( elementType === 'cardNumber' && complete) this.cardNumberComplete = true;
        if ( elementType === 'cardExpiry' && complete) this.cardExpiryComplete = true;
        if ( elementType === 'cardCvc' && complete) this.cardCvcComplete = true;

        this.cdr.detectChanges();

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
