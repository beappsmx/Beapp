import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {

constructor(private http : HttpClient) { }


getInstructors(company: string) {
  const apiUrl = `${environment.urlFirebase}instructors.json?orderBy="id_company"&equalTo="${company}"`;
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


getInstructorsAll(company: string) {
  try {
    const apiUrl = `${environment.urlFirebase}instructors.json?orderBy="id_company"&equalTo="${company}"`;
    return this.http.get(apiUrl)

  }catch(error){
  console.error("Error Managment files", error) ;
  return null ;
}

}

deleteInstructors(id:string, token: any){
  try {
    return this.http.delete(`${environment.urlFirebase}instructors/${id}.json?auth=${token}`);
  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}

post(data: any, token:any){
  try{
   return this.http.post(`${environment.urlFirebase}instructors.json?auth=${token}`, data);
  }catch(error) {                                   
   console.error("Error al guardar ", error ) ;
   return null ;
  }

}


}
