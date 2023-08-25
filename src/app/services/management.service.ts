import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { Imanagement } from '../interface/imanagement';
import { Imanfildet } from '../interface/imanfildet';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

constructor(private http: HttpClient) { }

getDataManagement2(project: string): Observable<any> {
  try {
    const apiUrl = `${environment.urlFirebase}management/${project}.json`;
    return this.http.get(apiUrl).pipe(
      map(response => Array.isArray(response) ? response : []),
      catchError(error => {
        console.error("Error Managment files", error);
        return of([]); // return an Observable of an empty array
      })
    );
  } catch(error) {
    console.error("Error Managment files", error);
    return of([]); // return an Observable of an empty array
  }
}

getDataManagement(project: string): Observable<any> {
  try {
    const apiUrl = `${environment.urlFirebase}management/${project}.json`;
    return this.http.get(apiUrl);
  } catch(error) {
    console.error("Error Managment files", error);
    return of([]); // return an Observable of an empty array
  }
}


getManfildet(id : string){
  try {
    const apiUrl = `${environment.urlFirebase}management_filesdetails.json?orderBy="id_manage"&equalTo="${id}"`;
    return this.http.get(apiUrl)
  }catch(error){
    console.error("Error Managmen details files", error) ;
    return null ;
  }

}

getManfildetxid(id : string){
  try {
    const apiUrl = `${environment.urlFirebase}management_filesdetails/${id}.json`;
    return this.http.get(apiUrl)
  }catch(error){
    console.error("Error Managmen details files", error) ;
    return null ;
  }

}


postDetail(data: any, token:any){
  try{
   return this.http.post(`${environment.urlFirebase}management_filesdetails.json?auth=${token}`, data);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }
}


patchDetail(id:string, data: any, token:any){
  try{
   return this.http.patch(`${environment.urlFirebase}management_filesdetails/${id}.json?auth=${token}`, data);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }
}


findSubdetails( id: string) {

  try {
    const apiUrl = `${environment.urlFirebase}management_filesdetails.json?orderBy="id_manage"&equalTo="${id}"`;
    return this.http.get(apiUrl);

  }
  catch(error) {
    console.error('Error en la consulta:', error);
    throw error;
  }
}


deleteManage(id:string, token: any){
  try {
    return this.http.delete(`${environment.urlFirebase}management/${id}.json?auth=${token}`);
  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}


}
