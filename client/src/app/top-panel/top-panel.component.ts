import { Component } from '@angular/core';
import { TopPanelCategoryComponent } from '../top-panel-category/top-panel-category.component';
import { RouterLink } from '@angular/router';
import { ScrollToTopDirective } from '../_directives/scroll-to-top.directive';

@Component({
  selector: 'app-top-panel',
  standalone: true,
  imports: [
    TopPanelCategoryComponent,
    RouterLink,
    ScrollToTopDirective
  ],
  templateUrl: './top-panel.component.html',
  styleUrl: './top-panel.component.scss'
})
export class TopPanelComponent {

}
