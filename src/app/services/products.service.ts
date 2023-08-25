import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

	constructor(private http:HttpClient) { }

	/*=============================================
	Tomar data filtrada de la colección productos en Firebase
	=============================================*/

	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${environment.urlFirebase}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}
}
