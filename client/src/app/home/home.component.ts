import { Component } from '@angular/core';
import { HotDealsComponent } from '../hot-deals/hot-deals.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HotDealsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
