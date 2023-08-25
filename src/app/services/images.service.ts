import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

	constructor(private http: HttpClient) { }

	/*=============================================
	Función para subir imagen al servidor
	=============================================*/

	uploadImage(file:any, path:string, folder:string, width:number, height:number, name:any){

		var formData = new FormData();
		formData.append("file", file.target.files[0])
		formData.append("path", path)
		formData.append("folder", folder)
		formData.append("width", width.toString())
		formData.append("height", height.toString())

		if(name != null){

			formData.append("name", name)
		}

		return this.http.post(environment.adminFiles, formData);

	}

	/*=============================================
	Función para eliminar imagenes del servidor
	=============================================*/

	deleteImage(image:string){

		const formData = new FormData();
		formData.append("fileDelete", image);

		return this.http.post(environment.deleteFiles, formData);

	}


}
