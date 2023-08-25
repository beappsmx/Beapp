import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, Validators } from '@angular/forms';
import { alerts } from 'src/app/helpers/alerts';

import { TraductorService } from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { Imanfildet } from 'src/app/interface/imanfildet';

import { StoragesService } from 'src/app/services/storages.service';
import { ManagementService } from '../../../../services/management.service';

@Component({
  selector: 'app-editFile',
  templateUrl: './editFile.component.html',
  styleUrls: ['./editFile.component.css']
})
export class EditFileComponent implements OnInit {


      constructor(
        private trackingService: TrackingService,
        private translateService: TraductorService,
        private managementService: ManagementService,
        private formBuilder: FormBuilder,
        private storage: StoragesService,
        public dialogRef: MatDialogRef<EditFileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any // Cambia DialogData a any si no tienes una interfaz específica para los datos del diálogo
      ) {
         // Asegúrate de que profileId se está estableciendo correctamente
      }


    onNoClick(): void {
      this.dialogRef.close();
    }

    faseOptions = ['Version 1', 'Version 2', 'Version 3', 'Version 4', 'Version 5',
                   'Version 6', 'Version 7', 'Version 8', 'Version 9', 'Version 10'];

    filess : any[] = [];

    selectedFile: File | null = null;

    formSubmitted = false;

    loadData = false;

    url  : string = '' ;
    file : any ;

    initialFile : string = '' ;
    initialUrl  : string = '' ;

    public fmanage = this.formBuilder.group({
      date         : [''],
      description  : [''],
      name         : [, [Validators.required]],
      parent       : [''],
      version      : [''],
      url          : [''],

   } )


    ngOnInit() {

        //Aqui inicializo con el item que voy a editar
        this.managementService.getManfildetxid(this.data.id).subscribe(
          (resp: any) => {

            //console.log("resp", resp)

            // Almacenar los valores iniciales
            // Convertir la fecha a formato 'YYYY-MM-DD'
            let date = new Date(resp.date);
            let formattedDate = date.getUTCFullYear() + '-' + ('0' + (date.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + date.getUTCDate()).slice(-2);

            this.initialFile = resp.name;
            this.initialUrl = resp.url;

            this.fmanage.patchValue({
              date        : formattedDate,
              description : resp.description,
              name        : resp.name,
              parent      : resp.parent,
              version     : resp.version,
              url         : resp.url
            });
          }
        );

    }



   async saveManage() {

      this.loadData = true;

      await this.uploadFile();

      if (this.url == ''){
        this.url = this.initialUrl
      }

      this.formSubmitted = true;
        /*=============================================
        Validamos y capturamos la informacion del formulario en la interfaz
        =============================================*/
           const datafildet  : Imanfildet = {
                  date        :  new Date(this.fmanage.get('date').value),
                  description :  this.fmanage.get('description').value,
                  id_manage   :  this.data.profileId,
                  name        :  this.file,
                  parent      :  this.fmanage.get('parent')?.value,
                  version     :  this.fmanage.get('version')?.value,
                  url         :  this.url
           }


            this.loadData = false;

              this.managementService.patchDetail(this.data.id, datafildet, localStorage.getItem('token')).subscribe(
                (resp: any) => {

                  const savedKey = resp.key; // Obtener la clave asignada al guardar el registro

                    this.dialogRef.close('save');

                  },
                      err=>{
                             alerts.basicAlert("Error", 'User saving error', "error")
                      }
               );

   }


    onFileSelected(event: any) {
      this.selectedFile = event.target.files[0];
    }



    async uploadFile() {
      if (this.selectedFile) {
        try {
          const downloadUrl = await this.storage.uploadPdf(this.selectedFile);
          this.url = downloadUrl;
          this.file = this.selectedFile.name ;

         // console.log("this.selected", this.file)
        } catch (error) {
          console.error('Upload error:', error);
        }
      }
    }





  }
