import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ibranch } from '../interface/ibranch';

@Injectable({
  providedIn: 'root'
})
export class BranchsService {

  constructor(private http: HttpClient) { }


    getData(equalTo:string){

      try {

        return this.http.get(`${environment.urlFirebase}branchs.json?orderBy="id_company"&equalTo="${equalTo}"`);

      }catch(error){
        console.log(error);
        return null ;
      }

    }


	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${environment.urlFirebase}branchs.json?orderBy="${orderBy}"&equalTo="${equalTo}
          "&print=pretty`);
	}


  postData(data: Ibranch, token:any){
    try {
      return this.http.post(`${environment.urlFirebase}branchs.json?auth=${token}`, data);

    }catch(error) {
    //  alerts.basicAlert("error", `Error save Users${error}`, "error")
      console.log("Error al grabar Companiaa", error)
      return null ;
    }
  }


  patchData(id:string, data:object, token:any){
		return this.http.patch(`${environment.urlFirebase}branchs/${id}.json?auth=${token}`, data);
	}


  getItem(id: string) {

		return this.http.get(`${environment.urlFirebase}branchs/${id}.json`);

	}



  async addpermisBranch(branchs: string, email: string, id_branchs: string, id_company: string): Promise<void> {
    const databra = {
      branchs,
      email,
      id_branchs,
      id_company
    };

    try {

      await this.http.post(`${environment.urlFirebase}permissionsxbranchs.json`, databra).toPromise();

    } catch (error) {

      console.error('Error for create the permission of the Branch:', error);

      throw error; // Lanzar el error para manejarlo en la función llamadora si es necesario
    }
  }


  deleteBranchs(id:string, token: any){
    try {
     return this.http.delete(`${environment.urlFirebase}branchs/${id}.json?auth=${token}`);
    }catch(error) {
       console.log(error)
       return null ;
    }

   }


  }
