import { AuthService } from 'src/app/auth/shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { throwError } from 'rxjs';
import { PostModel } from '../shared/post-model';
import { PostService } from '../shared/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: Array<PostModel> = [];
  chartBar: any;
  chartdoughnut: any;

 
  constructor(private postService: PostService, private authService: AuthService) {
    this.postService.getAllPosts().subscribe(post => {
      this.posts = post, 
      Chart.register(...registerables);

    });
  }

  ngOnInit() {
    this.postService.getAllPosts().subscribe(data => {
      this.posts = data;
    }, error => {
      throwError(error);
    })
  }

  getProducts() {
    this.postService.getAllPosts().subscribe({
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
    const numofComments: number[] = [];

    let listCProduct = resp;
    console.log('listCProduct:', listCProduct);

    listCProduct.forEach((element: PostModel) => {
      name.push(element.postName);
      numofComments.push(element.commentCount);
    });

    //nuestro gráfico de barras
    this.chartBar = new Chart('canvas-bar', {
      type: 'bar',
      data: {
        labels: name,
        datasets: [
          {
            label: 'numero de posts',
            data: numofComments,
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
            data: numofComments,
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
      this.postService.exportProduct().subscribe(
        (data: any) => {
          let file = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement('a');
          anchor.download = 'post.xlsx';
          anchor.href = fileUrl;
          anchor.click();
  
          console.log('Archivo exportado correctamente', 'Exitosa');
        },
        (error: any) => {
          console.log('No se pudo exportar el archivo', 'Error');
        }
      );
    }

    exportExcelUser() {
      this.authService.exportProduct().subscribe(
        (data: any) => {
          let file = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement('a');
          anchor.download = 'user.xlsx';
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
