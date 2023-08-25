import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { Iusers } from 'src/app/interface/iusers';

import { UsersService } from '../../../../services/users.service';
import { StoragesService } from 'src/app/services/storages.service';
import { CatalogService } from 'src/app/services/catalog.service';

import { environment } from 'src/environments/environment';
import { alerts } from 'src/app/helpers/alerts';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogData } from '../../branchs/edit-branch/edit-branch.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  selectedorganization: string = '';

  organizationData     : any[]  = [] ;

  emailExists: boolean = false;

  isInputDisabled = true;

  eml : string = '' ;

  emailExistsError = false;
	/*=============================================
	Creamos grupo de controles
	=============================================*/


	public fus = this.formbuilder.group({

    active       :  1,
    iduser       :  0,
    age          :  [, [Validators.required, Validators.pattern('^(1[8-9]|[2-5][0-9]|6[0-9])$')]],
    country      :  ['', [Validators.required]],
    displayName  :  ['', [Validators.required]],
    emailu       :  {value: 'email', disabled:true},
    method       :  '',
    passnew      :  {value :'', disabled:true },
    phone        :  ['',  [Validators.required, Validators.pattern(/^\d{10}$/)]],
    picture      :  '',
    position     :  ['', Validators.required],
    organization :  '',

   } )

   get activef()       { return this.fus.get('active') }
   get iduserf()       { return this.fus.get('iduser') }
   get agef()          { return this.fus.get('age') }
   get countryf()      { return this.fus.get('country')}
   get namef()         { return this.fus.get('displayName') }
   get emailf()        { return this.fus.get('emailu') }
   get methodf()       { return this.fus.get('method') }
   get passnewf()      { return this.fus.get('passnew') }
   get phonef()        { return this.fus.get('phone') }
   get picturef()      { return this.fus.get('picture') }
   get positionf()     { return this.fus.get('position') }
   get organizationf() { return this.fus.get('organization') }

  /*=============================================
	  Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

  /*----------------------------
    Variable para preCarga
   ----------------------------*/

  loadData = false;
  url : string = '';
  imageUrl: string = '';
  pass : '' ;

  constructor( private storageService: StoragesService,  private usersService :UsersService, private catalogsService: CatalogService,
    private formbuilder: FormBuilder, public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData ) { }

  ngOnInit( ): void {

   //Aqui inicializo con el item que voy a editar

     this.usersService.getItem(this.data.id).subscribe(
        (resp: any)=> {

              this.imageUrl = resp.picture ;
              this.activef.setValue(resp.active);
              this.iduserf.setValue(resp.iuser);
              this.namef.setValue(resp.displayName);
              this.agef.setValue(resp.age);
              this.countryf.setValue(resp.country);
              this.emailf.setValue(resp.emailu);
              this.methodf.setValue(resp.method);
              this.passnewf.setValue(resp.password);
              this.phonef.setValue(resp.phone);
              this.picturef.setValue(resp.picture);
              this.positionf.setValue(resp.position);
              this.organizationf.setValue(resp.organization);
        }

     )

     this.getOrganizations();

  }

  onSelectOrganization(): void {

   //  console.log('Organizations', this.selectedorganization)

  }


  getOrganizations(){
    this.catalogsService.getdataOrganization().subscribe(( orga) => {
      this.organizationData = Object.values(orga)
     })
    }


 /*=========================
    Para las fotos
  ========================== */
  selectedImage: File;



uploadImage($event: any) {

  this.eml = this.fus.get('emailu').value ;

  const file = $event.target.files[0];

  this.selectedImage = file;

  const path = `images/${this.eml}${file.name}`;



  if (!file) {
    this.imageUrl = ''; // No hay imagen seleccionada, establecemos la URL vacía
    return;
  }

  this.storageService.uploadFile(file, path)
    .then(url => {
        this.url = url;
        this.imageUrl = this.storageService.getObjectURL(this.selectedImage); // Almacenar la URL de la imagen seleccionada
        this.fus.patchValue({ picture: url }); // Actualizar el valor del control 'picture' con la URL de la imagen
    })
    .catch(error => console.log("Error uploading file", error));
}



  editUsers(){

    this.loadData = true;

    this.formSubmitted = true;

    /*------------------------------
     Validamos que el formulario este correcto
    -----------------------*/

    /*=============================================
    Validamos y capturamos la informacion del formulario en la interfaz
    =============================================*/

    const email = this.fus.get('emailu').value;

              const dataUser: Iusers = {
              active         : 1,
              iduser         : 0,
              method         : '',
              age            : this.fus.get('age').value ,
              country        : this.fus.get('country').value,
              displayName    : this.fus.get('displayName').value,
              emailu         : email,
              password       : this.fus.get('passnew').value,
              phone          : this.fus.get('phone').value,
              picture        : this.fus.get('picture').value,
              position       : this.fus.get('position').value,
              organization   : this.fus.get('organization').value
          }

          this.loadData = false;

          /*=============================================
          Guardar en base de datos la info de la categoría
          =============================================*/
               this.usersService.patchData(this.data.id, dataUser, localStorage.getItem('token')).subscribe(
               resp=>{
                        this.dialogRef.close('save')
                         alerts.basicAlert("Ok", 'The User has been saved', "success")
                      },
                      err=>{

                        alerts.basicAlert("Error", 'User saving error', "error")

                      })

            }


    invalidField(field:string){
        return functions.invalidField(field, this.fus, this.formSubmitted);

    }


}

