import { SubredditService } from 'src/app/subreddit/subreddit.service';
import { Component, OnInit } from '@angular/core';
import { SubredditModel } from '../subreddit-response';
import { throwError } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { Route } from '@angular/router';
@Component({
  selector: 'app-list-subreddits',
  templateUrl: './list-subreddits.component.html',
  styleUrls: ['./list-subreddits.component.css']
})
export class ListSubredditsComponent implements OnInit {
  chartBar: any;
  chartdoughnut: any;

  subreddits: Array<SubredditModel>;
  constructor(private subredditService: SubredditService) {
    Chart.register(...registerables);
  }
  

  ngOnInit() {
    this.subredditService.getAllSubreddits().subscribe(data => {
      this.subreddits = data;
    }, error => {
      throwError(error);
    })
  }

  getProducts() {
    this.subredditService.getAllSubreddits().subscribe({
      next: (data) => {
        this.processProductResponse(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  processProductResponse(resp: any) {
    const name: String[] = [];
    const numofPosts: number[] = [];

    let listCProduct = resp;
    console.log('listCProduct:', listCProduct);

    listCProduct.forEach((element: SubredditModel) => {
      name.push(element.name);
      numofPosts.push(element.numberOfPosts);
    });

    //nuestro gráfico de barras
    this.chartBar = new Chart('canvas-bar', {
      type: 'bar',
      data: {
        labels: name,
        datasets: [
          {
            label: 'numero de posts',
            data: numofPosts,
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],

            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 0, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
          },
        ],
      },
    });
    //nuestro gráfico de doughnut
    this.chartdoughnut = new Chart('canvas-doughnut', {
      type: 'doughnut',
      data: {
        labels: name,
        datasets: [
          {
            label: 'Productos',
            data: numofPosts,
            borderColor: '#3cba8f',

            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 0, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
          },
        ],
      },
    });
  }
    
    exportExcel() {
      this.subredditService.exportCategories().subscribe(
        (data: any) => {
          let file = new Blob([data], {
            type: 'application/vnd.ms-excel',
          });
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement('a');
          anchor.download = 'subreddit.xlsx';
          anchor.href = fileUrl;
          anchor.click();
  
          console.log('Archivo exportado correctamente', 'Exitosa');
        },
        (error: any) => {
          console.log('No se pudo exportar el archivo', 'Error');
        }
      );
    }

    
 
  }