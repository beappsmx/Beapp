import { Component, OnInit } from '@angular/core';
import { Observable, filter, forkJoin, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { AngularFirestore } from '@angular/fire/compat/firestore';


import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'app-companys',
  templateUrl: './companys.component.html',
  styleUrls: ['./companys.component.css']
})
export class CompanysComponent implements OnInit{
     data$ = of (1,2,48,5);
     numbers = of (28,44,59,5, 3, 21, 2,4,98) ;

     combinedData: any[] = [];

     to: string;
     subject: string;
     html: string;



     constructor(private http:HttpClient, private messagesService : MessagesService, private db: AngularFirestore ) { }


     ngOnInit(): void {

          /*    this.exampletap()
              this.examplemap();
              this.examplemapwithfillter() ;

              this.getCompaniesPermission().subscribe(response => {
                const [permissions, companies] = response;
                this.combinedData = this.combineData(permissions, companies);
                console.log("JOIN", this.combinedData)
              }, error => {
                console.error(error);
              }); */

         //     this.sendEmails() ;

    //   this.messagesService.sendMessage();

    }


    sendEmail() {
      this.db.collection('mail').add({
        to: this.to,
        message:{
          subject: this.subject,
          html: this.html
        },
      })
      .then(() => {
        console.log('Registro agregado correctamente');
        // Restablece los campos del formulario
        this.to = '';
        this.subject = '';
        this.html = '';
      })
      .catch((error) => {
        console.error('Error al agregar el registro:', error);
      });
    }



    public createTemplate(email: string): void {
      const templateData = {
        user_id: 'zlMs5PLsv4XRQhXkc', // Reemplaza con tu clave pública (public key) de EmailJS
        template_name: 'flortemplate', // Nombre de la plantilla que deseas crear
        subject: 'Subject of the template', // Asunto de la plantilla
        html: '<p>HTML content of the template</p>', // Contenido HTML de la plantilla
        email_address: email // Correo electrónico asociado a la plantilla
      };

      this.http.post('https://api.emailjs.com/api/v1.0/templates', templateData)
        .subscribe(
          response => {
            console.log('Template created successfully:', response);
          },
          error => {
            console.error('Error creating template:', error);
          }
        );
    }



  exampletap() {
        this.data$
        .pipe(
         map((number) => number * number),
         tap((result: number) => console.log('tap',result))

        )
        .subscribe();
     }

     examplemap() {

      const numb =  this.data$.pipe(
       map(number => number * 21)

       ) ;
       numb.subscribe(result => console.log('map', result))
      }

      examplemapwithfillter() {

        const numb =  this.numbers.pipe(
         filter(number => number % 2 ===0) ) ;
         numb.subscribe(result => console.log('Filter', result))
        }


        getCompaniesPermission(): Observable<any> {

          const permissionsUrl = `${environment.urlFirebase}permissionsxcompanys.json`;
          const companyUrl = `${environment.urlFirebase}companys.json`;

           const permissions$ = this.http.get(permissionsUrl);
           const company$ = this.http.get(companyUrl);

           return forkJoin([permissions$, company$]);

        }


        combineData(permissions: { [key: string]: any }, companies: { [key: string]: any }): any[] {
          // Filtrar los permisos por el email deseado
          const filteredPermissions = Object.values(permissions).filter((permission: any) => permission.email === 'jsoriano@hco-consultores.com');

          // Combina los datos según tu lógica de negocio
          // Puedes utilizar loops, map, filter u otras funciones de array para combinar los datos

          // Ejemplo de combinación por id_company
          return filteredPermissions.map((permission: any) => {
            const companyId = permission.id_company;
            const company = companies[companyId];

            return {
              permission,
              company
            };
          });
        }


}
