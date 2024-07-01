import { Component } from '@angular/core';
import { TopPanelCategoryComponent } from '../top-panel-category/top-panel-category.component';

@Component({
  selector: 'app-top-panel',
  standalone: true,
  imports: [TopPanelCategoryComponent],
  templateUrl: './top-panel.component.html',
  styleUrl: './top-panel.component.scss'
})
export class TopPanelComponent {

}
