import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { TraductorService} from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { CompanysService } from 'src/app/services/companys.service';
import { ProjectService } from 'src/app/services/project.service';

import { AuthService } from 'src/app/services/auth.service';

import { alerts } from 'src/app/helpers/alerts';



@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

   companyData     : any[]  = [] ;
   branchData      : any[]  = [] ;
   projectData     : any[]  = [] ;

   valorultven    : string = '' ;

   infcompany : any = {} ;

   selectedCompany   : string = '';
   selectedProjectId : string ;
   selectedBranchId  : string ;
   projectDateEnd    : string ;

  constructor(
    public translateService: TraductorService,
    public trackingService : TrackingService,
    public companysService : CompanysService,
    public authService : AuthService,
    private cdRef: ChangeDetectorRef,
    public projectsService : ProjectService,
    private router: Router
  ) { }


  async home() {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu Home/Inicio', 'Menu Side Bar', '')
    this.router.navigate(['/']);
  }

  navigateToBranchs()  {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu Branchs/Sucursales', 'Menu Side Bar', '')
    this.router.navigate(['/branchs']);
  }

  navigateToCompanys()  {
    this.router.navigate(['/companys']);
  }

  navigateToUsers()  {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu Users/Usuarios', 'Menu Side Bar', '')
    this.router.navigate(['/users']);
  }


    navigateToCatalog()  {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu Catalog Concepts/Catalogo Conceptos', 'Menu Side Bar', '')
    this.router.navigate(['/concepts']);
  }

  async navigateToInterested()  {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu Interested/Interesados', 'Menu Side Bar', '')
    this.router.navigate(['/interested']);
  }

  async navigateToCommunications()  {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu communication/Comunicaciones', 'Menu Side Bar', '')
    this.router.navigate(['/communications']);
  }

  async navigateToLessons()  {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu Lesson/Lecciones', 'Menu Side Bar', '')
    this.router.navigate(['/lessons']);
  }

  navigateToRisk()  {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu Risk/riesgos', 'Menu Side Bar', '')
    this.router.navigate(['/risk']);
  }

  navigateToDshbPMO()  {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu Dashboard', 'Menu Side Bar', '')
    this.router.navigate(['/dashboardpmo']);
  }

  async navigateToManagement()  {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu Management/Gestion de Archivo', 'Menu Side Bar', '')
    this.router.navigate(['/management']);
  }

  async navigateToTraining()  {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu Training/Entrenamiento ', 'Menu Side Bar', '')
    this.router.navigate(['/training']);
  }

  navigateToEmployee() {
    this.trackingService.addLog(this.trackingService.getnameComp(), 'Eleccion del menu Employee/Empleados ', 'Menu Side Bar', '')
    this.router.navigate(['/employees']);
  }


  async ngOnInit(){
    await this.getpermissionxCompanys() ;
  }


  //empiezan los procedimientos para las llamadas de los combobox
  //obtener los permisos de la cia
  async getpermissionxCompanys() {

    this.companysService.getpermissionsxCompany(localStorage.getItem('mail'))
    .subscribe((data) => {



      this.companyData = Object.values(data);

      if (this.companyData.length > 0) {
        this.selectedCompany = this.companyData[0].id_company;

        this.trackingService.setCompany(this.selectedCompany);

        this.getHeadersCompanys();

        this.getpermissionxBranchs();

      }

    });


  }

  onCompanysSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.trackingService.setCompany(target.value) ;
    this.selectedCompany = target.value;
    this.getpermissionxBranchs();
  }


  getpermissionxBranchs() {

    this.companysService.getpermissionsxBranch(localStorage.getItem('company'), localStorage.getItem('mail')).subscribe((databranch) => {
      this.branchData = Object.values(databranch);
      if (this.branchData.length > 0) {

        console.log("dataBranch", this.branchData) ;

        this.selectedBranchId = this.branchData[0].id_branchs ;
        this.trackingService.setBranch(this.selectedBranchId) ;
        this.getpermissionxProjects();
      }else{
         alerts.basicAlert("Error", "The user has not Branchs asssigns", "error")
      }

    });
  }

  onBranchsSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedBranchId = target.value;
    this.getpermissionxProjects();
  }


  // Datos de Projectos

  getpermissionxProjects(): void {
    this.companysService.getpermissionsxProject(localStorage.getItem('branch'),localStorage.getItem("mail")).subscribe((data) => {

      this.projectData = Object.values(data);
      if (this.projectData.length > 0) {
        this.selectedProjectId = this.projectData[0].id_projects ;
        this.trackingService.setProject(this.selectedProjectId) ;
        this.getHeadersProjects() ;
      }
      else
      {
        alerts.basicAlert("Error", "No existen Proyectos para este usuario.", "error");
      }
    });
  }

  async onProjectSelected(event: Event){
    const target = event.target as HTMLSelectElement;
    this.selectedProjectId = target.value;
    this.trackingService.setProject(this.selectedProjectId) ;

    this.cdRef.markForCheck() ;

    await this.home();

    this.valorultven = this.trackingService.getultimaVentana()

    if (this.valorultven === 'INTERESADOS') {
      await this.navigateToInterested()
    }

    if (this.valorultven === 'COMMUNICATIONS') {
      await this.navigateToCommunications()
    }

  }

  getHeadersCompanys(){
    this.companysService.getDataCompanys(this.selectedCompany).subscribe((datacom: any) => {
      // Utilizar los datos obtenidos
        this.trackingService.setnameComp(datacom.displayName);

        this.trackingService.setpictureComp(datacom.picture);
        //  alert('Picture:'+ datacom.picture);

        this.trackingService.setformatrepint(datacom.formatrep) ;
        //  alert('Format:'+ datacom.formatrep);

    });
  }

  getHeadersProjects(){

    this.projectsService.getDataprojectsheader(this.selectedProjectId).subscribe(
      (data: any) => {
        if (data) {
          // Datos obtenidos correctamente

          this.trackingService.setContract(data.contract)

          this.trackingService.setnameProject(data.description);

          this.trackingService.setubicationProject(data.ubication) ;

          this.trackingService.setStart(data.dStart)

          this.trackingService.setEnd(data.dEnd)

        } else {
          // Error al obtener los datos
          console.error('Error al obtener los datos del proyecto');
        }
      },
      (error: any) => {
        console.error('Error en la llamada al servicio:', error);
      }
    );
  }
}
