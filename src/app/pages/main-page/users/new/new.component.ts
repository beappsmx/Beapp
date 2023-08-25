import { Component, Inject,  OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Iusers } from 'src/app/interface/iusers';
import { Icompany } from 'src/app/interface/icompany';
import { Ibranch } from 'src/app/interface/ibranch';
import { Iproject } from 'src/app/interface/iproject';

import { UsersService } from '../../../../services/users.service';
import { CompanysService } from 'src/app/services/companys.service';
import { BranchsService } from 'src/app/services/branchs.service';
import { ProjectService } from 'src/app/services/project.service';

import { StoragesService } from 'src/app/services/storages.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { AuthService } from 'src/app/services/auth.service';

import { alerts } from 'src/app/helpers/alerts';


import { environment } from 'src/environments/environment';
import { TrackingService } from '../../../../services/tracking.service';



@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  //@Input() fusuarios: FormGroup;

   selectedorganization: string = 'Organizations';

    organizationData  : any[]  = [] ;
    stateData         : any[]  = [] ;

    eml        : string = '' ;
    companyId  : string = '' ;
    branchId   : string = '' ;

   emailExists: boolean = false;

   selectedImage: File;
   imageUrl: string = environment.urlProfile

	/*=============================================
	Creamos grupo de controles
	=============================================*/

   	public fusuarios = this.formBuilder.group({
        active       :  1,
        iduser       :  0,
        age          :  [, [Validators.required, Validators.pattern('^(1[8-9]|[2-5][0-9]|6[0-9])$')]],
        country      :  ['', [Validators.required]],
        displayName  :  ['', [Validators.required]],
        emailu       :  ['email', [Validators.required, Validators.email]],
        method       :  '',
        passnew      :  ['', [Validators.required]],
        phone        :  ['',  [Validators.required, Validators.pattern(/^\d{10}$/)]],
        picture      :  environment.urlProfile,
        position     :  ['', Validators.required],
        organization :  '',

       } )

       get agef()       { return this.fusuarios.get('age') }
       get namef()      { return this.fusuarios.get('displayName') }
       get countryfu()  { return this.fusuarios.get('country')}
       get positionfu() { return this.fusuarios.get('position') }


       public fcompanys = this.formBuilder.group({
          addressc      :  '',
          cityc         :  ['', [Validators.required]],
          countryc      :  ['', [Validators.required]],
          displayNamec  :  ['', [Validators.required]],
          emailc        :  ['', [Validators.required, Validators.email]],
          formatrep     :  ['', [Validators.required]],
          phonec        :  ['',  [Validators.required, Validators.pattern(/^\d{10}$/)]],
          picturec      :  environment.urlProfile,
          rfcc          :  ['', Validators.required],
          state         :  '',

       } )
       get namefc()    { return this.fcompanys.get('displayNamec') }
       get cityfc()    { return this.fcompanys.get('cityc')}
       get countryfc() { return this.fcompanys.get('countryc')}


     public fbranchs = this.formBuilder.group({
         localityb    :  ['', [Validators.required]],
         colonyb      :  '',
         countryb     :  ['Mexico',],
         cpb          :  '',
         dnameb       :  ['', [Validators.required]],
         stateb       :  '',
         streetb      : '',
     } )


    public fprojects = this.formBuilder.group({
      codep        : ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Z0-9]{3,}')]],
      contractp    : ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Z0-9]{3,}'), Validators.required]],
      descriptionp : ['', [Validators.required]],
      imagep       : '',
      tenderp      : ['', [Validators.required]],
      ubicationp   : '',
      dStart       : [new Date(), Validators.required], // Asignar un objeto Date por defecto y validación requerida
      dEnd         : [new Date(), Validators.required], // Asignar un objeto Date por defecto y validación requerida
      });

      /*=============================================
    	  Variable que valida el envío del formulario
    	=============================================*/

    	formSubmitted = false;

      /*----------------------------
        Variable para preCarga
       ----------------------------*/

      loadData = false;
      url : string = '' ;

  constructor(private storageService: StoragesService, private usersService :UsersService, private companysService :CompanysService,
               private branchsService: BranchsService, private projectsService : ProjectService ,
               private catalogsService: CatalogService, private authService: AuthService,
               private formBuilder: FormBuilder,  public dialogRef: MatDialogRef<NewComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit( ): void {


      if (this.data.formType === 'fcompanys')  {
          this.getStates();
      }

      if (this.data.formType === 'fbranchs') {
        this.companyId = this.data.companyId;
          this.getStates();
      }

      if (this.data.formType === 'fprojects') {
        this.branchId  = this.data.branchId ;
          this.getStates();
      }

      if (this.data.formType === 'fusuarios'){
          this.getOrganizations();
      }

  }


      getOrganizations(){
        this.catalogsService.getdataOrganization().subscribe(( orga) => {
          this.organizationData = Object.values(orga)
         })
        }

      getStates(){
        this.catalogsService.getdataStates().subscribe(( state) => {
          this.stateData = Object.values(state)
         // console.log(this.stateData)
         })
        }

          /*=========================
            Para las fotos Usuarios
          ========================== */
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
                this.fusuarios.patchValue({ picture: url }); // Actualizar el valor del control 'picture' con la URL de la imagen
            })
            .catch(error => console.log("Error uploading file", error));
        }


       saveUsers(){

        if (this.fusuarios.valid) {
          console.log(this.fusuarios.value)
        }else{
          this.fusuarios.markAllAsTouched();
        }

        this.loadData = true;

        this.formSubmitted = true;

              /*------------------------------
               Validamos que el formulario este correcto
              -----------------------*/

              /*=============================================
              Validamos y capturamos la informacion del formulario en la interfaz
              =============================================*/
                 const dataUser: Iusers = {
                        active         : 1,
                        iduser         : 0,
                        method         : '',
                        age            : this.fusuarios.get('age')?.value,
                        country        : this.fusuarios.get('country')?.value,
                        displayName    : this.fusuarios.get('displayName').value ,
                        emailu         : this.fusuarios.get('emailu').value ,
                        password       : this.fusuarios.get('passnew').value ,
                        phone          : this.fusuarios.get('phone').value,
                        picture        : this.fusuarios.get('picture').value,
                        position       : this.fusuarios.get('position').value,
                        organization   : this.fusuarios.get('organization').value
                    }

                    const email = this.fusuarios.controls.emailu.value ?? '';

                    this.loadData = false;

                      this.usersService.checkIfDataExists(email).subscribe(dataExists => {
                        if (dataExists) {
                          alerts.basicAlert("Error", 'The User exist', "error")
                        } else {
                                this.usersService.postData(dataUser, localStorage.getItem('token')).subscribe(
                                  resp=>{
                                         this.dialogRef.close('save')
                                          alerts.basicAlert("Ok", 'The User has been saved', "success")
                                          this.authService.register(this.fusuarios.get('emailu').value, this.fusuarios.controls.passnew.value);

                                  },
                                       err=>{
                                         alerts.basicAlert("Error", 'User saving error', "error")
                                       })
                        }
                      });
       }


       saveCompanys(){

            if (this.fcompanys.valid) {
              console.log(this.fcompanys.value)
            }else{
              this.fcompanys.markAllAsTouched();
            }

            this.loadData = true;

            this.formSubmitted = true;

                  /*------------------------------
                   Validamos que el formulario este correcto
                  -----------------------*/

              /*=============================================
              Validamos y capturamos la informacion del formulario en la interfaz
              =============================================*/
                 const dataCompany  : Icompany = {
                        address     : this.fcompanys.get('addressc')?.value,
                        city        : this.fcompanys.get('cityc').value,
                        country     : this.fcompanys.get('countryc').value,
                        displayName : this.fcompanys.get('displayNamec').value ,
                        email       : this.fcompanys.get('emailc')?.value ,
                        phone       : this.fcompanys.get('phonec')?.value,
                        picture     : this.fcompanys.get('picturec')?.value,
                        formatrep   : this.fcompanys.get('formatrep')?.value,
                        rfc         : this.fcompanys.get('rfcc')?.value,
                        state       : this.fcompanys.get('statec')?.value
                    }

                    this.loadData = false;

                    this.companysService.postData(dataCompany, localStorage.getItem('token')).subscribe( resp=>{

                          this.dialogRef.close('save')
                          alerts.basicAlert("Ok", 'The company has been saved', "success")
                    }),
                      err=>{
                             alerts.basicAlert("Error", 'Company saving error', "error")
                           }

        }

        saveBranchs(){


          if (this.fbranchs.valid) {
            console.log(this.fbranchs.value)

          }else{
            this.fbranchs.markAllAsTouched();
          }

          this.loadData = true;

          this.formSubmitted = true;

                /*------------------------------
                 Validamos que el formulario este correcto
                -----------------------*/

            /*=============================================
            Validamos y capturamos la informacion del formulario en la interfaz
            =============================================*/
               const dataBranch   : Ibranch = {
                     active      : 1,
                     colony      : this.fbranchs.get('colonyb')?.value,
                     country     : this.fbranchs.get('countryb')?.value,
                     cp          : parseInt(this.fbranchs.get('cpb')?.value, 10),
                     idbra       : 0,
                     id_company  : this.companyId,
                     locality    : this.fbranchs.get('localityb')?.value,
                     name        : this.fbranchs.get('dnameb')?.value ,
                     state       : this.fbranchs.get('stateb')?.value,
                     street      : this.fbranchs.get('streetb')?.value,
                  }

                  this.loadData = false;

                  this.branchsService.postData(dataBranch, localStorage.getItem('token')).subscribe( resp=>{

                        this.dialogRef.close('save')
                        alerts.basicAlert("Ok", 'The Branch has been saved', "success")
                  }),
                    err=>{
                           alerts.basicAlert("Error", 'Branch saving error', "error")
                         }

        };

        saveProjects(){



                      console.log(this.fprojects)

                      this.loadData = true;

                      this.formSubmitted = true;

                           const dataProject : Iproject = {

                                 code         : this.fprojects.get('codep')?.value,
                                 contract     : this.fprojects.get('contractp')?.value,
                                 description  : this.fprojects.get('descriptionp')?.value,
                                 id_branch    : this.branchId,
                                 image        : this.url,
                                 tender       : this.fprojects.get('tenderp')?.value,
                                 ubication    : this.fbranchs.get('ubicationp')?.value,
                                 dStart       : this.fprojects.get('dStart')?.value as Date,
                                 dEnd         : this.fprojects.get('dEnd')?.value as Date

                              }

                              this.loadData = false;
                              console.log(dataProject)

                              this.projectsService.postData(dataProject, localStorage.getItem('token')).subscribe( resp=>{

                                    this.dialogRef.close('save')
                                    alerts.basicAlert("Ok", 'The Project has been saved', "success")
                              }),
                                err=>{
                                       alerts.basicAlert("Error", 'Project saving error', "error")
                                     }


      }


        invalidField(field:string){
            return functions.invalidField(field, this.fusuarios, this.formSubmitted);

        }


        checkEmailExists() {

          const emailread = this.fusuarios.controls.emailu.value;

          if (emailread) {

               this.usersService.checkIfDataExists(emailread).subscribe( dataExists => {

                if (dataExists) {

                      this.emailExists = dataExists ;

                    }else {

                        this.emailExists = false ;
                   }

                });

              }

        }



}







