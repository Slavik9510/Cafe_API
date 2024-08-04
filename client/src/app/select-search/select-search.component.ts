import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-search',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf],
  templateUrl: './select-search.component.html',
  styleUrl: './select-search.component.scss'
})
export class SelectSearchComponent<T> implements OnInit {
  @Input({ required: true }) options!: { [key: string]: T };
  @Output() selectedOptionChanged: EventEmitter<string> = new EventEmitter<string>();
  selectedKey!: string;
  searchFilter: string = "";
  @ViewChild("dropdown") dropdownElement!: ElementRef;
  @ViewChild("selected") selectedElement!: ElementRef;

  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    this.selectedKey = Object.keys(this.options)[0];
    //notify parent
    this.selectedOptionChanged.emit(this.selectedKey);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.onClickOutside();
    }
  }

  //hide dropdown if clicked outside
  onClickOutside(): void {
    const dropdownNativeEl = this.dropdownElement.nativeElement;
    const selectedNativeEl = this.selectedElement.nativeElement;
    dropdownNativeEl.style.display = ''; //display: none;
    selectedNativeEl.classList.remove('unfolded');
  }

  getAllKeys(): string[] {
    return Object.keys(this.options);
  }

  getStringValue(key: string): string {
    const value = this.options[key];

    if (value === null || value === undefined) {
      return '';
    }
    return value.toString();
  }

  toggleDropdown() {
    const dropdownNativeEl = this.dropdownElement.nativeElement;
    const selectedNativeEl = this.selectedElement.nativeElement;
    if (dropdownNativeEl.style.display === '') {
      dropdownNativeEl.style.display = 'block'
      selectedNativeEl.classList.add('unfolded');
    }
    else {
      dropdownNativeEl.style.display = ''; //display: none;
      selectedNativeEl.classList.remove('unfolded');
    }
  }

  getFilteredOptions(): string[] {
    let keys = Object.keys(this.options);
    if (this.searchFilter === "") {
      return keys;
    }
    return keys.filter(x => x.toLocaleLowerCase().includes(this.searchFilter.toLocaleLowerCase()));
  }

  selectOption(key: string) {
    this.selectedKey = key;
    //notify parent
    this.selectedOptionChanged.emit(this.selectedKey);

    //hide dropdown
    this.toggleDropdown();
  }
}

