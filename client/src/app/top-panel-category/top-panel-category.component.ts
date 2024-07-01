import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-panel-category',
  standalone: true,
  imports: [NgIf],
  templateUrl: './top-panel-category.component.html',
  styleUrl: './top-panel-category.component.scss'
})
export class TopPanelCategoryComponent {
  @Input({ required: true }) imageUri!: string;
  @Input({ required: true }) categoryTitle!: string;
}
