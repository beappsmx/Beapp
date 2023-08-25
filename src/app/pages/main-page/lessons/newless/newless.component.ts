import { Component, Inject,  OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { alerts } from 'src/app/helpers/alerts';

import { Ilessons } from 'src/app/interface/ilessons';
import { Ilearned } from 'src/app/interface/ilearned';

import { CommunicationsService } from 'src/app/services/communications.service';

import { TraductorService } from 'src/app/services/traductor.service';
import { TrackingService } from 'src/app/services/tracking.service';

import { LessonsService } from 'src/app/services/lessons.service';
import { LessonslearnedService } from 'src/app/services/lessonslearned.service';
import { ConceptsService } from 'src/app/services/concepts.service';

import { FirebaseService } from 'src/app/services/firebase.service';

import { StoragesService } from 'src/app/services/storages.service';

@Component({
  selector: 'app-newless',
  templateUrl: './newless.component.html',
  styleUrls: ['./newless.component.css']
})
export class NewlessComponent implements OnInit {

  faseOptions = ['Inicio', 'Planeación', 'Ejecución', 'Monitoreo y control', 'Cierre'];

  interestedList  : any[] = [];
  conceptsList    : any[] = [];
  selectedInteres : any[] = [];

  selectedFile: File | null = null;

  availableUsers  : any[];

  selectedInterested: { name: string; email: string; }[] = [];

  selectedValue: string;

  formSubmitted = false;

  loadData = false;

  url : string = '' ;
  url2 : string = '' ;

  public flessons = this.formBuilder.group({
    active     :  1,
    details    : [, [Validators.required]],
    meeting    :  '',
    place      :  [, [Validators.required]],
    datep      :  '',
    timep      :  ['',[Validators.required]],
    typemeeting  : '',
    file       :  ''

 } )


 public flearned = this.formBuilder.group({
   active          :  1,
   people          : [, [Validators.required]],
   concept         :  '',
   reference       :  [, [Validators.required]],
   stage           :  '',
   phase           : '' ,
   procces         : ['',[Validators.required]],
   technology      : ['',[Validators.required]],
   event           : ['',[Validators.required]],
   lessonlearned   : ['',[Validators.required]],
   conseqp         : ['',[Validators.required]],
   conseqn         : ['',[Validators.required]],
   actionsf        : ['',[Validators.required]],
} )


  constructor(private trackingService: TrackingService,
      private translateService     : TraductorService,
      private communicationservice : CommunicationsService,
      private lessonsService       : LessonsService,
      private conceptsService      : ConceptsService,
      private lessonlearnedService : LessonslearnedService,
      private firebaseService      : FirebaseService,
      private formBuilder: FormBuilder,
      private storage: StoragesService,
      public dialogRef: MatDialogRef<NewlessComponent >,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

        if (this.data.formType === 'flessons')  {
            this.getInterest();
        }

         if (this.data.formType === 'flearned')  {

             this.getDetailslessons('correcionId');

             this.getConceptsxActiv() ;
        }

  }

 getDetailslessons(id: string){
  this.lessonsService.getDatadetailsLessons(id)
  .subscribe((dataInteres : any) => {
    this.interestedList = dataInteres;

  })

 }

 getConceptsxActiv() {
    this.conceptsService.getDataConceptsxActivities(localStorage.getItem('project'))
      .subscribe(data => {

           this.conceptsList = data ;
           console.log("Data", data);
      });
 }

    getInterest() {
      //aqui qe pasar el id project que tengo los combo box
      this.communicationservice.getInterested(this.trackingService.getProject())
        .then(dataInteres => {
          this.interestedList = dataInteres;

        })
        .catch(error => {
          console.log('Error:', error);
        });
    }


 async saveLessons() {

    this.loadData = true;

    await this.uploadFile();

    this.formSubmitted = true;
      /*=============================================
      Validamos y capturamos la informacion del formulario en la interfaz
      =============================================*/
         const dataLessons  : Ilessons = {
                active      :  1,
                pos         : this.data.idpos + 1,
                datep       :  new Date(this.flessons.get('datep').value),
                details     :  this.flessons.get('details').value,
                id_project  :  this.trackingService.getProject() ,
                file        :  this.url ,
                place       :  this.flessons.get('place')?.value,
                typemeeting :  this.flessons.get('typemeeting')?.value,
                timep       :  this.flessons.get('timep')?.value
         }

               this.loadData = false;

            this.lessonsService.postData(dataLessons, localStorage.getItem('token')).subscribe(
              (resp: any) => {

                const savedKey = resp.key; // Obtener la clave asignada al guardar el registro

                // Guardar el detalle utilizando la clave
                this.saveToDetailInterested(savedKey);

                  alerts.basicAlert('Ok', 'The communication has been saved', 'success');

                  this.dialogRef.close('save');

                },
                    err=>{
                           alerts.basicAlert("Error", 'User saving error', "error")
                    }
             );

 }


 async saveLearned() {
  this.loadData = true;

  await this.uploadFile();
  await this.uploadFile2();

  this.formSubmitted = true;
    /*=============================================
    Validamos y capturamos la informacion del formulario en la interfaz
    =============================================*/
       const dataLearned  : Ilearned = {
              active        : 1,
              pos           : this.data.idposl + 1,
              people        : this.flearned.get('people').value,
              concept       : this.flearned.get('concept').value,
              lessonlearned : this.flearned.get('lessonlearned').value,
              evidenced     : this.url,
              signed        : this.url2,

              reference     : this.flearned.get('reference').value,
              stage         : this.flearned.get('stage').value,
              phase         : this.flearned.get('phase').value,
              procces       : this.flearned.get('procces').value,
              technology    : this.flearned.get('technology').value,
              event         : this.flearned.get('event').value,
              id_lesson     : 'CORRECIONID' ,
              consequencen  : this.flearned.get('conseqn').value,
              consequencep  : this.flearned.get('conseqp').value,
              actionspavoid : this.flearned.get('actionsf').value,
       }

             this.loadData = false;

             this.lessonlearnedService.postData(dataLearned, localStorage.getItem('token')).subscribe(
              (resp: any) => {

                  alerts.basicAlert('Ok', 'The Lesson Learned has been saved', 'success');

                  this.dialogRef.close('save');

                },
                    err=>{
                           alerts.basicAlert("Error", 'Learned saving error', "error")
                    }
             );

 }

   saveToDetailInterested(key: string) {
    // Recorrer el arreglo selectedInterested y agregar la clave correspondiente a cada nombre
    const fieldName = key; // Nombre del campo con nombre dinámico

     const details: any[] = this.selectedInterested.map(interest => {
       return {
         name     : interest.name,
         email    : 'email si se necesita',
         active : 1
       };
     });

     this.firebaseService.createDetailLessons(details, key)
         .then(()  => {

        // console.log('Details:', details);
       }
     )
  }


 onCheckboxChange(event: any) {
  const checked = event.target.checked;
  const tipoReunionControl = this.flessons.get('typemeeting');

  if (checked) {
    tipoReunionControl.setValue(event.target.id);
  } else {
    tipoReunionControl.setValue('');
  }
}

 addSelectedInterested() {
  const selectedInterElement = document.getElementById('selectedUsers') as HTMLSelectElement;

  const selectedValue = selectedInterElement.value;
  const selectedOption = selectedInterElement.options[selectedInterElement.selectedIndex];

  const selectedName = selectedOption.text;
  const selectedEmail = selectedValue;

  const selectedInterest = {
    name: selectedName,
    email: selectedEmail
  };
  this.selectedInterested.push(selectedInterest);

}

  removeSelectedInterested(index: number) {
    this.selectedInterested.splice(index, 1);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onFileSelected2(event: any) {
    this.selectedFile = event.target.files[0];
  }


  async uploadFile() {
    if (this.selectedFile) {
      try {
        const downloadUrl = await this.storage.uploadPdf(this.selectedFile);
        this.url = downloadUrl;
        console.log('Download this.url:', this.url);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  }


  async uploadFile2() {
    if (this.selectedFile) {
      try {
        const downloadUrl = await this.storage.uploadPdf(this.selectedFile);
        this.url2 = downloadUrl;

      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  }



}
