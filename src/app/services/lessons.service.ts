import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ilessons } from '../interface/ilessons';


@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  indice : number = 0

constructor(private http: HttpClient) { }


//elegir los campos a mostrar

getDataLessonsAll(project: string) {
  try {
    if (project !== '') {
      return this.http.get(`${environment.urlFirebase}lessons.json?orderBy="id_project"&equalTo="${project}"`)
        .pipe(
          map(data => {
            const lessonsDataArray = Object.keys(data);
            const filteredData = lessonsDataArray.map((lessonKey: string, index: number) => {
              const { typemeeting, place, datep, timep } = data[lessonKey];

              return [
                lessonKey, // Clave de registro
                typemeeting,
                place,
                datep,
                timep
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
    console.error('ERROR get list Lessons', error);
    return null;
  }
}


getDataLessonsOne(id: string) {
  try {
    if (id !== '') {
      return this.http.get<any>(`${environment.urlFirebase}lessons/${id}.json`)
        .pipe(
          map(data => {
            const {  typemeeting, place, datep, timep } = data;
            return [
             typemeeting,
              place,
              datep,
              timep
            ];
          }),
          catchError(error => {
            console.error('ERROR getting lesson by ID', error);
            return of([]);
          })
        );
    } else {
      alert('Lesson ID is empty');
      return of([]); // Devuelve un observable de un arreglo vacío
    }
  } catch (error) {
    console.error('ERROR getting lesson by ID', error);
    return of([]); // Devuelve un observable de un arreglo vacío
  }
}




findDetails(id:string){

  try {
    return this.http.get(`${environment.urlFirebase}details_lessons/${id}.json?`);
  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}


getDataMeeting(project: string): Observable<any> {

  try {
    const apiUrl = `${environment.urlFirebase}lessons.json?orderBy="id_project"&equalTo="${project}"&orderBy="orden"`;
    return this.http.get(apiUrl)
  }
  catch (error){
    alert("Error al procesar" + error) ;
    return null
  }

}


postData(data: Ilessons, token:any){
  try {
    return this.http.post(`${environment.urlFirebase}lessons.json?auth=${token}`, data).pipe(
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


postLessonsDetail(data: any, token:any, fieldName: string){
  try{
    const payload = {
      [fieldName]: data
    };

   return this.http.post(`${environment.urlFirebase}details_lessons.json?auth=${token}`, payload);
  }catch(error) {
   console.error("Error al guardar ", error ) ;
   return null ;
  }

}


deleteLessons(id:string, token: any){
  try {
    return this.http.delete(`${environment.urlFirebase}lessons/${id}.json?auth=${token}`);
  }catch(error){
    console.error("Error al borrar", error) ;
    return null ;
 }

}


getDatadetailsLessons(id: string): Observable<any> {

  try {
    const apiUrl = `${environment.urlFirebase}details_lessons/${id}.json`;
    return this.http.get(apiUrl)
  }
  catch (error){
    alert("Error al procesar" + error) ;
    return null
  }

}






}
