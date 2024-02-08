import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../../providers/language/language.service';

@Component({
    selector: 'vsf-language-switcher',
    templateUrl: './language-switcher.component.html',
    styleUrls: ['./language-switcher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcherComponent {
    selectedLanguage = LanguageService.getSelectedLanguage();
    apiHost: string = environment.apiHost;
    apiPort: number = environment.apiPort;

    constructor(private languageService: LanguageService) {}

    changeLanguage(language: string): void {
        this.languageService.setSelectedLanguage(language);
        this.selectedLanguage = language;
        // reload the page on language change
        window.location.reload();
    }
}
