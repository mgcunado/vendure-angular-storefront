import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { AddressFragment, GetProvinceByCodeQuery, OrderAddressFragment, ProvinceFragment } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';
import { GET_PROVINCE_BY_CODE } from 'src/app/common/graphql/documents.graphql';

@Component({
    selector: 'vsf-address-card',
    templateUrl: './address-card.component.html',
    // styleUrls: ['./address-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressCardComponent implements OnInit {
    @Input() address: OrderAddressFragment | AddressFragment;
    @Input() title = '';

    availableProvinces: ProvinceFragment[] = [];
    provinceName: string;

    constructor(
        private dataService: DataService,
        private cdr: ChangeDetectorRef,
    ) {}

    getCountryName(): string {
        if (!this.address.country) return '';

        return (typeof this.address.country === 'string') ? this.address.country : this.address.country.name;
    }

    async ngOnInit() {
        await this.getProvinceByCode();
        this.cdr.detectChanges();
    }

    async getProvinceByCode() {
        if (!this.address.province ||
            typeof this.address.province !== 'string' ||
            !(this.address.country instanceof Object) ||
            !this.address.country.id
        ) return '';

        const countryId = this.address.country.id;

        return new Promise<void> ((resolve, reject) => {
            this.dataService.query<GetProvinceByCodeQuery>(
                GET_PROVINCE_BY_CODE,
                {
                    countryId,
                    code: this.address.province,
                }
            ).subscribe(
                    (data) => {
                        this.provinceName = data?.provinceByCode?.name;
                        resolve();
                    },
                    (error) => {
                        console.error(error);
                        this.provinceName = '';
                        reject();
                    }
                );
        });
    }
}
