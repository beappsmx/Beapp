import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Icommunications } from '../interface/icommunication';
import { Observable, catchError, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommunicationsService {

  constructor( public http : HttpClient) { }



  getDataCommunications(valor:string): Observable<any> {

    try {
      const apiUrl = `${environment.urlFirebase}communications.json?orderBy="id_project"&equalTo="${valor}"&orderBy="procces"` ;
      return this.http.get(apiUrl);
    }catch(error){
      console.error(`Error en la consulta`, error )
      return null
    }

  }

  getDocuments(valor:string): Observable<any> {

    try {
      const apiUrl = `${environment.urlFirebase}documents_communications.json?orderBy="id_communication"&equalTo="${valor}"&orderBy="id"` ;
      return this.http.get(apiUrl);
    }catch(error){
      console.error(`Error en la consulta`, error )
      return null
    }

  }

/* getDataCommunications(valor: string): Observable<any[]> {
  try {
    const apiUrl = `${environment.urlFirebase}communications.json?orderBy="id_project"&equalTo="${valor}"`;
    return this.http.get(apiUrl).pipe(
      map((data: any) => {
        // Obtener los datos como un array de objetos con el ID incluido
        const communications = Object.keys(data).map(key => ({ id: key, ...data[key] }));

        // Ordenar los datos por el campo "procces"
        communications.sort((a, b) => a.procces.localeCompare(b.procces));

        return communications;
      })
    );
  } catch(error) {
    console.error(`Error en la consulta`, error);
    return null;
  }
} */

  getComm(id: string){
    return this.http.get(`${environment.urlFirebase}communications/${id}.json`);
  }

  getDataCommunicationsdetail2(){
    try {
      return this.http.get(`${environment.urlFirebase}detail_communications.json`);
    }catch(error){
      console.error(`Error en la consulta`, error )
      return null
    }
  }

  getDataCommunicationsdetail(){

  const url = `${environment.urlFirebase}detail_communications.json?`;

  return this.http.get<any>(url).pipe(
    map((data: any) => {
      let subdetalles = [];

      // Recorre cada propiedad del objeto data
      Object.keys(data).forEach(key => {
          const subdata = data[key];

           // Verifica si el subdata es un array y lo agrega a la lista de subdetalles
          if (Array.isArray(subdata)) {
            subdetalles = subdetalles.concat(subdata);
        }
      });

      return subdetalles;
    }),
    catchError(error => {
         console.error('Error al obtener los datos:', error);
         throw error;
     })
    )
  }


  deleteCommunications(id:string, token: any){
    try {
      return this.http.delete(`${environment.urlFirebase}communications/${id}.json?auth=${token}`);
    }catch(error){
      console.error("Error al borrar", error) ;
      return null ;
    }

  }


  getInterested(valor) {
    const apiUrl = `${environment.urlFirebase}interested.json?orderBy="id_project"&equalTo="${valor}"`;
    try {
      return this.http.get<any>(apiUrl).toPromise()
      .then(data => {
        return Object.keys(data).map(key => {
          return { key: key, name: data[key].name, email: data[key].email };
        });
      });
    } catch (error) {
      console.error('Error al Consultar tabla de comunicaciones', error);
      return null;
    }
  }

/*   getDocuments(valor) {
    const apiUrl = `${environment.urlFirebase}documents_communications.json?orderBy="id_communication"&equalTo="${valor}"`;
    try {
      return this.http.get<any>(apiUrl).toPromise()
      .then(data => {
        return Object.keys(data).map(key => {
          return {
            key             : key,
            date            : data[key].date,
            description     : data[key].description,
            id_communication: data[key].id_communication,
            picture         : data[key].picture
          };
        });
      });
    } catch (error) {
      console.error('Error al Consultar tabla de comunicaciones', error);
      return null;
    }
  } */



  postCommunic(data: Icommunications, token:any){
    try {
      return this.http.post(`${environment.urlFirebase}communications.json?auth=${token}`, data).pipe(
        map((response: any) => {
          return {
            key: response.name, // Suponiendo que el servidor devuelve la clave con la propiedad 'name'
            ...data // Devolver también los datos enviados en la solicitud
          };
        })
      );
    } catch (error) {
      console.error('Error al guardar', error);
      return null;
    }

  }



  postCommunicDetail(data: any, token:any){
    try{
    return this.http.post(`${environment.urlFirebase}detail_communications.json?auth=${token}`, data);
    }catch(error) {
    console.error("Error al guardar ", error ) ;
    return null ;
    }

  }

  postDocumentCom(data: any, token:any){
    try{
    return this.http.post(`${environment.urlFirebase}documents_communications.json?auth=${token}`, data);
    }catch(error) {
    console.error("Error al guardar ", error ) ;
    return null ;
    }

  }



  buscarSubdetalle(id: string) {
    const url = `${environment.urlFirebase}detail_communications.json?`;

    return this.http.get<any>(url).pipe(
      map((data: any) => {
        let subdetalles = [];

        // Recorre cada propiedad del objeto data
        Object.keys(data).forEach(key => {
          const subdata = data[key];

          // Verifica si el subdata es un array y contiene elementos con el id buscado
          if (Array.isArray(subdata) && subdata.some(item => item.id === id)) {
            const subdetallesEncontrados = subdata.filter(item => item.id === id);
            subdetalles = subdetalles.concat(subdetallesEncontrados);
          }
        });

        return subdetalles;
      }),
      catchError(error => {
        console.error('Error al obtener los datos:', error);
        throw error;
      })
    );
  }


  buscarDatafindDocuments(id: string){
    try {
      const apiUrl = `${environment.urlFirebase}documents_communications.json?orderBy="id_communication"&equalTo="${id}"`;
      return this.http.get(apiUrl);

    }
    catch(error) {
      console.error('Error en la consulta:', error);
      throw error;
    }
  }
  patchDataComm(id: string, data: object, token: any) {
    return this.http.patch(`${environment.urlFirebase}communications/${id}.json?auth=${token}`, data);
  }


}
