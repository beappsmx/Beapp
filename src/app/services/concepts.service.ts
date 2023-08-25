import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app' ;

import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})

export class ConceptsService {

constructor( private firestore : AngularFirestore, private http: HttpClient) { }




getDataConcepts(project: string): Observable<any> {

  try {
    const apiUrl = `${environment.urlFirebase}concepts.json?orderBy="id_project"&equalTo="${project}"&orderBy="orden"`;
    return this.http.get(apiUrl).pipe(
      map((data: any) => {
        // Ordenar los datos por el campo "orden"
        const sortedData = Object.keys(data)
          .map(key => ({ key, ...data[key] }))
          .sort((a, b) => a.orden - b.orden);
       // console.log("SortedData", sortedData)
        return sortedData;
      })
    );
  }
  catch (error){
    alert("Error al procesar" + error) ;
    return null
  }

}


getDataConceptsxActivities(id_project: string): Observable<any[]> {
  const url = `${environment.urlFirebase}concepts.json`;

  return this.http.get<any[]>(url).pipe(
    map(data => {
      const filteredData = Object.values(data).filter(item =>
        item.id_project === id_project && item.tipoactividad === 'Actividad'
      );
      const selectedFields = filteredData.map(item => {
        return {
          actividad: item.actividad,
          descripcion: item.descripcion,
          tipoactividad: item.tipoactividad
        };
      });
      return selectedFields;
    })
  );
}



getPersonal(id: string): Observable<any> {
  try{
    const endpoint = `${environment.urlFirebase}personalxconcepts.json?orderBy="idconcepto"&equalTo="${id}"`;
    return this.http.get(endpoint);
  }catch(catchError){
    alert(catchError)
    return null
  }

}



}
