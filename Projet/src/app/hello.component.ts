import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-hello',
  template: `
    <div class="container">
        <div class="content">
            <h1>Tableau de classement des chirurgiens</h1>
            <table class="table">
            <thead>
              <tr>
                <th class="sticky-header">Nom du chirurgien</th>
                <th class="sticky-header">Spécialité</th>
                <th class="sticky-header">Nombre d’interventions</th>
                <th class="sticky-header">Anesthésiste favori</th>
                <th class="sticky-header">Infirmière favorite</th>
                <th class="sticky-header">Salle la plus fréquente</th>
                <th class="sticky-header">Acte le plus fréquent</th>
              </tr>
            </thead>
            <tbody>
                <tr *ngFor="let person of this.people">
                <td>{{ person.name }}</td>
                <td>{{ person.spe }}</td>
                <td>{{ person.intervention }}</td>
                <td>{{ person.AnestFav }}</td>
                <td>{{ person.nurseFav }}</td>
                <td>{{ person.roomFav }}</td>
                <td>{{ person.opFav }}</td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
  `,
  styles: [`
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
    .content {
        margin-bottom: 2rem;
      }

    .sticky-header {
      position: sticky;
      top: 0;
      background-color: #f5f5f5;
      z-index: 1;
    }
      
    .table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 1rem;
            color: #333;
        }

    .table th, .table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    .table th {
        background-color: #f5f5f5;
    }

    .table tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    `],
})
export class HelloComponent implements OnInit, OnDestroy {
  people: { _id: string, name: string, spe: string, roomFav: string, nurseFav: string, opFav: string, AnestFav: string, intervention: string }[] = [];
  currentPage: number = 1;
  isLoading: boolean = false;
  loadingData: boolean = false;
  scrollListener: any;
  scrollPosition: number = 0;
  isScrollingUp: boolean = false;

  constructor(private http: HttpClient) { }
  
  ngOnInit() {
    this.loadData();

    this.scrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  loadData() {
    if (this.isLoading || this.loadingData) {
      return;
    }
  
    this.loadingData = true;
  
    this.http.get(`http://localhost:3000/surgeon/${this.currentPage}`).subscribe((data: any) => {
      const newData = data;
      const tempData: any[] = [];
  
      if (this.isScrollingUp) {
        tempData.push(...newData);
        tempData.push(...this.people);
        this.people = tempData;
      } else {
        this.people.push(...newData);
      }
      
      console.log("get page", this.currentPage);
      this.loadingData = false;
    });
  }
  
  onScroll() {
    const scrollPosition = window.scrollY;

    if (scrollPosition < this.scrollPosition) {
      this.isScrollingUp = true;
    } else {
      this.isScrollingUp = false;
    }

    this.scrollPosition = scrollPosition;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (this.isScrollingUp && scrollPosition < (windowHeight * 0.1) && this.currentPage > 1 && !this.loadingData) {
      console.log(this.currentPage)
      this.currentPage--;
      this.loadData();
    }
    
    if (!this.isScrollingUp && scrollPosition > (documentHeight - windowHeight - (windowHeight * 1.1)) && !this.loadingData) {
      console.log(this.currentPage)
      this.currentPage++;
      this.loadData();
    }
  }
}






