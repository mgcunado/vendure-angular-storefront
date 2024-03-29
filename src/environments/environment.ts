// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export function getShopApiPath(languageCode: string): string {
  return languageCode === 'es' ? 'shop-api?languageCode=es' : 'shop-api?languageCode=en';
}

export const environment = {
    production: false,
    apiHost: 'http://localhost',
    apiPort: 3000,
    baseHref: '/',
    tokenMethod: 'bearer',
    stripePublishableKey: 'pk_test_51OkCXdHWMYTqMLlBf55HAsrNN8bgppJfuzaU92FkaA5qx5kshUlPbfaRusxx5My6bkAImNgTbf3s2jO6uOFZViH800lNlkYYHT',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
