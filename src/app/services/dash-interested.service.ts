import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map } from 'rxjs';
import { IdashInter } from '../interface/idashboard';

@Injectable({
  providedIn: 'root'
})
export class DashInterestedService {

  constructor( public http : HttpClient) { }

  getOrg(): Observable<string[]> {
    return this.http.get(`${environment.urlFirebase}organizations.json`)
      .pipe(
        map((data: any) => {
          const organizationData: string[] = Object.values(data).map((item: any) => item.organization);
          return organizationData;
        })
      );
  }

  getDataInteres(valor: string): Observable<IdashInter[]> {
    try {
      const apiUrl = `${environment.urlFirebase}interested.json?orderBy="id_project"&equalTo="${valor}"`;
      return this.http.get(apiUrl).pipe(
        map((data: any) => {
          // Transformar el objeto data en un array de interesados
          const interesados: IdashInter[] = Object.values(data).map((item: any) => ({
            name: item.name,
            organization: item.organization,
            position: item.position,
            interes: item.interes,
            influence: item.influence,
            power: item.power,
            avg: item.avg
          }));
          return interesados;
        })
      );
    } catch (error) {
      console.log("Error al obtener los intereses", error);
      throw error;
    }
  }
}
