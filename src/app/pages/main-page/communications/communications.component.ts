import { Icommunications } from './../../../interface/icommunication';
import { Idetailscom } from 'src/app/interface/idetailscom';
import { Idocumentscom } from 'src/app/interface/idocumentscom';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { TraductorService} from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { PrintreportsService } from 'src/app/services/printreports.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatCalendar } from '@angular/material/datepicker';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

import { HttpClient } from '@angular/common/http';
import { functions } from 'src/app/helpers/functions';

import { alerts } from 'src/app/helpers/alerts';

import { CommunicationsService } from 'src/app/services/communications.service';
import { NewcommunicComponent } from './newcommunic/newcommunic.component';
import { EditcommunicComponent } from './editcommunic/editcommunic.component';
import { NewfollowcomComponent } from './newfollowcom/newfollowcom.component';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class CommunicationsComponent implements OnInit {

  selectedTab       = 'comunication';
  comDataSource!    : MatTableDataSource<Icommunications>; //Variable global que instancie la data que aparecerá en la Tabla
  detailsDataSource : MatTableDataSource<Idetailscom>;
  docDataSource     : MatTableDataSource<Idocumentscom>;
  icommunications   : Icommunications[] = [];
  idocumentscomm    : Idocumentscom[] = [];
  detailscom2       : Idetailscom[] = [];
  selectedAction    : any = {}; // Acción seleccionada de la tabla de acciones
  profile           : any = {};
  whidthDialog      : string = "60%"; // Tamaño en anchura de la ventana de dialog
	loadData          = false;
  screenSizeSM      = false;
  currentIndex      : number = 0;
  // Variables para construir el calendar
  slDate            : Date | null = null;
  slDay             : number | null = null;
  frecc             : string = '';
  dtm               : string = '';
  dIni              : string = '';
  tIni              : string = '';
  fechaIni          : Date | null = null;
  fechaEnd          : Date = new Date('2024-06-22 00:00:00');
  fechSemana        : number[][] = [];
  fechMonth         : number[][] = [];
  fechDaily         : number[][] = [];
  fechOk            : number[][] = [];
  fechaHoy          : Date = new Date();
  datesArray        : string[];
  classT            : string = '';
  classF            : string = '';
  lastRecordID      : number = 0;
  applyCustomStyle  = true;

  //  Variable para nombrar las columnas de nuestra tabla en Angular Material
  displayedColumns  : string[] = ['numberposition', 'procces', 'information','owner', 'actions'];

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;
    if (tabName === 'comunication') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña Comunication del menu Comunications',
        'Risk',
        ''
      );
      this.getdataComunications();
      this.selectedAction.adescription="";

    }
    if (tabName === 'follow') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña follow del menu Comunications',
        'Risk',
        ''
      );
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;

  constructor (
    private trackingService     : TrackingService,
    private communicationservice: CommunicationsService,
    public translateService     : TraductorService,
    public printReportsService  : PrintreportsService,
    public http                 : HttpClient,
    public dialog               : MatDialog
  ){}

  ngOnInit(): void {

    this.getdataComunications();

    /*=============================================
    Definir tamaños de pantalla
    =============================================*/
    if(functions.screenSize(0, 767)){
      this.screenSizeSM = true;
    }else{
      this.screenSizeSM = false;
    }
    this.trackingService.setultimaVentana('COMMUNICATIONS')

  }

  showProfile(commun: Icommunications) {
    // Actualizamos el currentIndex y el profile
    // console.log(`Nombre: ${user.displayName}, Email: ${user.email}, Edad: ${user.age}`);
    this.profile = commun;
    [this.frecc, this.dtm] = this.profile.frequence.split(',').map(item => item.trim());
    [this.dIni, this.tIni] = this.dtm.split(' ');
    this.fechaIni = new Date(this.dIni+' 00:00:00');
    this.fechSemana.splice(0, this.fechSemana.length);
    this.fechMonth.splice(0, this.fechMonth.length);
    this.fechDaily.splice(0, this.fechDaily.length);
    this.fechOk.splice(0, this.fechOk.length);
    this.getdataDocComunications();

    let fechaActual = new Date(this.fechaIni);
    if(this.frecc === 'Semanal') {

      while (fechaActual <= this.fechaEnd) {
        const numDia = fechaActual.getDate(); // Obtener el número del día
        const numMes = fechaActual.getMonth()+1;
        const numAño = fechaActual.getFullYear();
        this.fechSemana.push([numAño, numMes, numDia]); //
        fechaActual.setDate(fechaActual.getDate() + 7); // Avanzar 7 días
      }
    }else if(this.frecc==='Mensual'){

      while (fechaActual <= this.fechaEnd) {
        const numDia = fechaActual.getDate(); // Obtener el número del día
        const numMes = fechaActual.getMonth()+1;
        const numAño = fechaActual.getFullYear();
        this.fechMonth.push([numAño, numMes, numDia]); //
        fechaActual.setDate(fechaActual.getDate() + 30); // Avanzar 30 días
      }
    }else if(this.frecc==='Diario'){
      while (fechaActual <= this.fechaEnd) {
        const numDia = fechaActual.getDate(); // Obtener el número del día
        const numMes = fechaActual.getMonth()+1;
        const numAño = fechaActual.getFullYear();
        this.fechDaily.push([numAño, numMes, numDia]); //
        fechaActual.setDate(fechaActual.getDate() + 1); // Avanzar 30 días
      }
    }
  }

  getdataComunications(){

    this.loadData = true;

    this.communicationservice.getDataCommunications(localStorage.getItem('project')).subscribe((resp:any)=>{

      /*=============================================
      Integrando respuesta de base de datos con la interfaz
      =============================================*/
      let numberposition = 1;

      this.icommunications = Object.keys(resp).map(a=> ({

        id:a,
        numberposition:numberposition++,
        pos            : resp[a].pos,
        active         : resp[a].active,
        name           : resp[a].name,
        procces        : resp[a].procces,
        id_project     : resp[a].id_project,
        information    : resp[a].information,
        format         : resp[a].format,
        area           : resp[a].area,
        owner          : resp[a].owner,
        reference      : resp[a].reference,
        frequence      : resp[a].frequence,
        group          : resp[a].group,


      } as Icommunications ));

      if(this.icommunications.length > 0) {
        this.icommunications.sort((a, b) => a.pos - b.pos);
        const ultimoRegistro = this.icommunications[this.icommunications.length - 1];
        this.lastRecordID = ultimoRegistro.pos;
      }
      console.log(this.lastRecordID);
      //this.profile = this.icommunications[this.currentIndex]; // Tomamos el primer registro
      this.comDataSource = new MatTableDataSource(this.icommunications); // Creamos el dataSource
      this.comDataSource.paginator = this.paginator;
      this.comDataSource.sort = this.sort;
      this.loadData = false;
    })
  }

  getdataDocComunications(){

    this.communicationservice.getDocuments(this.profile.id).subscribe((resp:any)=>{

      this.idocumentscomm = Object.keys(resp).map(a=> ({

        id               : a,
        active           : resp[a].active,
        date             : resp[a].date,
        description      : resp[a].description,
        id_communication : resp[a].id_communication,
        picture          : resp[a].picture

      } as Idocumentscom ));
      this.docDataSource = new MatTableDataSource(this.idocumentscomm);
      this.datesArray = this.idocumentscomm.map(doc => doc.date);
      this.fechOk = this.datesArray.map(date => {
        const [year, month, day] = date.split("-").map(Number);
        return [year, month, day];
      });
    })
  }

  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  generarReporte(){

    this.printReportsService.generarReporte(this.detailscom2, this.icommunications);

  }

  newCommunications() {

    const dialogRef= this.dialog.open(NewcommunicComponent,
    {
      width: this.whidthDialog,
      data: { idpos: this.lastRecordID }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.basicAlert('Ok', 'The communication has been saved', 'success');
        this.getdataComunications();
      }
    });

  }

  newFollow(id: string) {
    this.applyCustomStyle = false;
    if(this.slDate){

      const dialogRef= this.dialog.open(NewfollowcomComponent,
      {
        width: this.whidthDialog,
        data: {
          id: id,
          sDate: this.slDate
        }

      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          alerts.basicAlert('Ok', 'The communication has been saved', 'success');
          this.fechOk.push([this.slDate.getFullYear(), this.slDate.getMonth()+1, this.slDate.getDate()]);
          this.slDate = new Date();
          this.applyCustomStyle = true;
          this.calendar.updateTodaysDate();
        }
      });
    }else{
      alerts.basicAlert('Atencion', 'Debe seleccionar una fecha', 'warning');
    }


  }

  editCommunic(id: string) {

    const dialogRef= this.dialog.open(EditcommunicComponent,{
      width: this.whidthDialog,
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.basicAlert('Ok', 'The communication has been saved', 'success');
        this.getdataComunications();
      }
    });
  }

  deleteCommunic(id: string) {
    console.log(id);
    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {
      if (result.isConfirmed) {

        this.communicationservice.deleteCommunications(id, localStorage.getItem('token'))
        .subscribe(() => {

          alerts.basicAlert("Sucess", "The user has been deleted", "success")
          this.getdataComunications();
        })
      }
    })
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (this.applyCustomStyle && view === 'month') {

      this.slDay = cellDate.getDate();
      const slMonth = cellDate.getMonth();
      const slYear = cellDate.getFullYear();
      const dateIni = new Date(this.fechaIni);
      const dateEnd = new Date(this.fechaEnd);
      this.classT = 'date-select-class';
      this.classF = 'date-unselect-class';

      switch(this.frecc){
        case 'Diario':

          if(slYear <= dateEnd.getFullYear() && slYear >= dateIni.getFullYear()){
            const slDate = this.fechDaily.some(fecha => (fecha[0]===slYear && fecha[1]-1) === slMonth && fecha[2] === this.slDay);
            if(cellDate <= this.fechaHoy){
              const dateOK = this.fechOk.some(fecha => (fecha[0]===slYear && fecha[1]-1) === slMonth && fecha[2] === this.slDay);
              if(dateOK){
                this.classT = 'date-ok-class';
              }else{
                this.classT = 'date-late-class';
              }
            }else{
              this.classT = 'date-select-class';
            }
            return slDate ? this.classT : this.classF;
          }
          break;
        case 'Semanal':

          if(slYear <= dateEnd.getFullYear() && slYear >= dateIni.getFullYear()){
            const slDate = this.fechSemana.some(fecha => (fecha[0]===slYear && fecha[1]-1) === slMonth && fecha[2] === this.slDay);
            if(cellDate <= this.fechaHoy){
              const dateOK = this.fechOk.some(fecha => (fecha[0]===slYear && fecha[1]-1) === slMonth && fecha[2] === this.slDay);
              if(dateOK){
                this.classT = 'date-ok-class';
              }else{
                this.classT = 'date-late-class';
              }
            }else{
              this.classT = 'date-select-class';
            }
            return slDate ? this.classT : this.classF;
          }
          break;
        case 'Mensual':

          if(slYear <= dateEnd.getFullYear() && slYear >= dateIni.getFullYear()){
            const slDate = this.fechMonth.some(fecha => (fecha[0]===slYear && fecha[1]-1) === slMonth && fecha[2] === this.slDay);
            if(cellDate <= this.fechaHoy){
              const dateOK = this.fechOk.some(fecha => (fecha[0]===slYear && fecha[1]-1) === slMonth && fecha[2] === this.slDay);
              if(dateOK){
                this.classT = 'date-ok-class';
              }else{
                this.classT = 'date-late-class';
              }
            }else{
              this.classT = 'date-select-class';
            }
            return slDate ? this.classT : this.classF;
          }
          break;
        default:

          return 'date-unselect-class';
          break;
      }
    }
    return '';
  };
}




