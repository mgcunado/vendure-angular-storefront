// import { Pipe, PipeTransform } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
//
// @Pipe({
//     name: 'translateSentence'
// })
// export class TranslateSentencePipe implements PipeTransform {
//
//     constructor(private translateService: TranslateService) { }
//
//     transform(words: string[]): string {
//         const sentence = words.join(' ');
//         return this.translateService.instant(sentence);
//     }
// }

import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translateSentence'
})
export class TranslateSentencePipe implements PipeTransform {

  constructor(private translateService: TranslateService) {}

  transform(words: string[]): string {
    const translatedWords = words.map(word => this.translateService.instant(word));
    return translatedWords.join(' ');
  }
}
