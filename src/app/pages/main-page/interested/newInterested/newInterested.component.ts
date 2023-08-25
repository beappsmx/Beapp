import { Component, OnInit, Inject } from '@angular/core';
import { functions } from 'src/app/helpers/functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Iinteres } from 'src/app/interface/interested';

import { StoragesService } from 'src/app/services/storages.service';
import { InteresService } from 'src/app/services/interes.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { environment } from 'src/environments/environment';

import { alerts } from 'src/app/helpers/alerts';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-newInterested',
  templateUrl: './newInterested.component.html',
  styleUrls: ['./newInterested.component.css'],

})
export class NewInterestedComponent implements OnInit {


   numbers              : number[] = [1, 2, 3, 4, 5];
   n1                   : number;
   n2                   : number;
   n3                   : number;
   selectedNumber       : number;
   interes              : number;
   influence            : number;
   power                : number;
   selectedorganization : string = 'Organization';
   organizationData     : any[]  = [] ;
   panelOpenState = false;
	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public fis = this.formBuilder.group({

      active       : 1,
      avg          : 0,
      email        : ['', [Validators.required, Validators.email]],
      follow       : ['', Validators.required],
      iduser       : 0,
      interes      : [0, Validators.required],
      influence    : [0, Validators.required],
      name         : ['', [Validators.required]],
      phone        : ['', [Validators.required]],
      picture      : environment.urlProfile,
      position     : ['', Validators.required],
      power        : [0, Validators.required],
      organization : '',
      role         : ['', Validators.required],
   } )

    //get interes()   { return this.fis.controls['sinteres'] }

  /*=============================================
	  Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

  /*----------------------------
    Variable para preCarga
   ----------------------------*/

  loadData = false;
  url : string = '' ;

  constructor(
    private storageService: StoragesService,
    private interesService : InteresService,
    private catalogServices: CatalogService,
    private trackingService: TrackingService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewInterestedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {
        this.selectedNumber = this.numbers[0]}

  ngOnInit(): void {

    /*puedo ver o escuchar un evento del form
    this.name.valueChanges
    .subscribe(value => {
       console.log(value)
    })  */

    this.getOrganizations();
    console.log(this.data.lastid);
  }

  // onSelectOrganization(): void {
  //   console.log('Id Company ->', this.selectedorganization);
  //   this.getOrganizations();
  // }
  calcularAvg() : number {
    this.n1 = Number(this.fis.controls['interes'].value);
    this.n2 = Number(this.fis.controls['influence'].value);
    this.n3 = Number(this.fis.controls['power'].value);
    return this.n1 + this.n2 + this.n3;
  }

  getOrganizations(){
    this.catalogServices.getdataOrganization().subscribe(( orga) => {
      this.organizationData = Object.values(orga)
    });
  }

  /*=========================
    Para las fotos
  ========================== */
  selectedImage: File;
  imageUrl: string = environment.urlProfile

  uploadImage($event: any) {
  const file = $event.target.files[0];

  this.selectedImage = file;

  const path = `images/${this.storageService.generateRandom()}${file.name}`;

  if (!file) {
    this.imageUrl = ''; // No hay imagen seleccionada, establecemos la URL vacía
    return;
  }

  this.storageService.uploadFile(file, path)
    .then(url => {
        this.url = url;
        this.imageUrl = this.storageService.getObjectURL(this.selectedImage); // Almacenar la URL de la imagen seleccionada
        this.fis.patchValue({ picture: url }); // Actualizar el valor del control 'picture' con la URL de la imagen
    })
    .catch(error => console.log("Error uploading file", error));
}



  saveInteres() {
    if (this.fis.valid) {
      //console.log(this.fis.value)
    }else{
      this.fis.markAllAsTouched();
    }

    this.loadData = true;

    this.formSubmitted = true;

    /*------------------------------
     Validamos que el formulario este correcto
    -----------------------*/

    /*=============================================
    Validamos y capturamos la informacion del formulario en la interfaz
    =============================================*/
       const dataInteres: Iinteres = {
              active       : 1,
              avg          : this.calcularAvg() ?? 0,
              branch       : this.trackingService.getBranch(),
              company      : this.trackingService.getCompany(),
              email        : this.fis.controls.email.value ?? '',
              follow       : this.fis.controls.follow.value ?? '',
              idinter      : this.data.lastid + 1,
              interes      : this.fis.controls.interes.value ?? 0,
              influence    : this.fis.controls.influence.value ?? 0,
              name         : this.fis.controls.name.value ?? '',
              phone        : this.fis.controls.phone.value ?? '',
              picture      : this.fis.controls.picture.value ?? '',
              position     : this.fis.controls.position.value ?? '',
              id_project   : this.trackingService.getProject(),
              power        : this.fis.controls.power.value ?? 0,
              organization : this.fis.controls.organization.value ?? '',
              role         : this.fis.controls.role.value ?? ''
         }

          const email = this.fis.controls.email.value ?? '';

          this.loadData = false;

          this.interesService.postData(dataInteres, localStorage.getItem('token')).subscribe(
            resp=>{
                    this.dialogRef.close('save')
                    //alerts.basicAlert("Ok", 'The User has been saved', "success")

            },
                  err=>{
                    alerts.basicAlert("Error", 'User saving error', "error")
                  })

  }

  invalidField(field:string){
    return functions.invalidField(field, this.fis, this.formSubmitted);

}

}
