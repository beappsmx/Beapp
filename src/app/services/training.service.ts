import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

constructor( private http : HttpClient) { }


getTraining(project: string) {
  try {
    const apiUrl = `${environment.urlFirebase}courses.json?orderBy="id_project"&equalTo="${project}"`;
    return this.http.get(apiUrl)

  }catch(error){
  console.error("Error Managment files", error) ;
  return null ;
}

}


post(data: any, token:any){
  try{
   return this.http.post(`${environment.urlFirebase}courses.json?auth=${token}`, data);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }

}


deleteCourse(id:string, token: any){
  try {
    return this.http.delete(`${environment.urlFirebase}courses/${id}.json?auth=${token}`);
  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}



}



