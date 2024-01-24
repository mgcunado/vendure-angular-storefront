# Vendure Angular Storefront

This is an e-commerce storefront application which is designed to be used with the [Vendure ecommerce framework](https://github.com/vendure-ecommerce/vendure) as a back end.

It is a progressive web application (PWA) which also uses Angular Universal for server-side rendering.

The app is built with the [Angular CLI](https://github.com/angular/angular-cli), with the data layer being handled by [Apollo Client](https://github.com/apollographql/apollo-client).

## Development

0. Clone this repo
1. Run `npm install` or `yarn` in the root dir
2. Run `npm start` or `yarn start` to build in development mode.
3. Make sure you have a local Vendure instance running a `http://localhost:3000`.
4. Open `http://localhost:4201` to see the storefront app running.

## Code generation

This project uses [graphql-code-generator](https://www.graphql-code-generator.com/) to generate TypeScript types based on the Vendure GraphQL API. To update the types, first change the `schema` property of [codegen.yml](./codegen.yml) to point to your local Vendure server, and then run the `generate-types` npm script.

## Deployment

To deploy this storefront in a production environment, take the following steps:

1. Open the [environment.prod.ts file](./src/environments/environment.prod.ts) and change the values to match your deployed Vendure server. You also probably want to set the `baseHref` value to `'/'` rather than `'/storefront/'`.
2. Open the [angular.json file](./angular.json) and set the baseHref values to point to root:
    ```diff
      "production": {
    - "baseHref": "/storefront/",
    - "deployUrl": "/storefront/",
    + "baseHref": "/",
    + "deployUrl": "/",
    ```
3. You then need to build for production using the `build:ssr` npm script. This can be done either locally or on your production server, depending on your preferred workflow.
4. The built artifacts will be found in the `dist/` directory. The command to run the storefront as a server-rendered app is `node dist/server/main.js`. This will start a node server running on port 4000. You should configure your webserver to pass requests arriving on port 80 to `localhost:4000`.
5. In the Vender server config, configure the `EmailPlugin` to point to the correct routes used by this storefront:
   ```ts
   EmailPlugin.init({
     // ...
     globalTemplateVars: {
       fromAddress: '"Example_Server" <noreply@example.com>',
       verifyEmailAddressUrl: 'https://your-domain.com/account/verify',
       passwordResetUrl: 'https://your-domain.com/account/reset-password',
       changeEmailAddressUrl: 'https://your-domain.com/account/change-email-address',
     }
   })
   ```

### Deploying the demo

This project is used in the [angular-storefront.vendure.io](https://angular-storefront.vendure.io) demo. There is a [GitHub Actions workflow](./.github/workflows/build.yml) which is triggered whenever a new tag is added. The tag should be of the format `"vX.Y.Z"`. The workflow will run the `build:ssr` script and upload the compiled output to an Amazon S3 bucket, from which the vendure-demo project will pull the artifacts.

1. Update the version in package.json & Dockerfile
2. Commit the changes "Bump version to vX.Y.Z"
3. Create a tag with the same version number:
   ```sh
   git tag -a v1.2.3 -m "v1.2.3"
   ```
4. Push the tag to GitHub:
   ```sh
   git push origin master --follow-tags
   ```

Once the GitHub action workflow has completed and the built artifacts have been successfully uploaded to the S3 bucket, the app can be deployed with `git push dokku master`.

## License

MIT

## Updating Storefront

1. Inserting new icon in project:
- go to and select icon:
[fontawesome-icons](https://fontawesome.com/v4/icons/)
- insert into `src/app/core/icon-library.ts` file using:
```
fa + IconName (in CamelCase format)
```
- use it in template in normal format:
```
<fa-icon [icon]="andFilters ? 'toggle-on' : 'toggle-off'" class="mr-2"></fa-icon>
```
- changing the tailwind colors by next url ref:
```
https://tailwindcss.com/docs/customizing-colors
```
- To add a "And filters" or "Or filters" logic in product's list I modified next files:
```
src/app/core/components/product-list/product-list.component.ts
src/app/core/components/product-list/product-list.component.html
src/app/core/components/product-list-controls/product-list-controls.component.ts
src/app/core/components/product-list-controls/product-list-controls.component.html
```

2. Move vsf-account-link on:
```
src/app/app.component.html
```

3. Modify the sign-in form on next files:
```
src/app/shared/components/sign-in/sign-in.component.ts
src/app/shared/components/sign-in/sign-in.component.html
```

4. Modify next file to get register's username instead "sign-in":
```
src/app/core/components/account-link/account-link.component.ts
```

- using:
```
this.activeCustomer$ = this.stateService.select(state => state.signedIn).pipe(
   switchMap(() => this.dataService.query<GetActiveCustomerQuery>(GET_ACTIVE_CUSTOMER, {}, 'network-only')),
   map(data => data && data.activeCustomer),
);
```

- instead:
```
this.activeCustomer$ = this.stateService.select(state => state.signedIn).pipe(
   switchMap(() => getActiveCustomer$),
   map(data => data && data.activeCustomer),
);
```

using "this.dataService.query" ensures that a new observable is created for each emission, while the original version might not re-run the observable if it's cold and hasn't been resubscribed.

5. Create new logo and their combinations using next commands, and replace them on src/assets folder:
```
convert cube-logo-small.png -resize 128x128! icon-128x128.png
convert cube-logo-small.png -resize 152x152! icon-152x152.png
convert cube-logo-small.png -resize 384x384! icon-384x384.png
convert cube-logo-small.png -resize 72x72! icon-72x72.png
convert cube-logo-small.png -resize 144x144! icon-144x144.png
convert cube-logo-small.png -resize 192x192! icon-192x192.png
convert cube-logo-small.png -resize 512x512! icon-512x512.png
convert cube-logo-small.png -resize 96x96! icon-96x96.png
```
- changing white color to another on logo image using imagemagick:
```
convert white-cube-logo-small.png -fuzz 15% -fill "#6DFF98" -opaque white cube-logo-small.png
```

6. Create a favicon.ico and locate it on src/:
```
convert cube-logo-small.png -define icon:auto-resize=64,48,32,16 favicon.ico
```

7. On `src/app/core/components/cart-drawer/cart-drawer.component.ts` file added to close cart popup window on Escape key:
```
@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        this.close.emit();
    }
}
```

8. Added in `src/app/core/components/cart-drawer/cart-drawer.component.html` file a disable option on Checkout's button to disable it when cart is empty:
```
<button (click)="close.emit()"
  [routerLink]="['/checkout']"
  [disabled]="isEmpty$ | async"
  class="btn-primary flex w-full">
  Checkout
</button>
```

9. Added in `src/app/checkout/components/checkout-shipping/checkout-shipping.component.html` the customer's address in shipping address form when checkout process:
```
<vsf-address-form #addressForm
    (focusout)="onAddressFormBlur(addressForm.addressForm)"
    [address]="customerAddress$ | async"
    [availableCountries]="availableCountries$ | async">
</vsf-address-form>
```
- in his .ts component file i added:
```
customerAddress$: Observable<AddressFragment>;
...
this.customerAddress$ = this.customerAddresses$.pipe(
    map(addresses => addresses[0]), // Extract the first element from the array
    first()
);
```

10. Trying to build a dropdown menu on username:
- we'll use next files from `/srv/http/formation/vendure/vendureCodeOnGithub/packages/admin-ui/`:
```
packages/admin-ui/src/lib/core/src/components/app-shell/app-shell.component.ts
packages/admin-ui/src/lib/core/src/components/app-shell/app-shell.component.html
packages/admin-ui/src/lib/core/src/shared/components/dropdown/dropdown.component.ts
packages/admin-ui/src/lib/core/src/shared/components/dropdown/dropdown.component.html
packages/admin-ui/src/lib/core/src/shared/components/dropdown/dropdown-menu.component.ts
packages/admin-ui/src/lib/core/src/shared/components/dropdown/dropdown-menu.component.scss
packages/admin-ui/src/lib/core/src/shared/components/dropdown/dropdown-trigger.directive.ts
packages/admin-ui/src/lib/core/src/components/user-menu/user-menu.component.ts
packages/admin-ui/src/lib/core/src/components/user-menu/user-menu.component.html
packages/admin-ui/src/lib/core/src/components/user-menu/user-menu.component.scss
```
- on storefront angular project we have yet next related files:
```
src/app/shared/shared.module.ts
src/app/shared/components/dropdown/dropdown.component.ts
src/app/shared/components/dropdown/dropdown.component.html
src/app/shared/components/dropdown/dropdown.component.scss
src/app/shared/components/dropdown/dropdown-trigger.directive.ts
```

- we create next files and copy in them their relative file from `/srv/http/formation/vendure/vendureCodeOnGithub/packages/admin-ui/`:
```
src/app/shared/components/dropdown/dropdown-admin.component.ts -> changed selector to: selector: 'vsf-dropdown-admin',
src/app/shared/components/dropdown/dropdown-admin.component.html
src/app/shared/components/dropdown/dropdown-menu.component.ts -> changed and deleted a few elements on it
src/app/shared/components/dropdown/dropdown-menu.component.scss
src/app/account/components/user-menu/user-menu.component.ts -> changed selector to: selector: 'vsf-user-menu',
src/app/account/components/user-menu/user-menu.component.html
src/app/account/components/user-menu/user-menu.component.scss
```

- registe above 3 new components on `src/app/shared/shared.module.ts`

- copy in next ones from same dir:
```
src/app/shared/components/dropdown/dropdown-trigger.directive.ts
```

- finally, add on `src/app/app.component.html` next code block from `packages/admin-ui/src/lib/core/src/components/app-shell/app-shell.component.html`:
```
<div>
    <vsf-user-menu
        [userName]="userName$ | async"
        [uiLanguageAndLocale]="uiLanguageAndLocale$ | async"
        [availableLanguages]="availableLanguages"
        (selectUiLanguage)="selectUiLanguage()"
        (logOut)="logOut()"
    ></vsf-user-menu>
</div>
```

- in `src/app/shared/components/dropdown/dropdown.component.ts` replace next line:
```
onTriggerMouseEnter() {
    // replace this: if (this.openOnHover && this.closeFn == null) { by next one:
    if (this.openOnHover && this.closeFn === null) {
        this.open();
    }
}
```

src/app/shared/components/dropdown/dropdown-admin.component.ts src/app/shared/components/dropdown/dropdown-admin.component.html src/app/account/components/user-menu/user-menu.component.ts src/app/account/components/user-menu/user-menu.component.html src/app/account/components/user-menu/user-menu.component.scss

11. Build a dropdown menu on username when logged:
- modified next files:
```
src/app/core/components/account-link/account-link.component.html
src/app/account/components/account/account.component.ts => used signOutService.signOut() in it
src/app/account/components/account/account.component.html
src/app/core/icon-library.ts
src/app/shared/shared.module.ts
```
- created next files:
```
src/app/core/providers/sign-out/sign-out.service.ts
src/app/shared/components/dropdown/user-profile-dropdown.component.ts => used signOutService.signOut() in it
src/app/shared/components/dropdown/user-profile-dropdown.component.html
src/app/shared/components/dropdown/user-profile-dropdown.component.scss
```

12. Set a high z-index on vsf-layout-header to overlap the dropdown menu hover the images.
- we modify `src/app/core/components/layout/layout-header.component.scss` file and added z-index parameter to floating-container class:
```
:host {
    display: block;

    .floating-container {
        position: relative;
        z-index: 5;
    }

```
