import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private _stripe: Promise<Stripe | null>;

  // constructor() {}

  getStripe(publishableKey: string): Promise<Stripe | null> {
    if (!this._stripe) {
      this._stripe = loadStripe(publishableKey);
    }
    return this._stripe;
  }
}

