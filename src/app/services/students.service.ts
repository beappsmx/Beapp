import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

constructor( private http : HttpClient) { }


getStudents(course: string) {
  try {
    const apiUrl = `${environment.urlFirebase}students.json?orderBy="id_course"&equalTo="${course}"`;
    return this.http.get(apiUrl)

  }catch(error){
  console.error("Error Managment files", error) ;
  return null ;
}

}


post(data: any, token:any){
  try{
   return this.http.post(`${environment.urlFirebase}students.json?auth=${token}`, data);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }

}


deleteStudent(id:string, token: any){
  try {
    return this.http.delete(`${environment.urlFirebase}students/${id}.json?auth=${token}`);
  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}

}
