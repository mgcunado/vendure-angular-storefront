import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from '../core/providers/language/language.service';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    exports: [TranslateModule]
})
export class AppTranslateModule {
    constructor(
        private translate: TranslateService,
    ) {
        // get selected language from localStorage
        this.translate.setDefaultLang(localStorage.getItem(LanguageService.LANGUAGE_KEY) || 'es');
    }
}

