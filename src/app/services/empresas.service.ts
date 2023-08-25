import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  private _idEmpresa : number ;
  public email : string = '' ;


  constructor( private http: HttpClient ) {
    this._idEmpresa = 0 ;
   }

/*-------------------------------
 * aqui obtengo el email del login y lo fijo
 ------------------------------*/

 getEmail(): string {
  return this.email;
}

setEmail(email: string): void {
  this.email = email;
}


/*----------------------------------------------------------------------------------
 * Obtener la consulta por email para ver que empresas le corresponden al LookCombo
 ------------------------------------------------------------------------------------*/

getEmpresasxEmail(orderBy:string, equalTo:string){

 // return this.http.get(`${environment.urlFirebase}companyxusers.json?orderBy="email"&equalTo="jsoriano@hco-consultores.com"&print=pretty`);
 // return this.http.get(`${environment.urlFirebase}sub-categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

  return this.http.get(`${environment.urlFirebase}companyxusers.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

}


   /*=============================================
	Tomar la data de la colección Empresas en Firebase
	=============================================*/
    getData(){

        return this.http.get(`${environment.urlFirebase}empresas.json`);

    }

    getEmpresa(id: string): Observable<any> {

       return this.http.get(`${environment.urlFirebase}empresas/${id}.json`);

    }



  }

