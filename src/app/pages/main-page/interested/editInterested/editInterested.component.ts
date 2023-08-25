import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Iinteres } from 'src/app/interface/interested';
import { StoragesService } from 'src/app/services/storages.service';
import { InteresService } from 'src/app/services/interes.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { environment } from 'src/environments/environment';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';

import { TrackingService } from 'src/app/services/tracking.service';

import { IDialogData } from '../../branchs/edit-branch/edit-branch.component';

@Component({
  selector: 'app-editInterested',
  templateUrl: './editInterested.component.html',
  styleUrls: ['./editInterested.component.css']
})
export class EditInterestedComponent implements OnInit {

  numbers: number[] = [1, 2, 3, 4, 5];
  n1                   : number;
  n2                   : number;
  n3                   : number;
  selectedNumber: number;
  selectedorganization: string = '';
  organizationData: any[] = [];
  eml: string = '';
  panelOpenState = false;
  /*=============================================
  Creamos grupo de controles
  =============================================*/
  public fis = this.formBuilder.group({

    active      :   1,
    avg         :   5,
    email       :   ['', [Validators.required, Validators.email]],
    follow      :   ['', Validators.required],
    idinter     :   0,
    interes     :   0,
    influence   :   0,
    name        :   ['', [Validators.required]],
    phone       :   ['', [Validators.required]],
    picture     :   environment.urlProfile,
    position    :   ['', Validators.required],
    power       :   0,
    organization:   '',
    role        :   ['', Validators.required],
  })
  get active()       { return this.fis.get('active')       }
  get avg()           { return this.fis.get('avg')          }
  get email()         { return this.fis.get('email')        }
  get follow()        { return this.fis.get('follow')       }
  get idinter()       { return this.fis.get('idinter')       }
  get interes()       { return this.fis.get('interes')      }
  get influence()     { return this.fis.get('influence')    }
  get name()          { return this.fis.get('name')         }
  get phone()         { return this.fis.get('phone')        }
  get picture()       { return this.fis.get('picture')      }
  get position()      { return this.fis.get('position')     }
  get power()         { return this.fis.get('power')        }
  get organization()  { return this.fis.get('organization') }
  get role()          { return this.fis.get('role')         }

  /*=============================================
    Variable que valida el envío del formulario
  =============================================*/

  formSubmitted = false;

  /*----------------------------
    Variable para preCarga
  ----------------------------*/

  loadData = false;
  url: string = '';
  imageUrl: string = '';

  constructor(
    private storageService: StoragesService,
    private interesService: InteresService,
    private catalogServices: CatalogService,
    private trackingServices : TrackingService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditInterestedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData)   { }

  ngOnInit(): void {

    //Aqui inicializo con el item que voy a editar
    this.interesService.getItem(this.data.id).subscribe(
      (resp: any) => {
        this.imageUrl = resp.picture;
        this.active.setValue(resp.active)
        this.avg.setValue(resp.avg);
        this.email.setValue(resp.email);
        this.follow.setValue(resp.follow);
        this.idinter.setValue(resp.idinter);
        this.interes.setValue(resp.interes);
        this.influence.setValue(resp.influence);
        this.name.setValue(resp.name);
        this.phone.setValue(resp.phone);
        this.picture.setValue(resp.picture);
        this.position.setValue(resp.position);
        this.power.setValue(resp.power);
        this.organization.setValue(resp.organization);
        this.role.setValue(resp.role);

      }

    )
    this.getOrganizations();
  }
  onSelectOrganization(): void {
    console.log('Organizations', this.selectedorganization)
  }
  getOrganizations() {
    this.catalogServices.getdataOrganization().subscribe((orga) => {
      this.organizationData = Object.values(orga)
    })
  }

  calcularAvg() : number {
    this.n1 = Number(this.fis.controls['interes'].value);
    this.n2 = Number(this.fis.controls['influence'].value);
    this.n3 = Number(this.fis.controls['power'].value);
    return this.n1 + this.n2 + this.n3;
  }
  /*=========================
    Para las fotos
  ========================== */
  selectedImage: File;

  uploadImage($event: any) {
    this.eml = this.fis.get('email').value;
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
      this.fis.patchValue({ picture: url }); // Actualizar el valor del control 'picture' con la URL de la imagen
    })
    .catch(error => console.log("Error uploading file", error));
  }


  editInteres() {
    this.loadData = true;
    this.formSubmitted = true;
    /*=============================================
    Validamos y capturamos la informacion del formulario en la interfaz
    =============================================*/

    const email = this.fis.get('email').value;

    const dataInteres: Iinteres = {
      active         : 1,
      avg            : this.calcularAvg(),
      company        : this.trackingServices.getCompany(),
      branch         : this.trackingServices.getBranch(),
      id_project     : this.trackingServices.getProject(),
      email          : this.fis.get('email')?.value,
      follow         : this.fis.get('follow')?.value,
      idinter        : this.fis.get('idinter')?.value,
      interes        : this.fis.get('interes')?.value,
      influence      : this.fis.get('influence')?.value,
      name           : this.fis.get('name')?.value,
      phone          : this.fis.get('phone')?.value,
      picture        : this.fis.get('picture')?.value,
      position       : this.fis.get('position')?.value,
      power          : this.fis.get('power')?.value,
      organization   : this.fis.get('organization')?.value,
      role           : this.fis.get('role')?.value
    }

    this.loadData = false;

    /*=============================================
    Guardar en base de datos la info de la categoría
    =============================================*/
    console.log("pase por el patchData", dataInteres)

    this.interesService.patchData(this.data.id, dataInteres, localStorage.getItem('token')).subscribe(
      resp => {
        this.dialogRef.close('save')
        alerts.basicAlert("Ok", 'The User has been saved', "success")
      },
      err => {

        alerts.basicAlert("Error", 'User saving error', "error")

      })
  }

  invalidField(field: string) {
    return functions.invalidField(field, this.fis, this.formSubmitted);

  }
}
