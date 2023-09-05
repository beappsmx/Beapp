import { Injectable, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { TrackingService } from 'src/app/services/tracking.service';

import { InteresService } from './interes.service';
import { LessonsService } from 'src/app/services/lessons.service';
import { LessonslearnedService } from 'src/app/services/lessonslearned.service';
import { FirebaseService } from './firebase.service';

import { EMPTY, forkJoin, map, mergeMap, of, switchMap, tap } from 'rxjs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Injectable({
  providedIn: 'root'
})
export class PrintreportsService {

  lessonsData$ : any[] ;

  learnedData$ : any[] ;

  combinedData$ : any[] ;

  masterDetail: any[] = [];

  masterData  : any[] = [] ;
  detailData: any[] = [];

constructor(public  trackingService       : TrackingService,
            private interesService        : InteresService,
            private lessonsService        : LessonsService,
            private lessonslearnedService : LessonslearnedService,
            private firebaseService       : FirebaseService,
            private http: HttpClient) { }


  listInterested() {

    let dataRows : any

    const headerRow = [
      { text: 'ID', style: 'headerCellBlue' },
      {text: 'Nombre', style: 'headerCellBlue' },
      {text: 'Organizacion', style: 'headerCellBlue' },
      {text: 'Puesto',  style: 'headerCellBlue' },
      {text: 'Telefono', style: 'headerCellBlue' },
      {text: 'Correo', style: 'headerCellBlue' },
      {text: 'Interes', style: 'headerCellBlue' },
      {text: 'Influencia', style: 'headerCellBlue' },
      {text: 'Poder', style: 'headerCellBlue' },
      {text: 'Ponderacion', style: 'headerCellBlue' },
      {text: 'Seguimiento', style: 'headerCellBlue' }];


      this.interesService
      .getDatacompInteres(this.trackingService.getProject(), this.trackingService.getformrepint())
      .subscribe(
        (data) => {
          const dataRows = data;
          console.log("DataRows", dataRows);
          const imagePath = this.trackingService.getpictureComp();
          this.downloadAndProcessImage(imagePath, headerRow, dataRows, 2);
        },
        (error) => {
          console.error(error);
        }
      );

  }




lessonslearnedOne() {
  let globalIndex = 1; // Índice consecutivo global

  const lessonId = 'correcionid'
  this.lessonsService.getDataLessonsOne(lessonId).pipe(
    switchMap(lessonsData => {
      this.lessonsData$ = Object.values(lessonsData); // Convert the master record to an array
      //console.log("Lecciones", this.lessonsData$);

      return this.lessonslearnedService.getDataLearned(lessonId);
    })

  ).subscribe(learnedData => {
    //console.log("Learned", learnedData);
    this.learnedData$ = learnedData;

    this.combinedData$ = this.learnedData$.map(detailRecord => {
      const detailArray = Object.values(detailRecord); // Convert the detail record to an array
      return [globalIndex++, ...this.lessonsData$, ...detailArray]; // Combine the master and detail arrays
    });

   // console.log("Combinado", this.combinedData$)

   /// para el reporte
   const imagePath = this.trackingService.getpictureComp();
      const headerRow = [
        {text: 'ID', style: 'headerCellBlue' },
        {text: 'Tipo Reunion', style: 'headerCellBlue' },
        {text: 'Lugar', style: 'headerCellBlue' },
        {text: 'Fecha', style: 'headerCellBlue' },
        {text: 'Hora', style: 'headerCellBlue' },
        {text: 'Leccion Aprendida', style: 'headerCellYellow' },
        {text: 'Persona', style: 'headerCellYellow' },
        {text: 'Fase', style: 'headerCellYellow' },
        {text: 'Proceso', style: 'headerCellYellow' }
      ];

      console.log("Combined Data", this.combinedData$);
      this.downloadAndProcessImage(imagePath, headerRow, this.combinedData$, 2)


  });
}




  lessonslearnedAll() {
    let globalIndex = 1; // Índice consecutivo global

    this.lessonsService.getDataLessonsAll(localStorage.getItem('project')).pipe(
      mergeMap(masterData => {
        const detailRequests = masterData.map((master, index) => {
          const lessonId = master[0];
          return this.lessonslearnedService.getDataLearned(lessonId).pipe(
            tap(detailsData => {
              // console.log("DetailData", detailsData);
            })
          );
        });

        return forkJoin(detailRequests).pipe(
          map(detailsData => {
            const combinedData = masterData.flatMap((master, index) => {
              const detailsArray = detailsData[index]; // All the records for this lessonId

              // Map the detailsArray to an array of rows with the desired fields
              const rows = detailsArray.map(details => [
                globalIndex++, // Índice consecutivo global
                master[1],
                master[2],
                master[3],
                master[4],
                details[0], // lessonlearned
                details[1], // people
                details[2], // phase
                details[3], // procces
              ]);

              return rows;
            });

            return combinedData;
          })
        );
      })
    ).subscribe(combinedData => {
     // console.log("CombinedData P1", combinedData);

      // Procesar los datos combinados aquí
      // Guardar los datos en una fuente de datos según tus necesidades

      const imagePath = this.trackingService.getpictureComp();
      const headerRow = [
        {text: 'ID', style: 'headerCellBlue' },
        {text: 'Tipo Reunion', style: 'headerCellBlue' },
        {text: 'Lugar', style: 'headerCellBlue' },
        {text: 'Fecha', style: 'headerCellBlue' },
        {text: 'Hora', style: 'headerCellBlue' },
        {text: 'Leccion Aprendida', style: 'headerCellYellow' },
        {text: 'Persona', style: 'headerCellYellow' },
        {text: 'Fase', style: 'headerCellYellow' },
        {text: 'Proceso', style: 'headerCellYellow' }

      ];

      this.downloadAndProcessImage(imagePath, headerRow, combinedData, 2);
    });}


  reportAll() {
    this.lessonslearnedAll();
  }

  reportOne() {
    this.lessonslearnedOne()
  }


// Method to download and process the image

private downloadAndProcessImage(imagePath: string, headerRow: any[], dataRows: any[], report: number) {
  this.http.get(imagePath, { responseType: 'blob' }).subscribe((imageBlob: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result as string;
      const documentDefinition = this.generateDocumentDefinition(headerRow, dataRows, imageDataUrl, report);
      pdfMake.createPdf(documentDefinition).open();
    };
    reader.readAsDataURL(imageBlob);
  });
}




// Method to generate documentDefinition
  generateDocumentDefinition(headerRow : any[], dataRows: any[], imageDataUrl, report: number) {
    let tableBody: any[] = [];

    if (report===1) {
    tableBody= [
      headerRow.map((text, index) => ({
        text,
        style: index < 7 ? 'headerCellBlue' : ('headerCellYellow' )
      })),
      ...dataRows
    ];
  }

  if (report===2) {
    tableBody= [headerRow, ...dataRows]
  }


  return {
    content: [
      {
        width: 50,
        image: imageDataUrl,
        fit: [90, 90] // Ajusta el tamaño
      },
      {
        text: `Compañía: ${this.trackingService.getnameComp()}`,
        style: 'header',
        fontSize: 8,
        bold: false
      },
      {
        alignment: 'right',
        text    : 'HCO-PMO-FOR-002',
        style: 'header',
        fontSize: 9,
        bold: false
     },
     {
       alignment: 'right',
       text    : 'Rev.-. 00',
       style: 'header',
       fontSize: 9,
       bold: false
    },

      {
        alignment: 'center',
        text: report === 1 ? 'PLAN DE GESTION DE COMUNICACIONES' : 'PLAN DE GESTION DE INTERESADOS',
        style: 'header',

      },

      {
        alignment: 'center',
        text: `SISTEMAS DE GESTION DE CALIDAD`,
        style: 'header'
      },
      {
        alignment: 'left',
        text: `Ref.: HCO-CAL-SGC-01`,
        style: 'header',
        fontSize: 9,
        bold: false

      },
      {
        alignment: 'left',
        table: {
          widths: ['50%'],
          body: [
            [{ text: `Contrato: ${this.trackingService.getContract()}`, style: 'headerText', }]
          ]
        },
        layout: 'Borders'
      },

      {
        alignment: 'left',
        table: {
          widths: ['50%'],
          body: [
            [{ text: `Proyecto: ${this.trackingService.getnameProject()}`, style: 'headerText' }]
          ]
        },
        layout: 'Borders'
      },


      {
        alignment: 'left',
        table: {
          widths: ['50%'],
          body: [
            [{ text: `Orden de Trabajo: ${this.trackingService.getnameProject()}`, style: 'headerText' }]
          ]
        },
        layout: 'Borders'
      },

      {
        alignment: 'left',
        table: {
          widths: ['50%'],
          body: [
            [{ text: `Instalacion: ${this.trackingService.getubicationProject()}`, style: 'headerText' }]
          ]
        },
        layout: 'Borders'
      },



      {
        columns: [
          {
            width: '75%',
            alignment: 'right',
            text: 'Inicio',
            style: 'headerText'
          },
          {
            width: '15%',
            alignment: 'center',
            text: 'Termino',
            style: 'headerText'
          },
          {
            width: '10%',
            alignment: 'center',
            text: 'Duracion',
            style: 'headerText'
          }
        ]
      },

      {
        columns: [
          {
            width: '75%',
            alignment: 'right',
            text: this.trackingService.getStart(),
            style: 'headerText'
          },
          {
            width: '15%',
            alignment: 'center',
            text: this.trackingService.getEnd(),
            style: 'headerText'
          },
          {
            width: '10%',
            alignment: 'center',
            text: '30',
            style: 'headerText'
          }
        ]
      },


      {
        table: {
          headerRows: 1,
          widths: new Array(headerRow.length).fill('auto'),
          body: tableBody
        }
      }

    ],



    footer: {
      columns: [
        {
          alignment: 'left',
          stack: [
            { text: 'ELABORO', style: 'footerText' },
            { text: 'Ing. de Proyecto HCO', style: 'footerText' }
          ]
        },
        {
          alignment: 'center',
          stack: [
            { text: 'ELABORO', style: 'footerText' },
            { text: 'Supervision de Contrato', style: 'footerText' }
          ]
        },
        {
          alignment: 'right',
          stack: [
            { text: 'ELABORO', style: 'footerText' },
            { text: 'Ingeniero Empresa Construccion', style: 'footerText' }
          ]
        }
      ]
    },
    pageSize: {
      width: report === 1 ? 1414 : (report === 2 ? 1254 : 595),
      height: 596
    },

    styles: {
      header: {
        fontSize: 15,
        bold: true,
        margin: [0, 0, 0, 10], // Margen inferior de 10 puntos
       },
       headerCell: {
        fillColor: '#007bff',
        color: '#fff',
        bold: true
       },
       headerText: {
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 10], // Margen inferior de 10 puntos
        border: [true, true, true, true], // Agrega el borde alrededor del texto
        padding: [5, 5, 5, 5] // Añade un espacio de relleno dentro del borde
      },
      footerText: {
        fontSize: 10,
        bold: true,
        margin: [0, 5, 0, 0]
      },
      headerCellBlue: {
        fillColor: '#80bfff',
        color: '#000',
        bold: true
      },
      headerCellYellow: {
        fillColor: '#ffc107',
        color: '#000',
        bold: true
      }
    }

    }
  }


//Aqui empieza el reporte
generarReporte(detailscom2: any[], comunications: any[]) {

  // estee es para el
      comunications.sort((a, b) => {
        if (a.procces < b.procces) {
          return -1;
        } else if (a.procces > b.procces) {
          return 1;
        } else {
          return 0;
        }
      })


      // Obtener los detalles de comunicaciones únicos
      const uniqueDetails = detailscom2;
      const uniqueDetailNames = [...new Set(uniqueDetails.map(detail => detail.name))].sort();

      // Crear o armar la cabecera la fila de encabezados
      const headerRow = [
        { text: 'Proceso', style: 'headerCellBlue' },
        { text: 'Informacion', style: 'headerCellBlue' },
        { text: 'Formato', style: 'headerCellBlue' },
        { text: 'Responsable', style: 'headerCellBlue' },
        { text: 'Referencia', style: 'headerCellBlue' },
        { text: 'Frecuencia', style: 'headerCellBlue' },
        { text: 'Grupo', style: 'headerCellBlue' },
        ...uniqueDetailNames.map((name, index) => ({
          text: name,
          style: index % 2 === 0 ? 'headerCellYellow' : 'headerCellBlue',
          rotation: 90
        }))
      ];

      // Crear las filas de datos
      const dataRows = comunications.map(com => {
        const details = detailscom2.filter(detail => detail.id === com.id);

        const row = [
          com.procces,
          com.information,
          com.format,
          com.owner,
          com.reference,
          com.frequence,
          com.group
        ];

        uniqueDetailNames.forEach(name => {
          const interactionNames = details.some(detail => detail.name === name) ? 'X' : '';
          row.push(interactionNames);
        });

        return row;
      });

       const imagePath = this.trackingService.getpictureComp();
       this.downloadAndProcessImage(imagePath, headerRow, dataRows,1)
 }


getDocumentDefinition(comunications: any[])
{
  // Define the content of the PDF document
  const content = [];

  // Title of the report
  content.push({
    text: 'Informe de Comunicaciones',
    style: 'header',
    alignment: 'center',
    margin: [0, 0, 0, 20] // Bottom margin of 20 units
  });

  // Table of communications
  const tableRows = [];

  // Table headers
  tableRows.push([

    { text: 'Proceso', style: 'tableHeader', rotation: 90 },
    { text: 'Información', style: 'tableHeader' },
    { text: 'Formato', style: 'tableHeader' },
    { text: 'Área', style: 'tableHeader' },
    { text: 'Propietario', style: 'tableHeader' },
    { text: 'Referencia', style: 'tableHeader' },
    { text: 'Frecuencia', style: 'tableHeader' },
    { text: 'Grupo', style: 'tableHeader' }
  ]);


  // Table rows
  Object.values(comunications).forEach((communication) => {
    tableRows.push([
      communication.procces,
      communication.information,
      communication.format,
      communication.area,
      communication.owner,
      communication.reference,
      communication.frequence,
      communication.group
    ]);
  });

 content.push({
    table: {
      headerRows: 1,
      widths: [ 'auto', 'auto', 'auto', 100, 'auto', 'auto', 'auto', 'auto'],
      body: tableRows
    }
  });

  // Define the styles for the document
  const styles = {
    header: {
      fontSize: 8,
      bold: false
    },
    tableHeader: {
      bold: false,
      fontSize: 8,
      fillColor: '#F2F2F2'
    }
  };

  // Define las opciones de configuración del documento
  const options = {
    pageSize: { width: 869, height: 595
    }  // Establece el tamaño del documento en formato horizontal
  };

  // Return the definition of the PDF document
  return {
    content: content,
    styles: styles,
    pageSize: options.pageSize
  };
}

}
