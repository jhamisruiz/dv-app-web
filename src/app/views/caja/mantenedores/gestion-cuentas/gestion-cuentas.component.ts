import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-gestion-cuentas',
  templateUrl: './gestion-cuentas.component.html',
  styleUrl: './gestion-cuentas.component.scss'
})
export class GestionCuentasComponent {
  @ViewChild('myChart') chartRef!: ElementRef<HTMLCanvasElement>;
  public myChart: any;

  data: any[] = [{ x: 1, y: 5 }, { x: 2, y: 10 }, { x: 3, y: 6 }, { x: 4, y: 2 }, { x: 4.1, y: 6 }];

  constructor() { }

  ngAfterViewInit() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    this.myChart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
          {
            label: 'Inresos',
            data: [5200, 3500, 1000, 7800, 9200, 1900], // Primera línea de datos
            borderColor: 'rgba(54, 162, 235, 1)', // Color de la primera línea (azul)
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 2,
            fill: false, // Desactiva el área sombreada bajo la línea
          },
          {
            label: 'Egresos',
            data: [200, 100, 950, 1500, 90, 1600], // Segunda línea de datos
            borderColor: 'rgba(255, 99, 132, 1)', // Color de la segunda línea (rojo)
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valor de Ingresos y Egresos ($)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mes'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Comparativa de Ingresos y Gastos'
          }
        }
      }
    });
  }
}
