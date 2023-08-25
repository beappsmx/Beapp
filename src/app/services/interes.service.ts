import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Iinteres } from '../interface/interested';

import { map, tap, catchError, filter } from 'rxjs/operators';
import { forkJoin, Observable, of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InteresService {

  constructor( public http:HttpClient) { }




  getDataInteres(valor: string): Observable<any> {
    try {
      const apiUrl = `${environment.urlFirebase}interested.json?orderBy="id_project"&equalTo="${valor}"`;
      return this.http.get(apiUrl);
    } catch (error) {
      console.log("Error al obtener los intereses", error);
      throw error;
    }
  }



  checkIfDataExists(email: string, contrato: string): Observable<boolean> {
    const url = `${environment.urlFirebase}interested.json?orderBy="email"&equalTo="${email}"&orderBy="id_project"&equalTo="${contrato}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        // Verificar si hay datos en la respuesta
        const dataExists = Object.keys(response).length > 0;
        return dataExists;
      }),
      catchError(error => {
          return throwError('Error en la solicitud');
      })
    );
  }



	postData(data: Iinteres, token:any){
     try{
      return this.http.post(`${environment.urlFirebase}interested.json?auth=${token}`, data);
     }catch(error) {
      console.log("Error al guardar ", error ) ;
      return null ;
     }

	}



  getFilterDataperm(orderBy:string, equalTo:string){

    return this.http.get(`${environment.urlFirebase}permissionsxcompanys.json?orderBy="${orderBy}"&equalTo="${equalTo}"`);

	}


  deleteInteres(id:string, token: any){
    try {
      return this.http.delete(`${environment.urlFirebase}interested/${id}.json?auth=${token}`);
    }catch(error){
      console.log("Error al borrar", error) ;
      return null ;
   }

	}

  getItem(id: string) {

    return this.http.get(`${environment.urlFirebase}interested/${id}.json`);

  }
  patchData(id: string, data: object, token: any) {
    return this.http.patch(`${environment.urlFirebase}interested/${id}.json?auth=${token}`, data);

  }



  getDatacompInteres(project: string, consecutivo: string) {
    try {
      if (project !== '') {
        return this.http.get(`${environment.urlFirebase}interested.json?orderBy="id_project"&equalTo="${project}"`)
          .pipe(
            map(data => {
              const interesDataArray = Object.values(data);
              const filteredData = interesDataArray.map((interesData: any, consec: number) => {
                const { name, organization, position, phone, email, interes, influence, power, follow } = interesData;
                const updatedConsecutivo = consecutivo  + (consec + 1).toString();

                const sum = parseInt(interes) + parseInt(influence) + parseInt(power);

                return [
                  updatedConsecutivo,
                  name,
                  organization,
                  position,
                  phone,
                  email,
                  interes,
                  influence,
                  power,
                  sum,
                  follow
                ];
              });

              return filteredData;
            })
          );
      } else {
        alert('Project está vacío');
        return null;
      }
    } catch (error) {
      console.error('ERROR get list companies', error);
      return null;
    }
  }









}
