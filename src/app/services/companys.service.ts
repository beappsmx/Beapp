import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Icompany } from '../interface/icompany';

import { map, tap, catchError, filter } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CompanysService {

  private _idEmpresa : number ;



  constructor( private http: HttpClient ) {
    this._idEmpresa = 0 ;
   }


   /*-------------------------------
 * aqui obtengo el email del login y lo fijo
 ------------------------------*/


/*----------------------------------------------------------------------------------
 * Obtener la consulta por email para ver que empresas le corresponden al LookCombo
 ------------------------------------------------------------------------------------*/

  getEmpresasxEmail(orderBy:string, equalTo:string){
    const apiUrl =`${environment.urlFirebase}companyxusers.json?orderBy="${orderBy}"&equalTo="${equalTo}"`;
  try {
    return this.http.get(apiUrl);
  }catch(error) {
    console.error('ERROR in companyxusers', error);
    return null
  }


  }

    /*=============================================   -NYP2xZxhzclIdICuKf-
    Tomar la data de la colección Empresas en Firebase
    =============================================*/
    getDataCompanys(clave: string){
            try {
              if (clave !== '') {
                return this.http.get(`${environment.urlFirebase}companys.json?orderBy="$key"&equalTo="${clave}"`)
                  .pipe(
                    map(data => {
                      const companyData = data[clave];
                      const {  displayName, email, phone, picture, rfc, state, formatrep } = companyData;
                      return {
                        displayName, email,
                        phone, picture,
                        rfc, state, formatrep
                      };

                    })
                  );

              }else {
                return this.http.get(`${environment.urlFirebase}companys.json`);
              }

            }
            catch(error) {
                console.error('ERROR get list companys ', error);
                return null
            }
      }



      getEmpresa(id: string): Observable<any> {
        try {
        return this.http.get(`${environment.urlFirebase}empresas/${id}.json`);
        }
        catch(error) {
          console.error();
          return error;
        }

      }


      async addpermiscompany(company: string, email: string, id_company: string): Promise<void> {
        const data = {
          company,
          email,
          id_company
        };

        try {

          await this.http.post(`${environment.urlFirebase}permissionsxcompanys.json`, data).toPromise();

        } catch (error) {

          console.error('Error al crear el permiso de la empresa:', error);

          throw error; // Lanzar el error para manejarlo en la función llamadora si es necesario
        }
      }



  getpermissionsxCompany(mail:string): Observable<any>{
    try {
      const apiUrl = `${environment.urlFirebase}permissionsxcompanys.json?orderBy="email"&equalTo="${mail}"`;
      return this.http.get(apiUrl);
    }
    catch(error){
      console.error("Error al Obtener permisos la cia", error)
      throw Error ;
      return null
    }

  }


  getpermissionsxBranch(id_company: string, mail: string): Observable<any> {
    try {
      const apiUrl= `${environment.urlFirebase}permissionsxbranchs.json?orderBy="id_company"&equalTo="${id_company}"`
      return this.http.get(apiUrl)
        .pipe(
          map((permissions: any) => {
            return Object.values(permissions).filter((permission: any) => {
              return permission.id_company === id_company && permission.email === mail;
            });
          })
        );
    } catch (error) {
      console.error("Error al obtener permisos de las sucursales", error);
      throw Error ;
      return null;
    }
  }

  getpermissionsxProject(branch:string, mail:string): Observable<any>{
    try {
      const apiUrl = `${environment.urlFirebase}permissionsxprojects.json?orderBy="id_branchs"&equalTo="${branch}"`
      return this.http.get(apiUrl).pipe(
        map((permissions : any) => {
          return Object.values(permissions).filter((permission: any) => {
            return permission.mail === mail
          }) ;
        })
      );
    }catch(error) {
      console.error("Error al Obtener permisos del Projecto", error)
      throw Error ;
      return null
    }
  }

  getpermissionsxProject2(branch:string): Observable<any>{
    try {
      const apiUrl = `${environment.urlFirebase}permissionsxprojects.json?orderBy="id_branchs"&equalTo="${branch}"`
      return this.http.get(apiUrl);
    }catch(error) {
      console.error("Error al Obtener permisos del Projecto", error)
      throw Error ;
      return null
    }

  }


  postData(data: Icompany, token:any){
    try {
      return this.http.post(`${environment.urlFirebase}companys.json?auth=${token}`, data);

    }catch(error) {
    //  alerts.basicAlert("error", `Error save Users${error}`, "error")
      console.error("Error al grabar Compania", error)
      return null ;
    }

  }

}
