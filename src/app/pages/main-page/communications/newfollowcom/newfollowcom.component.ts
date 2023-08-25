import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule} from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { CommunicationsComponent } from '../communications.component';

import { functions } from 'src/app/helpers/functions';
import { alerts } from 'src/app/helpers/alerts';
import { FormBuilder, Validators } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';


import { HttpClient } from '@angular/common/http';
import { MessagesService } from '../../../../services/messages.service';
import { CommunicationsService } from 'src/app/services/communications.service';
import { Idocumentscom } from 'src/app/interface/idocumentscom';

export interface DialogData {
  sDate: string;
}
@Component({
  selector: 'app-newfollowcom',
  templateUrl: './newfollowcom.component.html',
  styleUrls: ['./newfollowcom.component.css'],
})
export class NewfollowcomComponent {

  interestedDetail      : any[];
  archivosSeleccionados : Archivo[] = [];
  to                    : string;
  subject               : string = 'Seguimiento a Comunicacion';
  html                  : string;
  loadData              : boolean = false;
  formSubmitted         : boolean = false;
  filename              : string;
  numYear : string;
  numMonth : string;
  numDay : string;
  formDate: string;

  public fdocumentscom = this.formBuilder.group({
    active      : 1,
    date        : '',
    picture     : [, [Validators.required]],
    description : '',
  })

  constructor(
    public dialogRef: MatDialogRef<NewfollowcomComponent>,
    private storage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private MessagesService: MessagesService,
    private communicationsService: CommunicationsService,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    //this.interestedDetail = data.detailscom;
  }

  ngOnInit() {

    this.numYear  = this.data.sDate.getFullYear();
    this.numMonth = this.data.sDate.getMonth() + 1;
    this.numDay   = this.data.sDate.getDate();
    this.formDate = `${this.numYear}-${this.numMonth.toString().padStart(2, '0')}-${this.numDay.toString().padStart(2, '0')}`;
    this.buscarSubdetalle(this.data.id);

  }

  buscarSubdetalle(id: string) {
    this.communicationsService.buscarSubdetalle(id).subscribe(
      subdetalles => {
        if (subdetalles.length > 0) {
          console.log('Subdetalles:', subdetalles);
          // Realiza acciones con los subdetalles obtenidos
          this.interestedDetail = subdetalles;
        } else {
          console.log('No se encontraron subdetalles');
        }
      },
      error => {
        console.error('Error al buscar los subdetalles:', error);
      }
    );
  }

  adjuntarArchivos(event: any): void {

    const archivos: FileList = event.target.files;
    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];
      // Generar miniatura y obtener su URL
      const miniaturaUrl = URL.createObjectURL(archivo);

      // Guardar archivo en el almacenamiento (storage) y enviar por correo
      const filePath = `carpeta_archivos/${archivo.name}`;
      //const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, archivo);

      task.snapshotChanges().subscribe(() => {
        // Archivo subido correctamente, aquí puedes realizar acciones adicionales si es necesario
        // Por ejemplo, enviar el correo con el archivo adjunto utilizando el Trigger Email desde Firestore
        // Obtener el tamaño del archivo en bytes
        const tam = (archivo.size/1024);
        // Agregar archivo a la lista de archivos seleccionados para mostrar miniaturas
        this.archivosSeleccionados.push({
          nombre: archivo.name,
          thumbnailUrl: miniaturaUrl,
          fsize: tam.toFixed(3)
        });
      });
    }
  }

  saveFollow(){
    this.loadData = true;
    this.formSubmitted = true;
    this.filename = this.archivosSeleccionados.map(archivo => archivo.nombre).join(', ');

    /*=============================================
    Validamos y capturamos la informacion del formulario en la interfaz
    =============================================*/
    const dataDocumentsCom: Idocumentscom = {
      active            : 1,
      date              : this.formDate,
      picture           : this.filename ?? '',
      description       : this.fdocumentscom.controls.description.value ?? '',
      id_communication  : this.data.id,
    }

    this.communicationsService.postDocumentCom(dataDocumentsCom, localStorage.getItem('token')).subscribe(
    (resp: any) => { // Indicar que la respuesta es de tipo 'any'
      const savedKey = resp.key; // Obtener la clave asignada al guardar el registro
        alerts.basicAlert('Ok', 'The communication has been saved', 'success');

        this.dialogRef.close('save');
      },
      err=>{
        alerts.basicAlert("Error", 'User saving error', "error")
      }
    );

    // this.db.collection('mail').add({
    //   to: this.to,
    //   message:{
    //     subject: this.subject,
    //     html: this.html
    //   },
    // })
    // .then(() => {
    //   console.log('Registro agregado correctamente');
    //   // Restablece los campos del formulario
    //   this.to = '';
    //   this.subject = '';
    //   this.html = '';
    // })
    // .catch((error) => {
    //   console.error('Error al agregar el registro:', error);
    // });
  }
}
interface Archivo {
  nombre: string;
  thumbnailUrl: string;
  fsize: string;
}
