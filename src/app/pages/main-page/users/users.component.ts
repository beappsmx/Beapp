import { Component, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { Iusers } from 'src/app/interface/iusers';
import { Ilog } from 'src/app/interface/ilog';
import { Icompany } from 'src/app/interface/icompany';
import { Ibranch } from 'src/app/interface/ibranch';
import { Iproject } from 'src/app/interface/iproject';

/*Servicios */
import { UsersService } from 'src/app/services/users.service';
import { CompanysService } from 'src/app/services/companys.service';
import { BranchsService } from 'src/app/services/branchs.service';
import { ProjectService } from 'src/app/services/project.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { TraductorService} from 'src/app/services/traductor.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StoragesService } from 'src/app/services/storages.service';

import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';

import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource,  MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import {SelectionModel} from '@angular/cdk/collections';

import { FormBuilder, Validators } from '@angular/forms';

import {animate, state, style, transition, trigger} from '@angular/animations';

import { environment } from 'src/environments/environment';
import { functions } from 'src/app/helpers/functions';

import { alerts } from 'src/app/helpers/alerts';

import { Observable } from 'rxjs';


@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css'],

    animations: [
	    trigger('detailExpand', [
	      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
	      state('expanded', style({height: '*'})),
	      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
	      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
	    ])
  	]

})

 export class UsersComponent implements OnChanges, OnInit {

  userEvents: any[] = [];
  currentIndex : number = 0 ;
  combinedData: any[] = [];

  users$: Observable<any[]>;

  selectedTab = 'users';

onTabSelected(tabName: string) {
  this.selectedTab = tabName;

  if (tabName=== 'users') {
      this.trackingService.addLog(localStorage.getItem('company'), 'Click en la Pestaña Users/Usuarios del menu Usuarios', 'Usuarios', '')}

  if (tabName=== 'companys') {
      this.trackingService.addLog(localStorage.getItem('company'), 'Click en la Pestaña Company/Empresas del menu Usuarios', 'Usuarios', '')
      this.getdataCompanys() }

  if (tabName=== 'branchs') {
      this.trackingService.addLog(localStorage.getItem('company'), 'Click en la Pestaña Branchs/Sucursales del menu Usuarios', 'Usuarios', '')
      this.getdataBranchs() }

  if (tabName=== 'projects') {
      this.trackingService.addLog(localStorage.getItem('company'), 'Click en la Pestaña Projects/Proyectos del menu Usuarios', 'Usuarios', '')
      this.getdataProjects() }

  if (tabName=== 'settings') {
      this.trackingService.addLog(localStorage.getItem('company'), 'Click en la Pestaña Settings/Seguimiento del menu Usuarios', 'Usuarios', '')
      this.getdataTracking() }

    }

     /*=============================================
    	Creamos grupo de controles
    	=============================================*/

    	public myform = this.form.group({

    		email: ['', [Validators.required, Validators.email]],
    		password: ['', Validators.required]
    	})


	/*=============================================
	Variable para nombrar las columnas de nuestra tabla en Angular Material
	=============================================*/
	 displayedColUsers: string[] = [  'numberposition',
				'email',  'actions'];

   displayedColCompany: string[] = [  'numberposition',
					'displayName', 'rfc',
 					'address', 'actions'
        ];

    displayedColBranchs: string[] = [  'position',
        'name', 'street', 'locality' ,'actions' ];

    displayedColProject: string[] = [  'position',
        'contract', 'description', 'tender' ,'actions' ];

    displayedColTracking: string[] = [  'numberposition',
				'user', 'date','description',
				'origin', 'idn'];


 selectedColor = 'primary'; // Inicialmente, el color seleccionado es 'primary'

	/*=============================================
	Variable global que instancie la data que aparecerá en la Tabla
	=============================================*/
	UsersDataSource!    :MatTableDataSource<Iusers>;
  companyDataSource!  : MatTableDataSource<Icompany>;
  branchsDataSource!  : MatTableDataSource<Ibranch> ;
  projectsDataSource! : MatTableDataSource<Iproject>;
  trackingDataSource! : MatTableDataSource<Ilog>;

	/*=============================================
	Variable global que tipifica la interfaz de usuario
	=============================================*/

	  users   : Iusers[]   = [];
    company : Icompany[] = [];
    log     : Ilog[]     = [];
    branch  : Ibranch[]  = [];
    project : Iproject[] = [];

    profile    : any = {} ;

    infcompany : any = {} ;
    infbranch  : any = {} ;
    infproject : any = {} ;

	/*=============================================
	Variable global que informa a la vista cuando hay una expansión de la tabla
	=============================================*/

	//expandedElement!: Iusers | null;

  selection = new SelectionModel<Iusers>(true, []);

	/*=============================================
	Variable global que captura la ruta de los archivos de imagen
	=============================================*/

	path = environment.urlFiles;

	/*=============================================
	Variable global para definir tamaños de pantalla
	=============================================*/

	screenSizeSM = false;

	/*=============================================
	Variable global para saber cuando finaliza la carga de los datos
	=============================================*/
	loadData  = false;
  loadData2 = false;
  loadData3 = false;
  loadData4 = false;
  loadData5 = false;
	/*=============================================
	Paginación y orden
	=============================================*/

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

  	constructor(public translateService: TraductorService, private usersService: UsersService, private companyService: CompanysService,
        private firebaseService: FirebaseService, private branchService: BranchsService, private projectsService: ProjectService,
        private trackingService : TrackingService,
        private authService: AuthService, private storagesService: StoragesService,
        public dialog : MatDialog, private form:FormBuilder) {   }

  	ngOnInit(): void {

    		this.getdataUsers();


        	/*=============================================
      		Definir tamaños de pantalla
      		=============================================*/

      		if(functions.screenSize(0, 767)){

      			this.screenSizeSM = true;

      		}else{

      			this.screenSizeSM = false;

      			this.displayedColUsers.splice(1, 0, 'displayName');
      			this.displayedColUsers.splice(2, 0, 'position');

      		}

   	}

	/*=============================================
	función para tomar la data de users, cias, branchs, projects
	=============================================*/

       // Función para mostrar el perfil de un usuario
      showProfile(user: Iusers) {
         // Actualizamos el currentIndex y el profile
         // console.log(`Nombre: ${user.displayName}, Email: ${user.email}, Edad: ${user.age}`);
        this.profile = user;
       }

       infoCompany(company: Icompany) {
        // Actualizamos el currentIndex y el profile
        // console.log(`Nombre: ${user.displayName}, Email: ${user.email}, Edad: ${user.age}`);
       this.infcompany = company;

      }


      infoBranch(branch: Ibranch) {
         // console.log(`Nombre: ${user.displayName}, Email: ${user.email}, Edad: ${user.age}`);
         this.infbranch = branch;
      }

      infoProject(project: Iproject) {
        // Actualizamos el currentIndex y el profile
        // console.log(`Nombre: ${user.displayName}, Email: ${user.email}, Edad: ${user.age}`);
       this.infproject = project;

      }


        getdataUsers(){

          		this.loadData = true;

          		this.usersService.getDataUsers().subscribe((resp:any)=>{

          			/*=============================================
        			Integrando respuesta de base de datos con la interfaz
        			=============================================*/
          			let numberposition = 1;

          			this.users = Object.keys(resp).map(a=> ({

          				id:a,
          				numberposition:numberposition++,
                  active       :resp[a].active,
                  age          :resp[a].age,
          			  country      :resp[a].country,
        				  displayName  :resp[a].displayName,
        				  emailu       :resp[a].emailu,
                  iduser       :resp[a].iduser,
        				  method       :resp[a].method,
                  password     :resp[a].password,
        				  phone        :resp[a].phone,
        				  picture      :resp[a].picture,
                  position     :resp[a].position,
        				  organization :resp[a].organization

          			} as Iusers ));

                    // Tomamos el primer registro
                this.profile = this.users[this.currentIndex];

                //console.log("this.profile", this.profile);

                // Creamos el dataSource
          			this.UsersDataSource = new MatTableDataSource(this.users);
          			this.UsersDataSource.paginator = this.paginator;
          			this.UsersDataSource.sort = this.sort;
          			this.loadData = false;

          		})

  	     }


        getdataCompanys()
         {
           this.loadData2 = true;

           this.companyService.getDataCompanys('').subscribe((resp:any)=>{

             /*=============================================
           Integrando respuesta de base de datos con la interfaz
           =============================================*/
             let numberposition = 1;

             this.company = Object.keys(resp).map(a=> ({

               id:a,
               numberposition : numberposition++,
               address        : resp[a].address,
               city           : resp[a].city,
               country        : resp[a].country,
               displayName    : resp[a].displayName,
               email          : resp[a].email,
               formatrep      : resp[a].formatrep,
               phone          : resp[a].phone,
               picture        : resp[a].picture,
               rfc            : resp[a].rfc,
               state          : resp[a].state

             } as Icompany ));

             //console.log('COMPANIAS', this.company);
             // Creamos el dataSource
             this.companyDataSource            = new MatTableDataSource(this.company);
             this.companyDataSource.paginator  = this.paginator;
             this.companyDataSource.sort       = this.sort;
             this.loadData2 = false;

           })

        }


         getdataBranchs(){
             this.branchService.getData(this.infcompany.id).subscribe((resp:any)=>{

              this.loadData3 = true ;

            /*=============================================
          	Integrando la respuesta de base de dacion para tomar la data de usuarios
          	=============================================*/

            let position = Object.keys(resp).length;

            this.branch = Object.keys(resp).map(a=> ({

              id: a,
              idbra            : resp[a].idbra,
              position         : position --,
              active           : resp[a].active,
              colony           : resp[a].colony,
              country          : resp[a].country,
              cp               : resp[a].cp,
              id_company       : resp[a].id_company,
              state            : resp[a].state,
              iva              : resp[a].iva,
              locality         : resp[a].locality,
              name             : resp[a].name,
              number_exterior  : resp[a].number_exterior,
              number_interior  : resp[a].number_interior,
              street           :resp[a].street

            } as Ibranch )) ;

          this.branchsDataSource = new MatTableDataSource(this.branch);

          this.branchsDataSource.paginator = this.paginator ;
          this.branchsDataSource.sort      = this.sort ;

          this.loadData3 = false ;
    } )
         }

         getdataProjects()
         {
           this.loadData4 = true;

           this.projectsService.getDataprojects(this.infbranch.id).subscribe((resp:any)=>{

             /*=============================================
           Integrando respuesta de base de datos con la interfaz
           =============================================*/
             let numberposition = 1;

             this.project = Object.keys(resp).map(a=> ({

                id:a,
                numberposition  : numberposition++,
                code            : resp[a].code,
                contract        : resp[a].contract,
                description     : resp[a].description,
                id_branch       : resp[a].id_branch,
                image           : resp[a].image,
                tender          : resp[a].tender,
                ubication       : resp[a].ubication,
                dStart          : resp[a].dStart,
                dEnd            : resp[a].dEnd
             } as Iproject ));

             // Creamos el dataSource
             this.projectsDataSource            = new MatTableDataSource(this.project);
             this.projectsDataSource.paginator  = this.paginator;
             this.projectsDataSource.sort       = this.sort;
             this.loadData4 = false;

           })

         }

         getdataTracking()
      {

        this.loadData5 = true;

        this.trackingService.getTrackingRecordsByUser(this.profile.email).subscribe((resp:any)=>{

          /*=============================================
        Integrando respuesta de base de datos con la interfaz
        =============================================*/
          let numberposition = 1;

          this.log = Object.keys(resp).map(a=> ({

            id:a,
            numberposition :numberposition++,
            company        :resp[a].company,
            datetime       :resp[a].datetime,
            description    :resp[a].description,
            idn             :resp[a].idn,
            origin         :resp[a].origin,
            user           :resp[a].user

          } as Ilog ));

          // Creamos el dataSource
          this.trackingDataSource            = new MatTableDataSource(this.log);
          this.trackingDataSource.paginator  = this.paginator;
          this.trackingDataSource.sort       = this.sort;
          this.loadData5 = false;

        })

         }




         public async getUserEventData() {
          try {
            const result = await this.usersService.getUserEventData();
            console.log(result);
          }catch (err) {
            console.log(err);
          }

        }

          newUsers(formType: string) {
              const dialogRef = this.dialog.open(NewComponent, { data: { formType: formType } });
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.getdataUsers();
                }
              });
          }

          newCompanys(formType: string) {
            const dialogRef = this.dialog.open(NewComponent, { data: { formType: formType } });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.getdataCompanys();
              }
            });

          }

          newBranchs(formType: string, id:string) {
            const dialogRef = this.dialog.open(NewComponent, {
                data: { formType: formType,
                companyId: id } });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.getdataBranchs();
              }
            });
          }

         newProjects(formType: string, id:string) {
           const dialogRef = this.dialog.open(NewComponent, {
              data: { formType: formType,
              branchId: id } });
            dialogRef.afterClosed().subscribe(result => {
             if (result) {
               this.getdataProjects();
             }
          });

        }



          editUsers(id:string){

              const dialogRef = this.dialog.open(EditComponent,{

                width:'100%',
                data: { id: id	}

              })

              /*=============================================
              Actualizar el listado de la tabla
              =============================================*/

              dialogRef.afterClosed().subscribe(result =>{

                if(result){

                  this.getdataUsers();

                }

              })

            }


          editBranchs(id: string){

            }

            deleteUsers(id: string, mail: string, pic: string) {
              alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning', 'Yes, delete it!')
                .then((result) => {
                  if (result.isConfirmed) {
                    this.usersService.getFilterDataperm("email", mail)
                      .subscribe((resp: any) => {
                        if (Object.keys(resp).length > 0) {
                          alerts.basicAlert('error', "The category has related permission", "error");
                        } else {
                          this.usersService.deleteUsers(id, localStorage.getItem('token'))
                            .subscribe(() => {
                              // Borrar la imagen del Firebase Storage
                              const imagePath = pic; // Ruta de la imagen en el Storage
                              this.storagesService.deleteFile(imagePath)
                                .then(() => {
                                  // La imagen se ha borrado correctamente
                                  alerts.basicAlert("Success", "The user and image have been deleted", "success");
                                  this.authService.removeUserByEmail(mail);
                                  this.getdataUsers();
                                })
                                .catch((error) => {
                                  // Ocurrió un error al borrar la imagen
                                  console.error("Error deleting image from Firebase Storage:", error);
                                  alerts.basicAlert("Error", "An error occurred while deleting the image", "error");
                                });
                            }, (error) => {
                              // Error occurred while deleting the user
                              console.error("Error deleting user:", error);
                              alerts.basicAlert("Error", "An error occurred while deleting the user", "error");
                            });
                        }
                      });
                  }
                });
            }

            deleteCompanys(id: string){

            }

            deleteBranchs(id: string) {

              alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning', 'Yes, delete it!')
              .then((result) => {

                if (result.isConfirmed) {

                    this.branchService.deleteBranchs(id, localStorage.getItem('token'))
                    .subscribe(() => {

                      alerts.basicAlert("Success", "The branch has been deleted", "success");
                      this.getdataBranchs();

                  })

                }

              })
            }


            deleteProjects(id: string) {

              alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning', 'Yes, delete it!')
              .then((result) => {

                if (result.isConfirmed) {

                    this.projectsService.deleteProjects(id, localStorage.getItem('token'))
                    .subscribe(() => {

                       alerts.basicAlert("Success", "The project has been deleted", "success");
                       this.getdataProjects();

                  })

                }

              })
            }


            async assigncomp(id: string, mail: string, name: string) {
              try {
                const resp = await this.firebaseService.getpermxCompany(id, mail);

                if (resp) {
                  alerts.basicAlert('error', "The company already has this permission", "error");
                }
                else {
                  const result = await alerts.confirmAlert('Are you sure?', 'Assign Company for information user!', 'warning', 'Yes, Assign it!');

                  if (result.isConfirmed) {

                            await this.companyService.addpermiscompany(name, mail, id)
                            alerts.basicAlert("Success", "The permission has been created", "success");

                          }
                } //termino el try

              } catch (error) {
                  // Manejar errores si es necesario
              }

            }

            async desasigncomp(id: string, mail: string, name: string) {
            try {
              const resp = await this.firebaseService.getpermxCompany(id, mail);

              if (resp) {
                const result = await alerts.confirmAlert('Are you sure?', 'Desasign Company for this user!', 'warning', 'Yes, Assign it!');

                if (result.isConfirmed) {

                           await this.firebaseService.deleteCompanys( id, mail)
                           alerts.basicAlert("Success", "The permission has been removed", "success");

                        }
              } //termino el try

              } catch (error) { }
                  // Manejar errores si es necesario

            }

           async assignBranch(id: string, mail: string, idCompany: string, name: string) {
              try {
                const resp = await this.firebaseService.getpermxBranch(id, mail, idCompany);

                if (resp) {
                  alerts.basicAlert('error', "The Branch already has this permission", "error");
                }
                else {
                  const result = await alerts.confirmAlert('Are you sure?', 'Assign Branch for information user!', 'warning', 'Yes, Assign it!');

                  if (result.isConfirmed) {

                             await this.branchService.addpermisBranch(name, mail, id, idCompany)
                             alerts.basicAlert("Success", "The permission has been created", "success");

                          }
                } //termino el try

                } catch (error) {
                    // Manejar errores si es necesario
                }

              }

              async desasignBranch(id: string, mail : string, idCompany: string, name: string) {
              try {
                const resp = await this.firebaseService.getpermxBranch(id, mail, idCompany);

                if (resp) {
                  const result = await alerts.confirmAlert('Are you sure?', 'Desasign Branch for this user!', 'warning', 'Yes, Assign it!');

                  if (result.isConfirmed) {

                             await this.firebaseService.deleteBranchs( id, mail,  idCompany)
                             alerts.basicAlert("Success", "The permission has been removed", "success");

                          }
                } //termino el try

                } catch (error) { }
                    // Manejar errores si es necesario

              }


              async assignProject(id: string, mail: string, idBranch: string, name: string) {
                try {
                  const resp = await this.firebaseService.getpermxProject(id, mail, idBranch);

                  if (resp) {
                    alerts.basicAlert('error', "The Project already has this permission", "error");
                  }
                  else {
                    const result = await alerts.confirmAlert('Are you sure?', 'Assign Project for information user!', 'warning', 'Yes, Assign it!');

                    if (result.isConfirmed) {

                               await this.projectsService.addpermisProject(name, mail, id, idBranch)
                               alerts.basicAlert("Success", "The permission has been created", "success");

                            }
                  } //termino el try

                  } catch (error) {
                      // Manejar errores si es necesario
                  }

              }


              async desasignProject(id: string, mail: string, idBranch: string, name: string) {
                try {
                  const resp = await this.firebaseService.getpermxProject(id, mail, idBranch);

                  if (resp) {
                    const result = await alerts.confirmAlert('Are you sure?', 'Desasign Project for this user!', 'warning', 'Yes, Assign it!');

                    if (result.isConfirmed) {

                               await this.firebaseService.deleteProjects( id,mail, idBranch)
                               alerts.basicAlert("Success", "The permission has been removed", "success");

                            }
                  } //termino el try

                  } catch (error) { }
                      // Manejar errores si es necesario

               }



         join() {
              const userEmail = 'jsoriano@hco-consultores.com';

              this.usersService.getCompaniesPermission(userEmail).subscribe(response => {
                const [permissions, companies] = response;
                this.combinedData = this.combineData(permissions, companies);
                console.log(this.combinedData)
              }, error => {
                console.error(error);
              });
         }


         combineData(permissions: { [key: string]: any }, companies: { [key: string]: any }): any[] {
          // Filtrar los permisos por el email deseado
          const filteredPermissions = Object.values(permissions).filter((permission: any) => permission.email === 'jsoriano@hco-consultores.com');

          // Combina los datos según tu lógica de negocio
          // Puedes utilizar loops, map, filter u otras funciones de array para combinar los datos

          // Ejemplo de combinación por id_company
          return filteredPermissions.map((permission: any) => {
            const companyId = permission.id_company;
            const company = companies[companyId];

            return {
              permission,
              company
            };
          });
        }


          /*=============================================
        	Filtro de Búsqueda
        	=============================================*/
          applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
            const filterValue = (event.target as HTMLInputElement).value;
            dataSource.filter = filterValue.trim().toLowerCase();

            if (dataSource.paginator) {
              dataSource.paginator.firstPage();
            }
          }


        ngOnChanges(changes: SimpleChanges): void {
          if (changes['selectedTab'] && changes['selectedTab'].currentValue === 'users') {
              this.getdataUsers();
            }
         }

         masterToggle() {
          this.isAllSelected() ?
            this.selection.clear() :
            this.UsersDataSource.data.forEach(row => this.selection.select(row));
        }

        isAllSelected() {
          const numSelected = this.selection.selected.length;
          const numRows = this.UsersDataSource.data.length;
          return numSelected === numRows;
        }

}






