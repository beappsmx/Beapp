import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Modulos Personalizados

import { PagesModule } from './pages/pages.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


	/*=============================================
	Modulo para Traduccion
	=============================================*/
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';

/*============================
  Modulo para firebase
  ==============================*/
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

//para el storage
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'

// paara la db
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';

import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { environment } from 'src/environments/environment';

export function HttpLoaderFactory (http:HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
/*-----------------------------------------------------------------------------*/



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [

    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),

    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),

    AngularFireAuthModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,

    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    PagesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    provideStorage(() => getStorage()),
    TranslateModule.forRoot ({
      loader: {
         provide    : TranslateLoader,
         useFactory : HttpLoaderFactory,
         deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
