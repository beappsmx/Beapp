import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, Validators } from '@angular/forms'

import { Ilogin } from 'src/app/interface/ilogin';
import { LoginService } from 'src/app/services/login.service';
import { CompanysService } from 'src/app/services/companys.service';
import { AuthService } from 'src/app/services/auth.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { UsersService } from 'src/app/services/users.service';

import { functions } from 'src/app/helpers/functions';
import { alerts } from 'src/app/helpers/alerts';
import { Router } from '@angular/router';

import { TraductorService} from 'src/app/services/traductor.service';
import { map } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{


  emailcapt   : string = '';

  displayName : string = '' ;
  picture     : string = '' ;

 /*=============================================
	Creamos grupo de controles
	=============================================*/

	public flogin = this.formBuilder.group({

		emaillogin    : ['', [Validators.required, Validators.email]],
		passwordlogin : ['', Validators.required]

	})

	/*=============================================
	Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

  valorcapturado = '' ;



  constructor( public translateService: TraductorService,  private loginService: LoginService,
    private companysService : CompanysService, private trackingService : TrackingService, private userService: UsersService, private auth: AuthService,
    private formBuilder: FormBuilder, private router: Router) { }


  ngOnInit(): void {

  }

	/*=============================================
	Función Login
	=============================================*/

	login(){

          		/*=============================================
          		Validamos que el formulario haya sido enviado
          		=============================================*/

              this.formSubmitted = true;

             // Atrapo la variable para enviarla al servicio
             this.emailcapt = this.flogin.get('emaillogin').value ;


             this.trackingService.setEmail(this.flogin.get('emaillogin').value);

              if(this.flogin.invalid){

          			return;
          		}

              /*=============================================
          		Capturamos la información del formulario en la interfaz
          		=============================================*/

          		const data: Ilogin = {

          		   	email: this.flogin.get('emaillogin').value,
          			  password: this.flogin.get('passwordlogin').value ,
          			  returnSecureToken: true

          		}


          		/*=============================================
          		Ejecutamos el servicio del Login
          		=============================================*/

               this.trackingService.addLog('', "Inicio del Sistema ", "Origen del Formulario Login", this.emailcapt)


          		this.loginService.login(data).subscribe(

          			(resp)=>{

                  this.userService.findEmail(this.emailcapt).subscribe(
                    (datauser: any) => {
                      if (datauser) {
                        const displayName = datauser.displayName;
                        const picture     = datauser.picture;
                        
                        this.trackingService.setnameUser(displayName);
                        this.trackingService.setpictureUser(picture);
                        
                      }
                    },
                    (error) => {
                      console.error('Error al obtener los datos del usuario:', error);
                      // Manejo del error
                    }
                  );



                  /*const user = await this.auth.login(this.emailcapt, this.f.controls.passwordlogin.value)
                  if (user.user.emailVerified) {
                       //aqui lo mandamos al home o en caso contratio a la verificacion del email
                  }*/


                  this.router.navigateByUrl("/");

          			},

          			(err)=>{

          				/*=============================================
          				Errores al intentar entrar al sistema
          				=============================================*/

          				if(err.error.error.message == "EMAIL_NOT_FOUND"){

          					alerts.basicAlert("Error", 'Invalid email', "error")

          				}else if(err.error.error.message == "INVALID_PASSWORD"){

          					alerts.basicAlert("Error", 'Invalid password', "error")

          				}else{

          					alerts.basicAlert("Error", "An error occurred", "error")
          				}

          			}

          		);

  }


  	/*=============================================
	Validamos formulario
	=============================================*/

	invalidField(field:string){

		return functions.invalidField(field, this.flogin, this.formSubmitted);

	}

}
