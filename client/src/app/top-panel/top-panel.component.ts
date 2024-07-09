import { Component } from '@angular/core';
import { TopPanelCategoryComponent } from '../top-panel-category/top-panel-category.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-panel',
  standalone: true,
  imports: [
    TopPanelCategoryComponent,
    RouterLink
  ],
  templateUrl: './top-panel.component.html',
  styleUrl: './top-panel.component.scss'
})
export class TopPanelComponent {

}
