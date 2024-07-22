import { Component, Input, OnInit } from '@angular/core';
import { ProductCard } from '../_models/product-card.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  animations: [
    trigger('fadeOut', [
      transition('false => true', [
        animate('0.3s', keyframes([
          style({ opacity: '1' }),
          style({ opacity: '0' }),
          style({ opacity: '1' }),
        ]))
      ])
    ])
  ]
})
export class ProductCardComponent implements OnInit {
  @Input({ required: true }) product!: ProductCard;
  imgUrl!: string;
  selectedVariant: number | undefined;
  priceFade: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.route.snapshot.url.length === 0) {
      this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2024/04/pizza_halapenio.jpg';
      return;
    }
    const category = this.route.snapshot.url[0].path;


    switch (category) {
      case 'sushi-and-rols':
        this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2024/04/rol_yasu.jpg';
        break;
      case 'sushi-burgers':
        this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2024/04/sushi_burger_z_krevetkoyu.jpg';
        break;
      case 'sushi-sets':
        this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2023/11/%D0%A1%D0%B5%D1%82-%D0%A5%D1%96%D1%82.jpg';
        break;
      case 'burgers':
        this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2024/04/mini_chizburger.jpg';
        break;
      case 'pizza':
        this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2024/04/pizza_halapenio.jpg';
        break;
      case 'soups':
        this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2020/06/tomatnyysyp1200x800-e1620930481597.jpg';
        break;
      case 'salads':
        this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2021/08/salat-s-krevetkamy.jpg';
        break;
      case 'snacks':
        this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2022/08/SUR.jpg';
        break;
      case 'drinks':
        this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2021/09/sandora-yabluko1.jpg';
        break;
      case 'applications':
        this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2023/12/ketchup.jpg';
        break;
      default:
        this.imgUrl = 'https://kvadratsushi.com/wp-content/uploads/2024/04/pizza_halapenio.jpg';
    }
  }

  selectVariant(variant: number | undefined) {
    if (variant !== undefined && variant !== this.selectedVariant)
      this.priceFade = true;

    this.selectedVariant = variant;
  }

  hasMultipleVariations(): boolean {
    return this.product.foodItems.length > 1;
  }

  getSelectedPrice(): number {
    if (this.selectedVariant !== undefined) {
      return this.product.foodItems.find(item => item.id === this.selectedVariant)!.price;
    }

    return this.product.foodItems[0].price;
  }
}
