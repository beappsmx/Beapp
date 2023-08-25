import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Iusers } from '../interface/iusers';
import { alerts } from '../helpers/alerts';

import  axios  from 'axios';

import { tap, filter, map, concat, catchError, forkJoin, Observable,  throwError } from 'rxjs';

import { getDatabase, startAt, endAt, ref, child, query, orderByChild, equalTo, get,
    DataSnapshot, limitToFirst, onValue, onChildAdded } from 'firebase/database';


import 'firebase/compat/database';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

constructor(private http:HttpClient ) { }

  public async getEvents() {
    try {
      const response = await axios.get(`${environment.urlFirebase}events.json`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getEventAttendees(eventId: string) {
    try {
      const response = await axios.get(`${environment.urlFirebase}eventAttendees/${eventId}.json`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getEventData(eventId: string) {
    try {
      const response = await axios.get(`${environment.urlFirebase}events/${eventId}.json`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getUserData(userId: string) {
    try {
      const response = await axios.get(`${environment.urlFirebase}users/${userId}.json`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }


  public async getUserEventData() {
    const events = await this.getEvents();

    const result = await Promise.all(Object.keys(events).map(async (eventId) => {
      const eventAttendees = await this.getEventAttendees(eventId);
      if (eventAttendees !== null) {
        const attendees = await Promise.all(Object.keys(eventAttendees).map(async (attendeeId) => {
          const userData = await this.getUserData(attendeeId);
          const eventData = await this.getEventData(eventId);
          if (eventData && userData) {
            return {
              name: eventData.name,
              organization: userData.organization,
              displayName: userData.displayName,
            };
          } else {
            return null;
          }
        }));
        return attendees;
      } else {
        return null;
      }
    }));

    const flattenedResult = result.flat().filter(Boolean);
    console.log('Join Final', flattenedResult);
    return flattenedResult;
  }



 /* public async getUserEventData(eventName: string) {
     const events = await this.getEvents(eventName);
     console.log('Las eventos',events);

     const result = [];
     let event: string;

      for (const eventId in events) {
             const even = eventId;

         const eventAttendees = await this.getEventAttendees(even);
          if (eventAttendees !== null) {
             console.log('eventsAttendees Perra', eventAttendees)
             event = even;

             for (const asisId in eventAttendees ) {
               const asis = asisId ;

                    const userData = await this.getUserData(asis);
                    const eventData = await this.getEventData(event);
                      if (eventData) {
                              const userEventData = {
                                name: eventData.name,
                                organization: userData.organization,
                                displayName: userData.displayName,
                              };
                              result.push(userEventData);
                              console.log('Join Final', result);
                              eventAttendees.next ;
                      }
          }
        }
         events.next ;
      }
        console.log('Join Final', result);
        return result;
  }
*/


	postData(data: Iusers, token:any){
    try {
      return this.http.post(`${environment.urlFirebase}users.json?auth=${token}`, data);
    }catch(error) {
      alerts.basicAlert("error", `Error save Users${error}`, "error")
      return null ;
    }

	}

  /*=============================================
	Tomar la data de la colección usuarios en Firebase
	=============================================*/


	getDataUsers(){
    try {
      return this.http.get(`${environment.urlFirebase}users.json`);
    }
    catch (error) {
      alerts.basicAlert("error", `Error get data call Users${error}`, "error")
      return null ;
    }

	}


  getCompaniesByPermission(email: string): Observable<any> {
    const url = `${environment.urlFirebase}permissions.json?orderBy="email"&equalTo="${email}"&print=pretty`;

    return this.http.get(url).pipe(
      map(data => {
        const permissions = Object.values(data);
        if (permissions.length === 0) {
          throw new Error('No se encontraron permisos para el correo electrónico proporcionado.');
        }
        const companies = permissions.map(permission => permission.id_company);
        return [...new Set(companies)];
      }),
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );
  }


  checkIfDataExists(email: string): Observable<boolean> {
    const url = `${environment.urlFirebase}users.json?orderBy="emailu"&equalTo="${email}"`;

    return this.http.get<any>(url).pipe(
      map(response => {
        // Verificar si hay datos en la respuesta
        const dataExists = Object.keys(response).length > 0;
        return dataExists;
      }),
      catchError(error => {
          return throwError('Error en la solicitud');
      })
    );
  }


  patchData(id:string, data:object, token:any){
		return this.http.patch(`${environment.urlFirebase}users/${id}.json?auth=${token}`, data);
	}


  getItem(id: string) {

		return this.http.get(`${environment.urlFirebase}users/${id}.json`);

	}


  getFilterDataperm(orderBy:string, equalTo:string){

    const url =`${environment.urlFirebase}permissions.json?orderBy="${orderBy}"&equalTo="${equalTo}"`;

		return this.http.get(`${environment.urlFirebase}permissionsxcompanys.json?orderBy="${orderBy}"&equalTo="${equalTo}"`);

	}

  deleteUsers(id:string, token: any){

		return this.http.delete(`${environment.urlFirebase}users/${id}.json?auth=${token}`);
	}

  getCompaniesPermission(userEmail: string): Observable<any> {

    const permissionsUrl = `${environment.urlFirebase}permissionsxcompanys.json`;
    const companyUrl = `${environment.urlFirebase}companys.json`;

     const permissions$ = this.http.get(permissionsUrl);
     const company$ = this.http.get(companyUrl);

     return forkJoin([permissions$, company$]);

     return concat(permissions$, company$)

  }


  findEmail(email: string): Observable<any> {
    return this.http.get<any>(`${environment.urlFirebase}users.json?orderBy="emailu"&equalTo="${email}"`).pipe(
      map(datauser => {
        const user = Object.values(datauser)[0] as any;
        if (user) {
          const displayName = user.displayName;
          const picture = user.picture;
          return { displayName, picture };
        }
        else {
          return { displayName: '', picture: '' };
        }
      })
    );
  }




}
