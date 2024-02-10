import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AddressFragment, CountryFragment, ProvinceFragment, OrderAddressFragment, GetAvailableProvincesQuery } from '../../../common/generated-types';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/core/providers/data/data.service';
import { GET_AVAILABLE_PROVINCES } from 'src/app/common/graphql/documents.graphql';
import { switchMap, take, tap } from 'rxjs/operators';

@Component({
    selector: 'vsf-address-form',
    templateUrl: './address-form.component.html',
    // styleUrls: ['./address-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AddressFormComponent implements OnInit, OnChanges {

    @Input() availableCountries: CountryFragment[];
    @Input() address: OrderAddressFragment | AddressFragment;
    @Input() countryId: string;
    @Input() classToNewAdress?: boolean;

    addressForm: UntypedFormGroup;
    availableProvinces$: Observable<GetAvailableProvincesQuery['availableProvinces']>;
    availableProvinces: ProvinceFragment[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dataService: DataService,
        private cdr: ChangeDetectorRef,
    ) {
        this.addressForm = this.formBuilder.group({
            fullName: ['', Validators.required],
            company: '',
            streetLine1: ['', Validators.required],
            streetLine2: '',
            city: ['', Validators.required],
            province: '',
            postalCode: ['', Validators.required],
            countryCode: ['', Validators.required],
            phoneNumber: '',
        });
    }

    async ngOnInit(): Promise<void> {
        await this.onCountryChanged();
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes.countryId && this.countryId) {
            try {
                await this.loadAvailableProvinces();
                this.addressForm.patchValue(this.address, {});

                const country = this.address && this.address.country;
                if (country && this.availableCountries) {
                    if (country && typeof country !== 'string') {
                        this.addressForm.patchValue({
                            countryCode: country.code,
                        });
                    } else {
                        const matchingCountry = this.availableCountries.find(c => c.code === country);
                        if (matchingCountry) {
                            this.addressForm.patchValue({
                                countryCode: matchingCountry.code,
                            });
                        }
                    }
                }
                // Thanks to the following line, the provinces are loaded in the form
                this.cdr.detectChanges();
            } catch (e) {
                console.error(e);
            }
        }
    }

    async onCountryChanged(): Promise<void> {
        this.addressForm.get('countryCode')?.valueChanges
            .pipe(
                tap(() => this.addressForm.get('province')?.setValue('')),
                switchMap((countryCode) => {
                    const filteredCountries = this.availableCountries.filter(country => country.code === countryCode);
                    this.countryId = filteredCountries[0].id;
                    return this.loadAvailableProvinces();
                }),
            )
            .subscribe( () => {
                const province = this.address && this.address.province;

                if (province && this.availableProvinces) {

                    if (province && typeof province !== 'string') {
                        this.addressForm.patchValue({
                            province: province,
                        });
                    } else {
                        const matchingProvince = this.availableProvinces.find(c => c.code === province);
                        if (matchingProvince) {
                            this.addressForm.patchValue({
                                province: matchingProvince.code,
                            });
                        }
                    }
                }
            },
                (e) => {
                    console.error(e);
                }
            );
    }


    async loadAvailableProvinces() {
        const data = await this.dataService.query<GetAvailableProvincesQuery>(
            GET_AVAILABLE_PROVINCES,
            { countryId: this.countryId }
        ).pipe(take(1)).toPromise();

        this.availableProvinces = data.availableProvinces;
    }

    // labelClasses = {
    //     'block': true,
    //     'text-sm': true,
    //     'font-medium': true,
    //     'text-gray-700': !this.classToNewAdress,
    //     'text-gray-200': this.classToNewAdress
    // };
}
