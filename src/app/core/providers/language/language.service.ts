import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    static LANGUAGE_KEY = '';

    setSelectedLanguage(language: string): void {
        localStorage.setItem(LanguageService.LANGUAGE_KEY, language);
    }

    static getSelectedLanguage(): string {
        return localStorage.getItem(LanguageService.LANGUAGE_KEY) || 'es';
    }
}

