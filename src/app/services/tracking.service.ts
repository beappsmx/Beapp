import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  private currentProject = new BehaviorSubject<string>(null);

  private emailser     : string = '' ;

  private namecomp     : string = '' ;
  private picturecomp  : string = '' ;
  private fri          : string = '' ;

  private nameuser     : string = '' ;
  private pictureuser : string = '' ;

  private projectser   : string = '' ;
  private branchser    : string = '' ;
  private companyser   : string = '' ;

  private contract         : string = '' ;
  private nameproject      : string = '' ;
  private ubicationproject : string = '' ;

  private startproject : string = '' ;
  private endproject   : string = '' ;

  public ultimaventana : string ;

  setultimaVentana(ultven : string): void {
    this.ultimaventana = ultven ;
  }

  getultimaVentana() {
    return this.ultimaventana;
  }

setnameUser(name: string) : void{
 this.nameuser = name ;
}

setpictureUser(picture : string) : void {
  this.pictureuser = picture
}

getnameUser() {
  return this.nameuser ;
}

getpictureUser(){
  return this.pictureuser ;
}


setContract(contract: string): void {
  this.contract = contract ;
}

 setnameProject(name: string): void {
  this.nameproject= name ;
 }

 setubicationProject(ubication: string): void {
  this.ubicationproject= ubication ;
 }

 setStart(start : string): void {
  this.startproject = start ;
 }

 setEnd(end : string): void {
  this.endproject = end ;
 }


 getContract() {
   return this.contract ;
}

 getnameProject() {
  return this.nameproject ;
 }

 getubicationProject() {
   return this.ubicationproject
 }

 getStart() {
  return this.startproject ;
 }

 getEnd() {
  return this.endproject ;
 }


  setEmail(email: string): void {
    this.emailser = email;
    localStorage.setItem('mail', this.emailser)
  }

  setnameComp(namecomp: string): void {
    this.namecomp = namecomp;
  }

  setpictureComp(picturecomp: string): void {
    this.picturecomp = picturecomp;
  }

  setformatrepint(fri : string): void {
        this.fri = fri ;
  }

  setProject(project: string) : void {
     this.projectser = project ;
     localStorage.setItem('project', this.projectser) ;
  }

  setBranch(branch: string) : void {
     this.branchser = branch ;
     localStorage.setItem('branch',this.branchser ) ;
  }

  setCompany(company : string) : void {
    this.companyser = company ;
    localStorage.setItem("company",this.companyser);
  }

  changeProject(project : string) {
      this.currentProject.next(project) ;
  }

  getProject() {
    return this.projectser ;
  }

  getBranch() {
    return this.branchser ;
  }

  getCompany(){
    return this.companyser ;
  }

  getEmail(): string {
    return this.emailser;
  }

  getnameComp():string {
    return this.namecomp
  }

  getpictureComp():string {
     return this.picturecomp
  }

  getformrepint() : string {
    return this.fri ;
  }

  constructor(private http: HttpClient) { }

  /*=============================================
	Guardar información de la
	=============================================*/

  async addLog(company: string, description: string, origin: string, user: string) {
    // Obtener la fecha actual
    const datetime = new Date();

    if (!user) user = this.getEmail();

    const data = {
      company,
      datetime,
      origin,
      description,
      user,
      idn: 0,
    };

  //  console.log("Tracking", data)

    try {
      const response: any = await this.http.get(`${environment.urlFirebase}tracking.json?orderBy="$key"&limitToLast=1`).toPromise();
      const lastLogId = Object.keys(response)[0]; // Obtener la clave del último registro
      const lastLog = response[lastLogId] as { idn: number }; // Obtener el último registro completo con la propiedad "id"

      // Asignar el valor de "id" del último registro al nuevo registro
      data['idn'] = lastLog ? lastLog.idn + 1 : 1;
      const postResponse = await this.http.post(`${environment.urlFirebase}tracking.json`, data).toPromise();
      // console.log('Log creado exitosamente:', postResponse);
    } catch (error) {
      console.error('Error al crear el log:', error);
    }
  }



	getDataTracking(valoruser :string){

    return this.http.get(`${environment.urlFirebase}tracking.json?orderBy="user"&equalTo="${valoruser}"&orderBy="$idn"&print=pretty&sortOrder="desc"`);

	}


  getTrackingRecordsByUser(user: string) {
    const url = `${environment.urlFirebase}tracking.json?orderBy="user"&equalTo="${user}"`;

    return this.http.get(url).pipe(
      map((response: any) => {
        // Filtrar los registros por el campo "user"
        const filteredRecords = Object.values(response).filter((record: any) => record.user === user);

        // Ordenar los registros por el campo "idn" en forma ascendente
        const sortedRecords = filteredRecords.sort((a: any, b: any) => a.idn - b.idn);

        // Invertir el orden de los registros para que los últimos aparezcan primero
        const reversedRecords = sortedRecords.reverse();

        return reversedRecords;

      })
    );
  }
}
