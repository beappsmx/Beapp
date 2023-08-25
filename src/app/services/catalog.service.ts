import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { alerts } from 'src/app/helpers/alerts';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor( public http:HttpClient) { }




	getdataOrganization(){

    try {
      return this.http.get(`${environment.urlFirebase}organizations.json?`);
    }catch (error) {
       alerts.basicAlert('error', "Error query organizations in catalog service", "error" );
       return null;
    }

	}

  getdataStates(){
    try {
      return this.http.get(`${environment.urlFirebase}states.json?`);
    }catch(error)
    {
      alerts.basicAlert('error', "Error query states in catalog service", "error");
      return null;
    }

	}

}
