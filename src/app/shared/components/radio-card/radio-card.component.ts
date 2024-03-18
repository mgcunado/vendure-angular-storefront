import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { RadioCardFieldsetComponent } from './radio-card-fieldset.component';

@Component({
    selector: 'vsf-radio-card',
    templateUrl: './radio-card.component.html',
    styleUrls: ['./radio-card.component.scss'],
    exportAs: 'KbRadioCard',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioCardComponent<T = any> implements OnInit, OnDestroy {
    @Input() item: T;
    @ContentChild(TemplateRef) itemTemplate: TemplateRef<T>;

    @Output() shippingMethodSelected = new EventEmitter<string>();

    constructor(private fieldset: RadioCardFieldsetComponent, private changeDetector: ChangeDetectorRef) {}

    private idChange$ = new Subject<T>();
    private subscription: Subscription;
    selectedShippingMethod: string | null | undefined;
    counter = 0;

    ngOnInit() {
        this.subscription = this.fieldset.selectedIdChange$.subscribe(() =>
            this.changeDetector.markForCheck(),
        );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    isSelected(item: T): boolean {
        if (localStorage.getItem('selectedShippingMethod') && this.counter < 6) {
            this.counter++;

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.selectedShippingMethod = localStorage.getItem('selectedShippingMethod')!;
            this.shippingMethodSelected.emit(this.selectedShippingMethod);

            // localStorage.removeItem('selectedShippingMethod');
            return this.getItemId(item) === this.selectedShippingMethod ? true : this.fieldset.isSelected(item);
        }
        return this.fieldset.isSelected(item);
    }

    isFocussed(item: T): boolean {
        if (localStorage.getItem('selectedShippingMethod') && this.counter < 3) {
            this.selectedShippingMethod = localStorage.getItem('selectedShippingMethod');
            // localStorage.removeItem('selectedShippingMethod');
            return this.getItemId(item) === this.selectedShippingMethod ? true : this.fieldset.isFocussed(item);
        }

        return this.fieldset.isFocussed(item);
    }

    selectChanged(item: T) {
        this.fieldset.selectChanged(item);
    }

    setFocussedId(item: T | undefined) {
        this.fieldset.setFocussedId(item);
    }

    getItemId(item: T): string {
        return this.fieldset.idFn(item);
    }
}
