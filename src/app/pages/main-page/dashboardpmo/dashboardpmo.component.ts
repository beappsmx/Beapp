import { OnInit, Component, ViewChild } from '@angular/core';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DashInterestedService } from 'src/app/services/dash-interested.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { object } from 'firebase-functions/v1/storage';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { IdashInter } from 'src/app/interface/idashboard';
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ApexPlotOptions,
  ChartComponent,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexAnnotations,
  ApexTooltip
} from "ng-apexcharts";

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  annotations: ApexAnnotations;
  tooltip: ApexTooltip;
};

export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  labels: any;
};

const customTooltipFormatter = (y: number, interesados: any[], w: any): string => {
  // Crear el array impactArray con los datos de interesados y el impacto calculado
  const dataIndex = w.seriesIndex;
  // Filtrar interesados para obtener solo los registros que cumplan con ambas condiciones
  const matchingNames = interesados
    .filter((item) => Number(item.influence) === dataIndex+1)
    .map((item) => {
      const impact = Number(item.influence) + ((Number(item.interes) + Number(item.power)) / 2);
      return [Math.round(impact), item.name];
    })
    .filter(([impact]) => impact === y)
    .map(([, name]) => name);

  // Retornar el resultado según las coincidencias encontradas
  if (matchingNames.length > 0) {
    return matchingNames.join("<br>");
  } else {
    return ``;
  }
};

@Component({
  selector: 'app-dashboardpmo',
  templateUrl: './dashboardpmo.component.html',
  styleUrls: ['./dashboardpmo.component.css']
})

export class DashboardpmoComponent implements OnInit{

  selectedTab       = 'interested';
  organizationData  : any[]  = [];
  sumOrg            : number[]= [];
  colors            : string[]= [];
  interesados       : IdashInter[] = [];
  tooltipContent    : string;
  typeChart         : any[]  = ['bar','heatmap','donut','pie','radialBar'];
  Options           : Partial<ChartOptions>;
  Options2          : Partial<ChartOptions2>;
  variable          : string;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chart2") chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions>;
  @ViewChild("chart3") chart3: ChartComponent;
  public chartOptions3: Partial<ChartOptions>;

  @ViewChild("chart4") chart4: ChartComponent;
  public chartOptions4: Partial<ChartOptions2>;
  @ViewChild("chart5") chart5: ChartComponent;
  public chartOptions5: Partial<ChartOptions2>;
  @ViewChild("chart6") chart6: ChartComponent;
  public chartOptions6: Partial<ChartOptions2>;
  @ViewChild("chart7") chart7: ChartComponent;
  public chartOptions7: Partial<ChartOptions2>;

  @ViewChild("chart8") chart8: ChartComponent;
  public chartOptions8: Partial<ChartOptions2>;
  @ViewChild("chart9") chart9: ChartComponent;
  public chartOptions9: Partial<ChartOptions>;
  @ViewChild("chart10") chart10: ChartComponent;
  public chartOptions10: Partial<ChartOptions>;
  @ViewChild("chart11") chart11: ChartComponent;
  public chartOptions11: Partial<ChartOptions>;
  @ViewChild("chart12") chart12: ChartComponent;
  public chartOptions12: Partial<ChartOptions>;
  @ViewChild("chart13") chart13: ChartComponent;
  public chartOptions13: Partial<ChartOptions>;
  @ViewChild("chart14") chart14: ChartComponent;
  public chartOptions14: Partial<ChartOptions>;

  constructor(
    public dialog: MatDialog,
    public dashInterestedService: DashInterestedService,
    public catalogService: CatalogService,
    private trackingService: TrackingService,
  ){ }

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;
    if (tabName === 'interested') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña interested del menu Dashboard',
        'Dasboard',
        ''
      );
      //this.getInterested();
      console.log('Esto se ejecuta en el tab');
    }
    if (tabName === 'communications') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña communications del menu Dasboard',
        'Dasboard',
        ''
      );
    }
    if (tabName === 'risk') {
      this.trackingService.addLog(
        '',
        'Click en la Pestaña risk del menu Dasboard',
        'Dasboard',
        ''
      );
    }
  }
  ngOnInit(): void {
    console.log('Esto se ejecuta al inicio');
    this.getInterested();
    this.getCommunications();

  }

  getInterested(){
    this.dashInterestedService.getDataInteres(localStorage.getItem('project')).subscribe((data) => {
      this.interesados = data;
      this.getIntxOrgData(data);
      this.getHeatMapData();
      this.getIntxAreaData(data);
      this.getImpactData(data, 1); // genera data para interes
      this.getImpactData(data, 2); // genera data para influence
      this.getImpactData(data, 3); // genera data para power
      this.getImpactData(data, 4); // genera data para avg

    });
  }

  getCommunications(){
    this.getPmbok();
  }

  getRisk(){
    this.getPmbok();
  }

  getIntxOrgData(int: any){
    const organizationSet = new Set<string>();
    const orgCountMap: { [organization: string]: number } = {};
    int.forEach(interesado => {
      const organization = interesado.organization;
      organizationSet.add(interesado.organization);
      if (orgCountMap[organization]) {
        orgCountMap[organization]++;
      } else {
        // Si la organización no existe en el objeto, agregarla con el valor 1
        orgCountMap[organization] = 1;
      }
    });
    this.organizationData = Array.from(organizationSet);
    this.sumOrg = Object.values(orgCountMap);
    this.colors = this.sumOrg.map((number) => this.numberToColor(number));
    this.chartOptions2 = this.chartInt(this.sumOrg, this.organizationData, this.colors, this.typeChart[0], 1);
  }

  getIntxAreaData(int: any){
    const areaSet = new Set<string>();
    const areaCountMap: { [interesado: string]: number } = {};
    int.forEach(interesado => {
      const area = interesado.position;
      areaSet.add(interesado.position);
      if (areaCountMap[area]) {
        areaCountMap[area]++;
      } else {
        // Si la organización no existe en el objeto, agregarla con el valor 1
        areaCountMap[area] = 1;
      }
    });
    const areaData = Array.from(areaSet);
    const sumOrg = Object.values(areaCountMap);
    const colors = sumOrg.map((number) => this.numberToColor(number));
    this.chartOptions3 = this.chartInt(sumOrg, areaData, colors, this.typeChart[0], 2);
  }

  getHeatMapData(){
    const serieData = ["1", "2", "3", "4", "5"];
    this.chartOptions = this.chartInt(serieData, null, null, this.typeChart[1], 0);
  }

  getImpactData(data: IdashInter[], type: number): void {
    const serieValues = [1, 2, 3, 4, 5];
    const countObject: { [key: number]: number } = {};
    var dataValue = null;
    serieValues.forEach((value) => {
      countObject[value] = 0;
    });

    data.forEach((item) => {
      if(type===1){
        dataValue = Number(item.interes);
      }else if(type===2){
        dataValue = Number(item.influence);
      }else if(type===3){
        dataValue = Number(item.power);
      }else if(type===4){
        dataValue = Number(item.avg);
      }
      if (serieValues.includes(dataValue)) {
        countObject[dataValue]++;
      }
      if (serieValues.includes(dataValue)) {
        countObject[dataValue]++;
      }
    });
    const countArray = serieValues.map((value) => countObject[value]);
      const colors = countArray.map((number) => this.numberToColor(number));


    if(type===1){
      //this.chartOptions4 = this.chartInt(countArray, serieValues, colors, this.typeChart[2], 0);
      this.chartOptions4 = this.chartInt(countArray, serieValues, colors, this.typeChart[2], 0);
    }else if(type===2){
      this.chartOptions5 = this.chartInt(countArray, serieValues, colors, this.typeChart[2], 0);
    }else if(type===3){
      this.chartOptions6 = this.chartInt(countArray, serieValues, colors, this.typeChart[2], 0);
    }else if(type===4){
      this.chartOptions7 = this.chartInt(countArray, serieValues, colors, this.typeChart[2], 0);
    }
  }

  private numberToColor(number: number): string {
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = Math.floor(Math.random() * 231) + number;
      const colorComponent = value.toString(16).padStart(2, '0');
      color += colorComponent;
    }
    return color;
  }

  getPmbok(){
    const countArray = [100, 0];
    const serieValues = ["Juntas Soldadas", "Juntas Faltantes"];
    const colors = [1, 2, 3, 4, 5];
    this.chartOptions8 = this.chartInt(countArray, serieValues, colors, this.typeChart[4], 0);
  }

  getTooltipContent(labels: string[], interesados: any[], dataPointIndex: number, type: number): string {
    if(type === 1){
      const fillColor = this.chartOptions2.colors[dataPointIndex];
      const value = this.chartOptions2.series[0].data[dataPointIndex];

      const currentOrganization = labels[dataPointIndex];
      const filteredInteresados = interesados.filter(item => item.organization === currentOrganization);

      let tooltipContent = `<div style="display: flex; align-items: center; background-color: #EAEAEE; height: 30px; padding-left: 10px; font-size: 13px;">${currentOrganization}</div>`;

      if (filteredInteresados.length > 0) {
        tooltipContent += `<div style="display: flex; flex-direction: column; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; font-size: 11px;">Interesados: ${value}`;
        filteredInteresados.forEach((item, index) => {
          tooltipContent += `
            <div style="display: flex; align-items: center; padding-left: 10px; font-size: 11px; padding-right: 10px;">
              <span style="background-color: ${fillColor}; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px;"></span>
              ${item.name}
            </div>`;
        });
        tooltipContent += '</div>';
      }

      return tooltipContent;

    }else if(type === 2){
      const fillColor = this.chartOptions3.colors[dataPointIndex];
      const value = this.chartOptions3.series[0].data[dataPointIndex];

      const currentArea = labels[dataPointIndex];
      const filteredInteresados = interesados.filter(item => item.position === currentArea);

      let tooltipContent = `<div style="display: flex; align-items: center; background-color: #EAEAEE; height: 30px; padding-left: 10px; font-size: 13px;">${currentArea}</div>`;

      if (filteredInteresados.length > 0) {
        tooltipContent += `<div style="display: flex; flex-direction: column; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; font-size: 11px;">Interesados: ${value}`;
        filteredInteresados.forEach((item, index) => {
          tooltipContent += `
            <div style="display: flex; align-items: center; padding-left: 10px; font-size: 11px; padding-right: 10px;">
              <span style="background-color: ${fillColor}; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px;"></span>
              ${item.name}
            </div>`;
        });
        tooltipContent += '</div>';
      }

      return tooltipContent;
    }else{
      return '';
    }
  }

  chartInt(serieData: any, xcategories: any, color: any, type: string, tooltipType: number): any{

    switch(type){
      case 'bar':
        this.Options = {
          series: [
            {
              name: "Interesados",
              data: serieData
            }
          ],
          chart: {
            height: 350,
            type: type,
            events: {
              click: function(chart, w, e) {
                // console.log(chart, w, e)
              }
            },
            toolbar: {
              show: true,
            },
          },
          colors: color,
          plotOptions: {
            bar: {
              columnWidth: "45%",
              distributed: true
            }
          },
          dataLabels: {
            enabled: true
          },
          legend: {
            show: false
          },
          grid: {
            show: true
          },

          xaxis: {
            categories: xcategories,
            labels: {
              style: {
                colors: color,
                fontSize: "12px"
              }
            }
          },
          tooltip: {
            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
              const labels = w.globals.labels;
              const interesados = this.interesados;

              return this.getTooltipContent(labels, interesados, dataPointIndex, tooltipType);
            }
          }
        };
      return this.Options;
      case 'heatmap':
        this.Options = {
          series: [
            {
              name: "1",
              data: [
                2,
                3,
                4,
                5,
                6
              ]
            },
            {
              name: "2",
              data: [
                3,
                4,
                5,
                6,
                7
              ]
            },
            {
              name: "3",
              data: [
                4,
                5,
                6,
                7,
                8
              ]
            },
            {
              name: "4",
              data: [
                5,
                6,
                7,
                8,
                9
              ]
            },
            {
              name: "5",
              data: [
                6,
                7,
                8,
                9,
                10
              ]
            }
          ],
          chart: {
            height: 350,
            type: type
          },
          xaxis: {
            type: "category",
            categories: [
              "1",
              "2",
              "3",
              "4",
              "5"
            ]
          },
          plotOptions: {
            heatmap: {
              shadeIntensity: 0.5,
              colorScale: {
                ranges: [
                  {
                    from: 2,
                    to: 4,
                    name: "low",
                    color: "#009900"
                  },
                  {
                    from: 5,
                    to: 7,
                    name: "medium",
                    color: "#FFBB00"
                  },
                  {
                    from: 8,
                    to: 10,
                    name: "high",
                    color: "#FF0000"
                  }
                ]
              }
            }
          },
          dataLabels: {
            enabled: false
          },
          tooltip: {
            y: {
              formatter: (y, w) => customTooltipFormatter(y, this.interesados, w),
            }
          }
        };
      return this.Options;
      case 'donut':
        this.Options2 = {
          series: serieData,
          chart: {
            type: type,
            toolbar: {
              show: true,
            },
          },
          dataLabels: {
            enabled: false,
          },
          labels: xcategories,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ],
        };
      return this.Options2;
      case 'radialBar':
        this.Options2 = {
          series: [30, 70],
          chart: {
            height: 350,
            type: type
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: {
                  fontSize: "22px"
                },
                value: {
                  fontSize: "16px"
                },
                total: {
                  show: true,
                  label: "Total",
                  formatter: function(w) {
                    return "2637";
                  }
                }
              }
            }
          },
          labels: xcategories

        };
      return this.Options2;
      default:
    }
  }
}
