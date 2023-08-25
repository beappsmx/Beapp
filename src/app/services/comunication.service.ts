import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Icomunications } from '../interface/icomunications';

import { map, tap, catchError, filter } from 'rxjs/operators';
import { forkJoin, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicationService {

  constructor( public http: HttpClient) { }

  getDataComunications(){
		return this.http.get(`${environment.urlFirebase}communications.json`);
	}

  deleteCommunications(id:string, token: any){
    try {
      return this.http.delete(`${environment.urlFirebase}communications/${id}.json?auth=${token}`);
    }catch(error){
      console.log("Error al borrar", error) ;
      return null ;
    }

  }

  getItem(id: string) {

    return this.http.get(`${environment.urlFirebase}interested/${id}.json`);

  }

}
