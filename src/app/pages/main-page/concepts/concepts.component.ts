import { Component, OnInit, ViewChild } from '@angular/core';

import { TraductorService } from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { ConceptsService } from 'src/app/services/concepts.service';

import { Iconcepts } from 'src/app/interface/iconcepts';
import { Ipersonalxconcept } from 'src/app/interface/ipersonalxconcept';
import { Iequiptmentxconcept } from 'src/app/interface/iequiptmentxconcept';
import { Imaterialxconcept } from 'src/app/interface/imaterialxconcept';

import { alerts } from 'src/app/helpers/alerts';

import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.component.html',
  styleUrls: ['./concepts.component.css']
})

export class ConceptsComponent implements OnInit {

  selectedTab = 'concepts';
  profile: any = {};

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'concepts') {
      this.trackingService.addLog(
         this.trackingService.getnameComp(),
        'Click en la Pestaña Details/Detalles del menu Conceptos',
        'Conceptos',
        this.trackingService.getEmail()
      );
      this.getDataConcepts();
    }

    if (tabName === 'personal') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Personal del menu Conceptos',
        'Conceptos',
        this.trackingService.getEmail()

      );

      this.getDatafindPersonal()
    }
  }

  concepts : Iconcepts[] = [] ;
  perxcon  : Ipersonalxconcept[]   = [] ;
  equxcon  : Iequiptmentxconcept[] = [] ;
  matxcon  : Imaterialxconcept[]   = [] ;
  personalList  : any [] ;

  conceptDataSource!   : MatTableDataSource<Iconcepts>;
  personalDataSource!  : MatTableDataSource<Ipersonalxconcept>;
  equipmentDataSource! : MatTableDataSource<Iequiptmentxconcept>;
  materialDataSource!  : MatTableDataSource<Imaterialxconcept>;

  screenSizeSM = false;
  currentIndex: number = 0;

  loadData     = false;

  displayedColconcepts: string[] = [
    'numberposition',
    'activity',
    'description',
    'ponderation',
    'actions',
  ];

  displayedColpersonal: string[] = [
    'numberposition',
    'descripper',
    'quantity',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private trackingService: TrackingService,
              public translateService    : TraductorService,
              private conceptsService : ConceptsService) { }

  ngOnInit() {

     // alert(this.trackingService.getCompany());
      this.getDataConcepts() ;

  }


  getDataConcepts() {
    this.loadData = true;

    this.conceptsService.getDataConcepts(this.trackingService.getProject())
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.concepts = Object.keys(resp).map(
          (a) =>
            ({
              id: resp[a].key,
              numberposition : numberposition++,
              actividad      : resp[a].actividad,
              cantidad       : resp[a].cantidad,
              color          : resp[a].color,
              concepto       : resp[a].concepto,
              costoMN        : resp[a].costoMN,
              descripcion    : resp[a].descripcion,
              especificacion : resp[a].especificacion,
              fechainicial   : resp[a].fechainicial,
              fechafinal     : resp[a].fechafinal,
              frequence      : resp[a].fechainicial,
              id_project     : resp[a].id_project,
              nivel          : resp[a].nivel,
              orden          : resp[a].orden,
              ponderado      : resp[a].ponderado,
              simbolo        : resp[a].simbolo,
              tipoactividad  : resp[a].tipoactividad,
              ventaMN        : resp[a].ventaMN,
              wbs            : resp[a].wbs
            } as Iconcepts)
        );

       //  console.log(this.concepts) ;
         this.profile = this.concepts[this.currentIndex]; // Tomamos el primer registro
         this.conceptDataSource = new MatTableDataSource(this.concepts); // Creamos el dataSource
         this.conceptDataSource.paginator = this.paginator ;
         this.conceptDataSource.sort = this.sort;

         this.loadData = false;
      });
  }


  getDatafindPersonal() {

    this.conceptsService.getPersonal(this.profile.id)
      .subscribe((resp: any) => {
        /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
        let numberposition = 1;

        this.perxcon = Object.keys(resp).map(
          (a) =>
            ({
              id: a,
              numberposition : numberposition++,
              idconcepto     : resp[a].idconcepto,
              idpersonal     : resp[a].idpersonal,
              quantity       : resp[a].quantity,
              descripcion    : resp[a].descripcion

            } as Ipersonalxconcept)
        );

         console.log(this.perxcon) ;
       //  this.profile = this.perxcon[this.currentIndex]; // Tomamos el primer registro
         this.personalDataSource = new MatTableDataSource(this.perxcon)
         this.personalDataSource.paginator = this.paginator ;
         this.personalDataSource.sort = this.sort;

         this.loadData = false;
      });

  }


  showProfile(commun: Iconcepts) {
    // Actualizamos el currentIndex y el profile
    this.profile = commun;
  }

  newConcepts(formType: string) {
      /*
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
             this.getdataComunications();
            }
          });
      */
  }

  newPersonal(formType: string) {
    /*
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
           this.getdataComunications();
          }
        });
    */
  }

  editConcepts(id: string) {

  }

  deleteConcept(id : string) {

  }

  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }


  getRowClass(tipoactividad: string): string {
    if (tipoactividad === 'Actividad') {
      return 'green-row';
    } else if (tipoactividad === 'Paquete') {
      return 'red-row';
    } else {
      return '';
    }
  }


}
