import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AddressFragment, CountryFragment, ProvinceFragment, OrderAddressFragment, GetAvailableProvincesQuery } from '../../../common/generated-types';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/core/providers/data/data.service';
import { GET_AVAILABLE_PROVINCES } from 'src/app/common/graphql/documents.graphql';
import { switchMap, tap } from 'rxjs/operators';

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

    addressForm: UntypedFormGroup;
    availableProvinces$: Observable<GetAvailableProvincesQuery['availableProvinces']>;
    availableProvinces: ProvinceFragment[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dataService: DataService,
    ) {
        this.addressForm = this.formBuilder.group({
            fullName: '',
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

    ngOnInit(): void {
        this.onCountryChanged();
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes.countryId && this.countryId) {
            this.dataService.query<GetAvailableProvincesQuery>(
                GET_AVAILABLE_PROVINCES,
                {
                    countryId: this.countryId,
                }
            ).subscribe((data) => {
                    this.availableProvinces = data.availableProvinces;
                });

            await new Promise(resolve => setTimeout(resolve, 200));

            this.addressForm.patchValue(this.address, { });
            await new Promise(resolve => setTimeout(resolve, 200));

            // set country
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

        }

    }

    onCountryChanged(): void {
        this.addressForm.get('countryCode')?.valueChanges
            .pipe(
                tap( () => this.addressForm.get('province')?.setValue('') ),
                switchMap( (countryCode) => {
                    const filteredCountries = this.availableCountries.filter(country => country.code === countryCode);

                    const newCountryId = filteredCountries[0].id;

                    return this.dataService.query<GetAvailableProvincesQuery>( GET_AVAILABLE_PROVINCES, { countryId: newCountryId });
                } ),
            )
            .subscribe( data => {
                this.availableProvinces = data.availableProvinces;

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
            });

    }
}
