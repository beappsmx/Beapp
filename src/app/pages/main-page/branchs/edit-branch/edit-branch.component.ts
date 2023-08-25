import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { BranchsService } from 'src/app/services/branchs.service';
import { Ibranch } from 'src/app/interface/ibranch';
import { alerts } from 'src/app/helpers/alerts';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

export interface IDialogData{
	id:string;
}


@Component({
  selector: 'app-edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrls: ['./edit-branch.component.css']
})
export class EditBranchComponent implements OnInit {

/*=============================================
	Creamos grupo de controles
	=============================================*/

	public f = this.form.group({

    active:1,
    idbra : 0 ,
    colony:[''],
    country:[''],
    cp:0,
    id_empresa:0,
    id_state:0,
    locality:[''],
    municipality:[''],
    name:[''],
    number_exterior:0,
    number_interior:0,
    street:['']
   } )


   /*-------------------------
     Validacion Personalizada
    --------------------------*/
    get name() {return this.f.controls.name}
    get municipality() {return this.f.controls.municipality}
    get locality() {return this.f.controls.locality}
    get street() {return this.f.controls.street}
    get colony() {return this.f.controls.colony}
    get cp() {return this.f.controls.cp}
    get number_exterior() {return this.f.controls.number_exterior}
    get number_interior() {return this.f.controls.number_interior}

   /*=============================================
   Variable que valida el envío del formulario
   =============================================*/

   formSubmitted = false;

   /*----------------------------
     Variable para preCarga
    ----------------------------*/

   loadData = false;

   /*-----------------------------------
    * Defino las Variables para la edicion del form
    ------------------------------------*/

   constructor( private form: FormBuilder, private branchsService: BranchsService,
     public dialogRef: MatDialogRef<EditBranchComponent>,  @Inject(MAT_DIALOG_DATA) public data: IDialogData ) { }

   ngOnInit( ): void {

    //Aqui inicializo con el item que voy a editar

    this.branchsService.getItem(this.data.id)
		.subscribe(

			(resp:any)=>{

        this.name.setValue(resp.name)
        this.municipality.setValue(resp.municipality);
        this.locality.setValue(resp.locality);
        this.street.setValue(resp.street);
        this.colony.setValue(resp.colony);
        this.cp.setValue(resp.cp);
        this.number_exterior.setValue(resp.number_exterior);
        this.number_interior.setValue(resp.number_interior);
			}

		)

   }

 /*-------------------------
 Funcion Save Branch
 --------------------------*/

 editBranch(){

   this.loadData = true;

   this.formSubmitted = true;

     /*------------------------------
      Validamos que el formulario este correcto
      -----------------------*/
      if (this.f.invalid) {

          return;
      }

   /*=============================================
   Validamos y capturamos la informacion del formulario en la interfaz
   =============================================*/

    if (this.loadData==true) {
      const dataBranch: Ibranch = {

       active         : 1,
       idbra          : this.f.controls.idbra.value ?? 0,
       colony         : this.f.controls.colony.value ?? '',
       country        : 'MX',
       cp             : this.f.controls.cp.value ?? 0,
       id_company      :'0',
       state          :'VER',
       locality       : this.f.controls.locality.value ?? '',
       name           : this.f.controls.name.value?? '',
       street         : this.f.controls.street.value ?? '',
     }


     this.loadData = false;

         /*=============================================
         Guardar en base de datos la info de la Branch
         =============================================*/

         this.branchsService.patchData(this.data.id, dataBranch, localStorage.getItem('token')).subscribe(

           resp=>{

               this.dialogRef.close('save')

               alerts.basicAlert("Ok", 'The Branch has been Modified', "success")

           },
           err=>{

             alerts.basicAlert("Error", 'Branch saving error', "error")

           })

     }
  }


   invalidField(field:string){

     return functions.invalidField(field, this.f, this.formSubmitted);

   }

   /*=============================================
   Validamos que el nobre de la sucursal no se repita
   =============================================*/

   isRepeatName(){

     return(control: AbstractControl ) =>{

       const name = control.value;
       console.log(name)

       return new Promise((resolve)=>{

         this.branchsService.getFilterData(name, name).subscribe(

           resp =>{

             if(Object.keys(resp).length > 0){

               console.log(resp)
               resolve({branch: true})

             }else{
               resolve({branch:false})

             }

           }

         )

       })

     }


   }




 }


