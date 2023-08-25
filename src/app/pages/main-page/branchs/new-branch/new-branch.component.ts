import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { BranchsService } from 'src/app/services/branchs.service';
import { Ibranch } from 'src/app/interface/ibranch';
import { alerts } from 'src/app/helpers/alerts';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-branch',
  templateUrl: './new-branch.component.html',
  styleUrls: ['./new-branch.component.css']
})
export class NewBranchComponent implements OnInit {

	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public f = this.form.group({

   active:1,
	 colony:['', Validators.required],
   country:'',
   cp:0,
   idbra : 0,
	 id_empresa:0,
	 id_state:0,
	 iva:0,
   locality:['', Validators.required],
	 municipality:'',

   name:['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],

   number_exterior:[0, [Validators.required, Validators.pattern('[0-9]*')]],

   number_interior:0,
   street: ''
	} )

  urlin="";

  /*-------------------------
    Validacion Personalizada
   --------------------------*/
   get colony() { return this.f.controls.colony}
   get name() { return this.f.controls.name }

  /*=============================================
	Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

  /*----------------------------
    Variable para preCarga
   ----------------------------*/

  loadData = false;

  constructor( private form: FormBuilder, private branchsService: BranchsService,
    public dialogRef: MatDialogRef<NewBranchComponent> ) { }

  ngOnInit( ): void {
  }

/*-------------------------
Funcion Save Branch
--------------------------*/

saveBranch(){

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

  const dataBranch: Ibranch = {

       active          : 1,
       idbra           : this.f.controls.idbra.value ?? 0 + 1,
       colony          : this.f.controls.colony.value ?? '',
       country         : 'MX',
       cp              : this.f.controls.cp.value ?? 0,
       id_company      :'0',
       state          :'',
	  	 locality       : this.f.controls.locality.value ?? '',
    	 name           : this.f.controls.name.value ?? '',
    	 street          : this.f.controls.street.value ?? ''

     }

        /*=============================================
				Guardar en base de datos la info de la categoría
				=============================================*/

				this.branchsService.postData(dataBranch, localStorage.getItem('token')).subscribe(

          resp=>{

              this.dialogRef.close('save')

              alerts.basicAlert("Ok", 'The category has been saved', "success")


          },
          err=>{

            alerts.basicAlert("Error", 'Category saving error', "error")

          })

          this.loadData = false;

  }

	invalidField(field:string){

		return functions.invalidField(field, this.f, this.formSubmitted);

	}

	/*=============================================
	Validamos que el nobre de la sucursal no se repita
	=============================================*/

  isRepeatName(){

		return(control: AbstractControl ) =>{

			const names = control.value;
      console.log("valorde names",names)

			return new Promise((resolve)=>{

				this.branchsService.getFilterData("name", names).subscribe(

					resp =>{

						if(Object.keys(resp).length > 0){

              console.log("respuesta", -resp)
							resolve({branch: true})

						}else{
              console.log("error", resp);
              resolve({branch: false})
						}

					}

				)

			})

		}


	}




}
