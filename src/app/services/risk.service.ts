import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Irisk, Irinteres, Iactions, Iresources } from '../interface/irisk';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RiskService {

  constructor(public http : HttpClient) { }

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
      console.log('Error al Consultar tabla de Interesados', error);
      return null;
    }
  }

  getDataRisk(valor:string): Observable<any> {

    try {
      const apiUrl = `${environment.urlFirebase}risk.json?orderBy="id_project"&equalTo="${valor}"` ;
      return this.http.get(apiUrl);
    }catch(error){
      console.log(`Error en la consulta`, error )
      return null
    }

  }

  getDataAction(valor:string): Observable<any> {

    try {
      const apiUrl = `${environment.urlFirebase}actions.json?orderBy="id_risk"&equalTo="${valor}"` ;
      return this.http.get(apiUrl);
    }catch(error){
      console.log(`Error en la consulta`, error )
      return null
    }

  }

  getDataTracking(valor:string): Observable<any> {

    try {
      const apiUrl = `${environment.urlFirebase}trackingrisk.json?orderBy="id_action"&equalTo="${valor}"` ;
      return this.http.get(apiUrl);
    }catch(error){
      console.log(`Error en la consulta`, error )
      return null
    }

  }

  getRinterested(valor) {
    const apiUrl = `${environment.urlFirebase}rinteres.json?orderBy="id_risk"&equalTo="${valor}"`;
    try {
      return this.http.get<any>(apiUrl).toPromise()
        .then(data => {
          return Object.keys(data).map(key => {
            return { key: key, name: data[key].name, email: data[key].email, id_risk: data[key].id_risk };
          });
        });
    } catch (error) {
      console.log('Error al Consultar tabla de rInteres', error);
      return null;
    }
  }

  getRisk(id: string) {

    return this.http.get(`${environment.urlFirebase}risk/${id}.json`);

  }

  getAction(id: string) {

    return this.http.get(`${environment.urlFirebase}actions/${id}.json`);

  }

  getTracking(id: string) {

    return this.http.get(`${environment.urlFirebase}trackingrisk/${id}.json`);

  }

  postRisk(data: Irisk, token:any){
    try {
      return this.http.post(`${environment.urlFirebase}risk.json?auth=${token}`, data).pipe(
        map((response: any) => {
          console.log(response.id);
          return {
            key: response.name, // Suponiendo que el servidor devuelve la clave con la propiedad 'name'
            ...data // Devolver también los datos enviados en la solicitud
          };
        })
      );
    } catch (error) {
      console.log('Error al guardar', error);
      return null;
    }

  }

  postAction(data: Iactions, token:any){
    try {
      return this.http.post(`${environment.urlFirebase}actions.json?auth=${token}`, data).pipe(
        map((response: any) => {
          return {
            key: response.name, // Suponiendo que el servidor devuelve la clave con la propiedad 'name'
            ...data // Devolver también los datos enviados en la solicitud
          };
        })
      );
    } catch (error) {
      console.log('Error al guardar', error);
      return null;
    }

  }

  postSelInterested(data: any, token:any){
    try {
      return this.http.post(`${environment.urlFirebase}rinteres.json?auth=${token}`, data);
    } catch (error) {
      console.log('Error al guardar', error);
      return null;
    }

  }

  postResources(data: any, token:any){
    try {
      return this.http.post(`${environment.urlFirebase}actionsres.json?auth=${token}`, data);
    } catch (error) {
      console.log('Error al guardar', error);
      return null;
    }

  }

  postTracking(data: any, token:any){
    try {
      return this.http.post(`${environment.urlFirebase}trackingrisk.json?auth=${token}`, data);
    } catch (error) {
      console.log('Error al guardar', error);
      return null;
    }

  }

  patchDataRisk(id: string, data: object, token: any) {
    return this.http.patch(`${environment.urlFirebase}risk/${id}.json?auth=${token}`, data);
  }

  patchDataAction(id: string, data: object, token: any) {
    return this.http.patch(`${environment.urlFirebase}actions/${id}.json?auth=${token}`, data);
  }

  deleteTracking(id:string, token: any){
    try {
      console.log("borrar", id) ;
      return this.http.delete(`${environment.urlFirebase}trackingrisk/${id}.json?auth=${token}`);
    }catch(error){
      console.log("Error al borrar", error) ;
      return null ;
    }

	}

  deleteRisk(id:string, token: any){
    try {
      return this.http.delete(`${environment.urlFirebase}risk/${id}.json?auth=${token}`);
    }catch(error){
      console.error("Error al borrar", error) ;
      return null ;
    }
  }

  deleteAction(id:string, token: any){
    try {
      return this.http.delete(`${environment.urlFirebase}actions/${id}.json?auth=${token}`);
    }catch(error){
      console.error("Error al borrar", error) ;
      return null ;
    }
  }

  deleteRinteres(id:string, token: any){
    try {
      return this.http.delete(`${environment.urlFirebase}rinteres/${id}.json?auth=${token}`);
    }catch(error){
      console.error("Error al borrar", error) ;
      return null ;
    }
  }

  async deleteRinteresByRiskId(idRisk: string, token: any): Promise<void> {
    try {
      const apiUrl = `${environment.urlFirebase}rinteres.json?orderBy="id_risk"&equalTo="${idRisk}"&auth=${token}`;

      const dataInteres = await this.http.get<any>(apiUrl).toPromise();

      const deleteRequests: Promise<any>[] = [];

      for (const key of Object.keys(dataInteres)) {
        const deleteUrl = `${environment.urlFirebase}rinteres/${key}.json?auth=${token}`;
        const deleteRequest = this.http.delete(deleteUrl).toPromise();
        deleteRequests.push(deleteRequest);
      }

      await Promise.all(deleteRequests);

    } catch (error) {
      console.error("Error al borrar registros relacionados al id_risk", error);
      throw error;
    }
  }

}
