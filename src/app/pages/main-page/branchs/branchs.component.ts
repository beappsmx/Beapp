import { Component, OnInit, ViewChild } from '@angular/core';
import { Ibranch } from 'src/app/interface/ibranch';
import { BranchsService } from 'src/app/services/branchs.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger} from '@angular/animations'
import { environment } from 'src/environments/environment';
import { functions } from 'src/app/helpers/functions';
import { NewBranchComponent } from './new-branch/new-branch.component';
import { EditBranchComponent } from './edit-branch/edit-branch.component';
import { alerts } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-branchs',
  templateUrl: './branchs.component.html',
  styleUrls: ['./branchs.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})

export class BranchsComponent implements OnInit {

  /*=============================================
	Variable para nombrar las columnas de nuestra Tabla en Angular Material
	=============================================*/
  displayedColumnsb: string[] = ['position', 'name', 'actions'];

  /*=============================================
	Variable global que instancie la data que aparecera en la Tabla
	=============================================*/

  dataSource!:MatTableDataSource<Ibranch>;

	/*=============================================
	Variable global que tipifica la interfaz de usuario
	=============================================*/
  branch:Ibranch[] = [];

  	/*=============================================
	Variable global que informa a la vista cuando hay una expansion de la tabla
	=============================================*/
  expandedElement!: Ibranch | null;

  	/*=============================================
	Variable global que informa a la vista cuando hay una expansion de la tabla
	=============================================*/

  path = environment.urlFiles ;

    /*=========================================
	   Variable para definir tamaño de pantalla
	  ===========================================*/

    screenSizeSM = false;

    /*=========================================
	   Variable para definir tamaño de pantalla
	  ===========================================*/
    loadData=false;

    /*=========================================
	   Paginacion y Orden
	  ===========================================*/

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ///hasta aqui termina los valores previamente capturados que son los primeros en ejecutarse

  constructor(private branchService:BranchsService, public dialog : MatDialog ) { }

  ngOnInit(): void {

    this.getData();

    /*=============================================
	   Definir tamano de Pantallas
	  =============================================*/

    if (functions.screenSize(0,767)){

      this.screenSizeSM = true

    }else {

        this.screenSizeSM = false
        this.displayedColumnsb.splice(2,0, 'street');
        this.displayedColumnsb.splice(3,0, 'country');

    }

  }

	/*=============================================
	Funcion para tomar la data de usuarios
	=============================================*/

     getData(){

          this.branchService.getData('i').subscribe((resp:any)=>{

          this.loadData = true ;

            /*=============================================
          	Integrando la respuesta de base de dacion para tomar la data de usuarios
          	=============================================*/

            let position = Object.keys(resp).length;

            this.branch = Object.keys(resp).map(a=> ({

              id: a,
              idbra :resp[a].idbra,
              position: position --,
              active : resp[a].active,
              colony: resp[a].colony,
              country:resp[a].country,
              cp: resp[a].cp,
              id_company:resp[a].id_company,
              state:resp[a].id_state,
              iva:resp[a].iva,
              locality:resp[a].locality,
              name:resp[a].name,
              number_exterior:resp[a].number_exterior,
              number_interior:resp[a].number_interior,
              street:resp[a].street

            } as Ibranch )) ;

          this.dataSource = new MatTableDataSource(this.branch);

          this.dataSource.paginator = this.paginator ;
          this.dataSource.sort      = this.sort ;

          this.loadData = false ;
    } )
 }


/**---------------------
 * Filtro de Busqueda
 -----------------------*/

 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
   }
}

/* --------------------------------
 Funcion para Agregar nuevo registro el Branch
 -----------------------------------*/

 newBranch() {
   const dialogRef= this.dialog.open(NewBranchComponent);

   /*-------------------------------------
     Actualizar el listado de la tabla
    -------------------------------------*/

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.getData();
      }
    })

 }


 changeState(e:any){

  if(e.target.checked){

    const data = {'active':1}

    this.branchService.patchData(e.target.id.split("_")[1], data, localStorage.getItem('token'))
    .subscribe(

      ()=>{
        this.getData();
      }

    )

   }else {

    const data = {'active':0}

    this.branchService.patchData(e.target.id.split("_")[1], data, localStorage.getItem('token'))
    .subscribe(

      ()=>{
        this.getData();
      }
     )
  }
 }


 /*=============================================
	función para llamar el diálogo de edición de bRANCHS
	=============================================*/

	editBranchs(id:string){

		const dialogRef = this.dialog.open(EditBranchComponent,{

			width:'100%',
			data: { id: id	}

		})

		/*=============================================
		Actualizar el listado de la tabla
		=============================================*/

		dialogRef.afterClosed().subscribe(result =>{

			if(result){

				this.getData();

			}

		})

	}


/**
 * Funcion para llamar el dialogo de Eliminar BrANCHS
 */
  deleteCategory(id: string) {
    alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
		.then((result) => {

			if (result.isConfirmed) {

				/*=============================================
				Validar que la categoría no tenga EN OTRO Proceso asociado
				=============================================*/
			//	this.subgoriesService.getFilterData("category", name)
         console.log("Proceso")
      }

      })
  }

}


