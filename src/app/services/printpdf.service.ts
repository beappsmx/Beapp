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
export class PrintpdfService {

  constructor(
    public  trackingService       : TrackingService,
    private interesService        : InteresService,
    private lessonsService        : LessonsService,
    private lessonslearnedService : LessonslearnedService,
    private firebaseService       : FirebaseService,
    private http                  : HttpClient
  ) { }

  listInterested() {

    let dataRows : any

    const headerRow = [
      {text: 'ID', style: 'headerCellBlue' },
      {text: 'Nombre', style: 'headerCellBlue' },
      {text: 'Organizacion', style: 'headerCellBlue' },
      {text: 'Puesto',  style: 'headerCellBlue' },
      {text: 'Telefono', style: 'headerCellBlue' },
      {text: 'Correo', style: 'headerCellBlue' },
      {text: 'Int.', style: 'headerCellBlue' },
      {text: 'Inf.', style: 'headerCellBlue' },
      {text: 'Pod.', style: 'headerCellBlue' },
      {text: 'Pond', style: 'headerCellBlue' },
      {text: 'Tipo de Seguimiento', style: 'headerCellBlue' }
    ];

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
      pageSize: 'LETTER',
      pageOrientation: 'landscape',
      pageMargins: [ 40, 100, 40, 60 ],
      header: function(currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element
        return [
          //{ text: 'simple text', alignment: 'center', margin: [5, 22] },
          {
            style: 'tableHeader',
            table: {
              widths: [ '*', 'auto', '*' ],
              heights: [20],
              body: [
                [
                  {
                    rowSpan : 2,
                    border    : [false, false, false, false],
                    image     : imageDataUrl,
                    width     : 90,
                    aligment  : 'center'
                  },
                  {
                    border    : [false, false, false, false],
                    text      : 'PLAN DE GESTION DE INTERESADOS',
                    aligment  : 'center',
                    fontSize  : 12,
                    bold      : true
                  },
                  {
                    border    : [false, false, false, false],
                    alignment : 'right',
                    text      : 'HCO-PMO-FOR-002',
                    style     : 'header',
                    fontSize  : 8,
                    bold      : false
                  }

                ],
                [
                  '',
                  {
                    border    : [false, false, false, false],
                    alignment: 'center',
                    text: `SISTEMAS DE GESTION DE CALIDAD`,
                    style: 'header',
                    aligment  : 'center',
                    fontSize  : 9,
                    bold      : true
                  },
                  {
                    border    : [false, false, false, false],
                    alignment : 'right',
                    text      : 'Rev.-. 00',
                    style     : 'header',
                    fontSize  : 8,
                    bold      : false
                  },
                ]
              ],

            }
          },
        ]
      },
      content: [
        {
          style: 'tableSubheader',
          table: {
            widths: [ 140, 140, 140, '*', 60, 60 ],
            body: [
              [
                {
                  border    : [false, false, false, false],
                  text      : '',
                },
                {
                  colSpan   :  5,
                  border    : [false, false, false, false],
                  text      : 'Ref.: HCO-CAL-SGC-01',
                  fontSize  : 8,
                  bold      : true
                },
                '','','','',
              ],
              [
                {
                  colSpan   :  6,
                  border    : [false, false, false, false],
                  text      : '',
                },
                '','','','','',
              ],
              [
                {
                  border    : [false, false, false, false],
                  alignment : 'center',
                  text      : 'Contrato',
                  style     : 'header',
                  fontSize  : 9,
                  bold      : true
                },
                {
                  border    : [true, true, true, true],
                  alignment : 'left',
                  text      : `${this.trackingService.getContract()}`,
                  style     : 'subheader',
                  fontSize  : 8,
                  bold      : false
                },
                {
                  border    : [false, false, false, false],
                  alignment : 'right',
                  text      : 'Compañia',
                  style     : 'header',
                  fontSize  : 9,
                  bold      : true
                },
                {
                  colSpan   : 3,
                  border    : [true, true, true, true],
                  alignment : 'left',
                  text      : `${this.trackingService.getnameComp()}`,
                  style     : 'subheader',
                  fontSize  : 8,
                  bold      : false
                },
                '',
                ''
              ],
              [
                {
                  colSpan   :  6,
                  border    : [false, false, false, false],
                  text      : '',
                },
                '','','','','',
              ],
              [
                {
                  border    : [false, false, false, false],
                  alignment : 'center',
                  text      : 'Proyecto',
                  style     : 'header',
                  fontSize  : 9,
                  bold      : true
                },
                {
                  colSpan   : 3,
                  border    : [true, true, true, true],
                  alignment : 'left',
                  text      : `${this.trackingService.getnameProject()}`,
                  style     : 'subheader',
                  fontSize  : 8,
                  bold      : false
                },
                '',
                '',
                {
                  border    : [false, false, false, false],
                  alignment : 'center',
                  text      : 'Inicio',
                  style     : 'header',
                  fontSize  : 9,
                  bold      : true
                },
                {
                  border    : [false, false, false, false],
                  alignment : 'center',
                  text      : 'Termino',
                  style     : 'header',
                  fontSize  : 9,
                  bold      : true
                },
              ],
              [
                {
                  colSpan   :  6,
                  border    : [false, false, false, false],
                  text      : '',
                },
                '','','','','',
              ],
              [
                {
                  border    : [false, false, false, false],
                  alignment : 'center',
                  text      : 'Orden de Trabajo',
                  style     : 'header',
                  fontSize  : 9,
                  bold      : true
                },
                {
                  border    : [true, true, true, true],
                  alignment : 'left',
                  text      : `${this.trackingService.getnameProject()}`,
                  style     : 'subheader',
                  fontSize  : 8,
                  bold      : false
                },
                {
                  border    : [false, false, false, false],
                  text      : '',
                },
                {
                  border    : [false, false, false, false],
                  text      : '',
                },
                {
                  border    : [true, true, true, true],
                  alignment : 'center',
                  text      : this.trackingService.getStart(),
                  style     : 'subheader',
                  fontSize  : 8,
                  bold      : false
                },
                {
                  border    : [true, true, true, true],
                  alignment : 'center',
                  text      : this.trackingService.getEnd(),
                  style     : 'subheader',
                  fontSize  : 8,
                  bold      : false
                },
              ],
              [
                {
                  colSpan   :  6,
                  border    : [false, false, false, false],
                  text      : '',
                },
                '','','','','',
              ],
              [
                {
                  border    : [false, false, false, false],
                  alignment : 'center',
                  text      : 'Instalación',
                  style     : 'header',
                  fontSize  : 9,
                  bold      : true
                },
                {
                  border    : [true, true, true, true],
                  alignment : 'left',
                  text      : this.trackingService.getubicationProject(),
                  style     : 'subheader',
                  fontSize  : 8,
                  bold      : false
                },
                {
                  border    : [false, false, false, false],
                  text      : '',
                },
                {
                  border    : [false, false, false, false],
                  text      : '',
                },
                {
                  border    : [false, false, false, false],
                  alignment : 'center',
                  text      : 'Duración',
                  style     : 'header',
                  fontSize  : 9,
                  bold      : true
                },
                {
                  border    : [true, true, true, true],
                  alignment : 'center',
                  text      : '1',
                  style     : 'subheader',
                  fontSize  : 8,
                  bold      : false
                },
              ],
              [
                {
                  colSpan   :  6,
                  border    : [false, false, false, false],
                  text      : '',
                },
                '','','','','',
              ]
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return 0.5;
            },
            vLineWidth: function (i, node) {
              return 0.5;
            },
            hLineColor: function (i, node) {
              return 'gray';
            },
            vLineColor: function (i, node) {
              return 'gray';
            },
          }
        },

        {
          style: 'tableB',
          table: {
            widths: [ 50,110,65,80,50,130,20,20,20,20,'auto' ],
            headerRows: 1,
            //widths: new Array(headerRow.length).fill('auto'),
            body: tableBody,
          },
          layout: {
            hLineWidth: function (i, node) {
              return 0.5;
            },
            vLineWidth: function (i, node) {
              return 0.5;
            },
            hLineColor: function (i, node) {
              return 'gray';
            },
            vLineColor: function (i, node) {
              return 'gray';
            },
          }
        }

      ],

      footer: function(currentPage, pageCount) {
        return [
          {
            style: 'tableFooter',
            table: {
              widths: [ '*', '*', '*' ],
              heights: [20],
              body: [
                [
                  {
                    border    : [false, false, false, false],
                    text      : 'ELABORO',
                    alignment : 'center',
                    fontSize  : 10,
                    bold      : true
                  },
                  {
                    border    : [false, false, false, false],
                    alignment : 'center',
                    text      : 'REVISO',
                    fontSize  : 10,
                    bold      : true
                  },
                  {
                    border    : [false, false, false, false],
                    alignment : 'center',
                    text      : 'AUTORIZO',
                    style     : 'header',
                    fontSize  : 10,
                    bold      : true
                  }

                ],
                [
                  {
                    border    : [false, false, false, false],
                    text      : 'Ing. de Proyecto HCO',
                    alignment : 'center',
                    fontSize  : 10,
                    bold      : true
                  },
                  {
                    border    : [false, false, false, false],
                    text      : 'Supervisor de Contrato',
                    alignment : 'center',
                    fontSize  : 10,
                    bold      : true
                  },
                  {
                    border    : [false, false, false, false],
                    alignment : 'center',
                    text      : 'Supervisor de Construcción',
                    style     : 'header',
                    fontSize  : 10,
                    bold      : true
                  }
                ],
                [
                  {
                    border    : [false, false, false, false],
                    text      : '',
                  },
                  {
                    border    : [false, false, false, false],
                    text      : '',
                  },
                  {
                    border    : [false, false, false, false],
                    alignment : 'right',
                    text      : `Pag. ${currentPage} de ${pageCount}`,
                    style     : 'header',
                    fontSize  : 7,
                    bold      : false,
                    margin    : [0, 0, 20, 30 ]
                  }
                ]
              ],

            }
          },
        ]
      },

      styles: {
        header: {
          fontSize: 15,
          bold: true,
          margin: [0, 0, 0, 0],
        },
        subheader: {
          fontSize: 8,
          bold: false,
          fillColor: '#ededed',
        },
        headerCellBlue: {
          fontSize: 8,
          alignment: 'center',
          fillColor: '#BDD7EE',
          color: '#000',
          bold: true
        },
        tableHeader: {
          margin: [40, 20, 40, 0]
        },
        tableSubheader: {
          margin: [0, 2, 0, 0]
        },
        tableB: {
          fontSize: 7,
          bold: false,
        }
      }

    }
  }
}
