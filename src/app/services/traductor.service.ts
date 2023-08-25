import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TraductorService {
  constructor(private translate: TranslateService) {
    // Agregar los idiomas disponibles
    this.translate.addLangs(['es', 'en']);

    // Obtener el idioma del navegador
    const browserLang = this.translate.getBrowserLang();

    // Verificar si browserLang tiene un valor antes de establecerlo como idioma predeterminado
    if (browserLang) {
      this.translate.setDefaultLang(browserLang);
    } else {
      this.translate.setDefaultLang('es'); // Establecer un valor predeterminado si browserLang es undefined
    }
  }

  // Función para cambiar el idioma
  public changeLanguage(lang: string): void {
    this.translate.use(lang);
  }

  // Función para obtener el idioma actual
  public getCurrentLanguage(): string {
    return this.translate.currentLang;
  }

  // Función para obtener un texto traducido
  public translateText(key: string): string {
    let translatedText = '';
    this.translate.get(key).subscribe((text: string) => {
      translatedText = text;
    });
    return translatedText || '';
  }
  
}
