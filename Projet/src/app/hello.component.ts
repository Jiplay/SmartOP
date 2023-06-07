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
                <th>Nom du chirurgien</th>
                <th>Spécialité</th>
                <th>Nombre d’interventions</th>
                <th>Anesthésiste favori</th>
                <th>Infirmière favorite</th>
                <th>Salle la plus fréquente</th>
                <th>Acte le plus fréquent</th>
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
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.http.get(`http://localhost:3000/surgeon/${this.currentPage}`).subscribe((data: any) => {
      if (this.isScrollingUp) {
        this.people = data.concat(this.people);
      } else {
        this.people = this.people.concat(data);
      }
      
      console.log(this.people[0].name);
      this.isLoading = false;
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

    if (this.isScrollingUp && scrollPosition < (windowHeight * 0.1) && this.currentPage > 1) {
      this.currentPage--;
      this.loadData();
    }

    if (!this.isScrollingUp && scrollPosition > (documentHeight - windowHeight - (windowHeight * 0.1))) {
      this.currentPage++;
      this.loadData();
    }
  }
}




