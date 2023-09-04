import { RiskService } from 'src/app/services/risk.service';
import { EditactionComponent } from './editaction/editaction.component';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Irisk, Iactions, Iresources, Itrackingrisk, Irinteres } from 'src/app/interface/irisk';
import { NewriskComponent } from './newrisk/newrisk.component';
import { EditriskComponent } from './editrisk/editrisk.component';
import { NewactionComponent } from './newaction/newaction.component';
import { NewresourceComponent } from './newresource/newresource.component';
import { NewtrackingComponent } from './newtracking/newtracking.component';
import { EdittrackingComponent } from './edittracking/edittracking.component';
import { TrackingService } from 'src/app/services/tracking.service';
import { object } from 'firebase-functions/v1/storage';
import { alerts } from 'src/app/helpers/alerts';


@Component({
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.css']
})
export class RiskComponent {
  profile                 : any = {};
  selectedAction          : any = {}; // Acción seleccionada de la tabla de acciones
  currentIndex            : number = 0 ;
  whidthDialog            : string = "60%"; // Tamaño en anchura de la ventana de dialog
  displayedColumnsRisk    : string[] = ['id','description','owner','status','actions'];
  displayedColumnsActions : string[] = ['id_action', 'adescription', 'startDate', 'endDate', 'total_cost', 'actions'];
  displayedColumnsTracking: string[] = ['id_tracking', 'reg_date', 'observations', 'progress', 'actions'];
  dataSourceRisk          : MatTableDataSource<Irisk>;
  dataSourceActions       : MatTableDataSource<Iactions>;
  dataSourceTracking      : MatTableDataSource<Itrackingrisk>;
  pageSizeOptions         : number[] = [5, 10, 15];
  id_risk                 : string = '';
  adescription            : string = '';
  monitoring_date         : string = '';
  total_cost              : number = 0;
  sum_progress            : number = 0;
  lastTrackingDate        : string = '';
  startDate               : string = '';
  endDate                 : string = '';
  risks                   : Irisk[] = [];
  actions                 : Iactions[] = [];
  tracking                : Itrackingrisk[] = [];
  lastRecordID            : number = 0;
  lastRecordIDa           : number = 0;
  selectedTab             = 'registry';
	screenSizeSM            = false;
	loadData                = false;
	loadData2               = false;
	loadData3               = false;
  pageSize                = 10;
  pageIndex               = 0;

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;
    if (tabName === 'registry') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña registry/registro del menu Risk',
        'Risk',
        ''
      );
      this.getDataRisk();
      this.selectedAction.adescription="";

    }
    if (tabName === 'treatment') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña treatment/treatment del menu Risk',
        'Risk',
        ''
      );
      this.getDataActions();
    }
    if (tabName === 'tracking') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña tracking/Seguimiento del menu Risk',
        'Risk',
        ''
      );
      this.getDataTracking();
    }
  }

  @ViewChild('MatPaginatorTab1') paginator: MatPaginator;
  @ViewChild('MatPaginatorTab2') paginator2: MatPaginator;
  @ViewChild('MatPaginatorTab3') paginator3: MatPaginator;
  @ViewChild(MatSort) sortTab1: MatSort;
  @ViewChild(MatSort) sortTab2: MatSort;
  @ViewChild(MatSort) sortTab3: MatSort;

  constructor(
    public dialog: MatDialog,
    private trackingService: TrackingService,
    private RiskService: RiskService
  ) { }

  getDataRisk(){
    this.loadData = true;
    this.RiskService.getDataRisk(localStorage.getItem('project'))
    .subscribe((resp: any) => {
      let numberposition = 1;
      this.risks = Object.keys(resp).map(
        (a) => ({
          id: a,
          numberposition   : numberposition++,
          active           :  resp[a].active,
          closing_incharge :  resp[a].closing_incharge,
          description      :  resp[a].description,
          id_concept       :  resp[a].id_concept,
          id_project       :  resp[a].id_project,
          imp_cost         :  resp[a].imp_cost,
          imp_quality      :  resp[a].imp_quality,
          imp_scope        :  resp[a].imp_scope,
          imp_score        :  resp[a].imp_score,
          imp_time         :  resp[a].imp_time,
          observations     :  resp[a].observations,
          owner            :  resp[a].owner,
          phase            :  resp[a].phase,
          pos              :  resp[a].pos,
          probability      :  resp[a].probability,
          response         :  resp[a].response,
          rimp_cost        :  resp[a].actirimp_costve,
          rimp_quality     :  resp[a].rimp_quality,
          rimp_scope       :  resp[a].rimp_scope,
          rimp_score       :  resp[a].rimp_score,
          rimp_time        :  resp[a].rimp_time,
          rprobability     :  resp[a].rprobability,
          status           :  resp[a].status,
        })
      )
      if(this.risks.length>0) {
        this.risks.sort((a, b) => a.pos - b.pos);
        const ultimoRegistro = this.risks[this.risks.length - 1];
        this.lastRecordID = ultimoRegistro.pos;
      }
      //this.profile = this.risks[this.currentIndex]; // Tomamos el primer registro
      this.dataSourceRisk = new MatTableDataSource(this.risks); // Creamos el dataSource
      this.dataSourceRisk.paginator = this.paginator;
      this.dataSourceRisk.sort = this.sortTab1;
      this.dataSourceRisk.paginator.pageIndex = this.pageIndex;
      this.dataSourceRisk.paginator.pageSize = this.pageSize;
      this.dataSourceRisk.paginator.length = this.risks.length;
      this.loadData = false;
    });
  }

  getDataActions(){
    this.loadData2 = true;
    this.RiskService.getDataAction(this.profile.id)
    .subscribe((resp: any) => {
      let numberposition = 1;
      this.actions = Object.keys(resp).map(
        (a) => ({
          id: a,
          numberposition  : numberposition++,
          id_risk         : resp[a].id_risk,
          pos             : resp[a].pos,
          adescription    : resp[a].adescription,
          startDate       : resp[a].startDate,
          endDate         : resp[a].endDate,
          monitoring_date : resp[a].monitoring_date,
          lastTrackingDate: resp[a].lastTrackingDate,
          total_cost      : resp[a].total_cost,
          sum_progress    : resp[a].sum_progress
        })
      )
      if(this.actions.length>0) {
        this.actions.sort((a, b) => a.pos - b.pos);
        const ultimoRegistro = this.actions[this.actions.length - 1];
        this.lastRecordIDa = ultimoRegistro.pos;
      } else {
        this.RiskService.updateRiskStatus(this.profile.id, 'Abierto');
      }
      console.log(this.lastRecordIDa);
      this.dataSourceActions = new MatTableDataSource(this.actions); // Creamos el dataSource
      this.dataSourceActions.paginator = this.paginator2;
      this.dataSourceActions.sort = this.sortTab2;
      this.dataSourceActions.paginator.pageIndex = this.pageIndex;
      this.dataSourceActions.paginator.pageSize = this.pageSize;
      this.dataSourceActions.paginator.length = this.actions.length;
      this.loadData2 = false;
    });
  }

  getDataTracking(){
    this.loadData3 = true;
    this.RiskService.getDataTracking(this.selectedAction.id)
    .subscribe((resp: any) => {
      let numberposition = 1;
      this.tracking = Object.keys(resp).map(
        (a) => ({
          id: a,
          numberposition : numberposition++,
          id_action      : resp[a].id_action,
          reg_date       : resp[a].reg_date,
          progress       : resp[a].progress,
          observations   : resp[a].observations,

        })
      )
      this.dataSourceTracking = new MatTableDataSource(this.tracking); // Creamos el dataSource
      this.dataSourceTracking.paginator = this.paginator3;
      this.dataSourceTracking.sort = this.sortTab3;
      this.dataSourceTracking.paginator.pageIndex = this.pageIndex;
      this.dataSourceTracking.paginator.pageSize = this.pageSize;
      this.dataSourceTracking.paginator.length = this.tracking.length;
      this.loadData3 = false;
    });
  }

  ngOnInit(): void {
    this.getDataRisk();
  }

  showProfile(iprofile: Irisk) {
    this.profile = iprofile;
  }
  selectAction(action: Iactions){
    this.selectedAction = action;
  }

  newRisk() {
    const dialogRef = this.dialog.open(NewriskComponent, {
      width: this.whidthDialog,
      data: { idpos: this.lastRecordID }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  editRisk(id:string){
    const dialogRef = this.dialog.open(EditriskComponent, {
      width: this.whidthDialog,
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.basicAlert('Ok', 'The risk has been saved', 'success');
        this.getDataRisk();
      }
    });
  }

  deleteRisk(id:string){
    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {
      if (result.isConfirmed) {
        this.RiskService.deleteRinteresByRiskId(id, localStorage.getItem('token'));
        this.RiskService.deleteRisk(id, localStorage.getItem('token'))
        .subscribe(() => {
          alerts.basicAlert("Sucess", "The user has been deleted", "success");
          this.getDataRisk();
        })
      }
    })
  }

  newAction() {
    const dialogRef = this.dialog.open(NewactionComponent, {
      width: this.whidthDialog,
      data: {
        id: this.profile.id,
        idpos: this.lastRecordIDa
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.basicAlert('Ok', 'The action has been saved', 'success');
        this.getDataActions();
      }
    });
  }

  editAction(id:string) {
    const dialogRef = this.dialog.open(EditactionComponent, {
      width: this.whidthDialog,
      data: {
        id: id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.basicAlert('Ok', 'The action has been saved', 'success');
        this.getDataActions();
      }
    });
  }

  deleteAction(id:string){
    console.log(id);
    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {
      if (result.isConfirmed) {
        this.RiskService.deleteAction(id, localStorage.getItem('token'))
        .subscribe(() => {
          alerts.basicAlert("Sucess", "The action has been deleted", "success");
          this.getDataActions();
        })
      }
    })
  }

  newResource(id:string) {
    const dialogRef = this.dialog.open(NewresourceComponent, {
      width: this.whidthDialog,
      data: {
        id: id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.basicAlert('Ok', 'The Resources has been saved', 'success');
        this.getDataActions();
      }
    });
  }

  newTracking() {
    const dialogRef = this.dialog.open(NewtrackingComponent, {
      width: this.whidthDialog,
      data: { id: this.selectedAction.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alerts.basicAlert('Ok', 'The action has been saved', 'success');
        this.getDataTracking();
      }
    });
  }

  editTracking(id:string) {
    const dialogRef = this.dialog.open(EdittrackingComponent, {
      width: this.whidthDialog,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  deleteTracking(id:string, prog:number){
    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
    .then((result) => {
      if (result.isConfirmed) {
        this.RiskService.deleteTracking(id, localStorage.getItem('token'))
        .subscribe(
          () => {
            alerts.basicAlert("Sucess", "The tracking has been deleted", "success");
            this.updProgress(prog);
            this.getDataTracking();
          }
        )
      }
    })
  }

  updProgress(prog:number){

    const sumprog = Number(this.selectedAction.sum_progress) - Number(prog);
    console.log("Id: ", this.selectedAction.id);
    console.log("Avance: ", sumprog);
    console.log("Avance dlt: ", prog);
    console.log("Avance Ant: ", this.selectedAction.sum_progress);
    const dataAction: Iactions = {

      id_risk         : this.selectedAction.id_risk ?? '',
      pos             : this.selectedAction.pos,
      adescription    : this.selectedAction.adescription ?? '',
      startDate       : this.selectedAction.startDate ?? '',
      endDate         : this.selectedAction.endDate ?? '',
      monitoring_date : this.selectedAction.monitoring_date ?? '',
      lastTrackingDate: this.selectedAction.lastTrackingDate ?? '',
      sum_progress    : sumprog ?? 0,
      total_cost      : this.selectedAction.total_cost ?? 0,
    }
    this.RiskService.patchDataAction(this.selectedAction.id, dataAction, localStorage.getItem('token')).subscribe(
    resp => {
      console.log("Action updated");
    },
    err => {
      alerts.basicAlert("Error", 'Action saving error', "error")
    })
  }

  getTotalCost() {
    return this.actions.map(t => t.total_cost).reduce((acc, value) => acc + value, 0);
  }

  getTotalProgTracking() {
    return this.tracking.map(t => Number(t.progress)).reduce((acc, value) => acc + value, 0);
  }

  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }

  }


}
