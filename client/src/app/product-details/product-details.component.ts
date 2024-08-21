import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductDetails } from '../_models/product-details.model';
import { ProductsService } from '../_services/products.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductCard } from '../_models/product-card.model';
import { ProductsListComponent } from "../products-list/products-list.component";
import { ScrollSpyDirective } from '../_directives/scroll-spy.directive';
import { ProductNavigationCard } from '../_models/product-navigation-card.model';
import { ProductCartService } from '../_services/product-cart.service';
import { ProductCartItem } from '../_models/product-cart-item.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  animations: [
    trigger('blink', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('true => false', [
        animate(150)
      ]),
      transition('false => true', [
        animate(150)
      ])
    ]),
    trigger('flyInOut', [
      state('normal', style({
        visibility: 'hidden',
        transform: 'translateY(10px)',
        opacity: 0.0
      })),
      state('hover', style({
        visibility: 'visible',
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('normal <=> hover', animate('300ms ease-in-out'))
    ]),
    trigger('flyInEnterLeave', [
      state('false', style({
        visibility: 'hidden',
        transform: 'translateY(50px)',
        opacity: 0
      })),
      state('true', style({
        visibility: 'visible',
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('false <=> true', animate('300ms ease-in-out'))
    ])
  ],
  imports: [FormsModule, NgFor, NgIf, ProductsListComponent, ScrollSpyDirective, NgClass, RouterLink]
})
export class ProductDetailsComponent implements OnInit {
  product!: ProductDetails;
  itemQuantity: number = 1;
  additionalInfoKeys: string[] = [];
  selectedVariant: number | undefined;
  priceFade: boolean = false;
  currentPrice!: number;
  similarProducts: ProductCard[] | undefined;
  isBottomPanelVisible: boolean = false;

  @ViewChild('productDescription') productDescription: ElementRef | undefined;
  @ViewChild('similarProductsElement') similarProductsElement!: ElementRef;

  prevHover: 'hover' | 'normal' = 'normal';
  nextHover: 'hover' | 'normal' = 'normal';

  constructor(private route: ActivatedRoute, private productsService: ProductsService,
    private router: Router, private cartService: ProductCartService) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => {
        this.product = data['productDetails'];
        this.additionalInfoKeys = this.product.additionalInfo ? Object.keys(this.product.additionalInfo) : [];
        this.selectedVariant = this.product.foodItems.at(0)?.id;
        this.currentPrice = this.getSelectedPrice();
      }
    );

    const id = this.route.snapshot.paramMap.get("id");

    if (id == undefined) return;

    this.productsService.getSimilarProducts(Number(id), 4).subscribe(
      data => {
        this.similarProducts = data;
      }
    );
  }

  hasMultipleVariations(): boolean {
    return this.product.foodItems.length > 1;
  }

  selectVariant(variant: number | undefined) {
    if (variant !== undefined && variant !== this.selectedVariant)
      this.priceFade = false;

    this.selectedVariant = variant;
  }

  decreaseQuantity() {
    if (this.itemQuantity > 1)
      this.itemQuantity--;
  }

  increaseQuantity() {
    if (this.itemQuantity < 10)
      this.itemQuantity++;
  }

  getSelectedPrice(): number {
    if (this.selectedVariant !== undefined) {
      return this.product.foodItems.find(item => item.id === this.selectedVariant)!.price;
    }

    return this.product.foodItems[0].price;
  }

  resetPrice() {
    this.currentPrice = this.getSelectedPrice();
    this.priceFade = true;
  }

  scrollToOptions(): void {
    if (!this.productDescription) return;

    this.productDescription.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  routeToNeighbour(neighbour: ProductNavigationCard | null) {
    if (neighbour !== null)
      this.router.navigate(['/product', neighbour.id]);
  }

  addToCart() {
    if (this.selectedVariant === undefined) {
      console.error("Item not selected");
      return;
    }
    const item: ProductCartItem = {
      id: this.product.id,
      foodItemId: this.selectedVariant,
      price: this.product.foodItems.find(x => x.id === this.selectedVariant)!.price,
      title: this.product.title,
      imgUrl: null,
      quantity: this.itemQuantity
    };
    this.cartService.addToCart(item);
  }

  onVisibilityChanged($event: boolean) {
    this.isBottomPanelVisible = $event;
  }

  calculateOffset(): number {
    if (this.product.foodItems.length > 1) {
      return 130;
    }
    return 300;
  }

  prevMouseEnter() {
    this.prevHover = 'hover';
  }

  prevMouseLeave() {
    this.prevHover = 'normal';
  }

  nextMouseEnter() {
    this.nextHover = 'hover';
  }

  nextMouseLeave() {
    this.nextHover = 'normal';
  }
}
