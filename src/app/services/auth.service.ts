import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TrackingService } from './tracking.service';

import { Auth } from '@angular/fire/auth';
import { User } from '@angular/fire/auth';

import { first } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firebaseAuthUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';

  constructor( private trackingService: TrackingService,  private router: Router, public authFire: AngularFireAuth, private http: HttpClient ) { }



  async login(email : string, password: string) {
      try {
         const result = await this.authFire.signInWithEmailAndPassword(
           email,password);
         return result ;
      }
      catch(error) {
        console.log(error)
        return null ;
      }
  }

  async register(email, password: string) {
       try {
        const result = await this.authFire.createUserWithEmailAndPassword(
          email,password);

            // Enviar verificación de correo electrónico
            await result.user.sendEmailVerification();

            // Verificar si el correo electrónico está verificado
            if (result.user.emailVerified) {
              // Guardar el email en la base de datos
              console.log('El correo electrónico HA sido verificado.');
            } else {
              console.log('El correo electrónico aún no ha sido verificado.');
            }

       }
       catch(error){console.log(error)}
  }

    /*=============================================
	   Función de salida del sistema
	   =============================================*/
        async logout() {
          try{

              this.trackingService.addLog('', 'Salio del Sistema - Cierre de sesion', 'Menu Side Bar', '')
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');

              localStorage.removeItem('project');
              localStorage.removeItem('company');
              localStorage.removeItem('branch');
              localStorage.removeItem('mail') ;

              this.router.navigateByUrl("/login");

              await this.authFire.signOut();

          }
          catch(error){console.log(error)}

        }

  getCurrentUser(){
    return this.authFire.authState.pipe(first()).toPromise();
  }

  async removeUserByEmail(email: string) {
    try {

      const queryParams = `?email=${encodeURIComponent(email)}`;
      const response = await this.http.post(`${this.firebaseAuthUrl}:delete${queryParams}`, {}).toPromise();

      console.log('Usuario eliminado exitosamente.');
    } catch (error) {
      console.log('Error al eliminar el usuario:', error);
    }
  }

  private async getIdToken(): Promise<string> {
    const user = await this.authFire.currentUser;
    const idToken = await user.getIdToken();

    return idToken;
  }
}
