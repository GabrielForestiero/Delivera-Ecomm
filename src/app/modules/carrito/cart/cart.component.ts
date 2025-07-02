import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/carrito/cart.service';
import { Cart } from '../../interfaces/cart';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, ButtonModule, CardModule, RadioButtonModule, InputTextModule, DialogModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  isOpen = false;
  cart: Cart = { items: [], total: 0 };
  isProcessingOrder = false;
  showPaymentDialog = false;


  paymentMethod: 'card' | 'transfer' = 'transfer';
  cardData = {
    cardNumber: '',
    cardCvv: '',
    cardValidThru: '',
    cardHolder: ''
  };

  private subscription?: Subscription;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.subscription = this.cartService.cartOpen$.subscribe(open => this.isOpen = open);

    this.cartService.getCart();

    this.subscription.add(
      this.cartService.cart$.subscribe(cartData => {
        this.cart = cartData;
      })
    );
  }

  incrementarCantidad(productId: string): void {
    this.cartService.addProduct(productId)
  }

  disminuirCantidad(productId: string): void {
    this.cartService.removeProduct(productId)
  }

  eliminarDelCarrito(productId: string): void {
    const item = this.cart.items.find(i => i.productId === productId);
    if (item) {
      this.cartService.removeProduct(productId, item.quantity);
    }
  }

  checkout(): void {
    if (this.cart.items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    this.showPaymentDialog = true;
  }

  processPayment(): void {
    if (this.paymentMethod === 'card') {

      if (!this.cardData.cardNumber || !this.cardData.cardCvv ||
        !this.cardData.cardValidThru || !this.cardData.cardHolder) {
        alert('Por favor, completa todos los datos de la tarjeta');
        return;
      }


      if (!this.isValidCardNumber(this.cardData.cardNumber)) {
        alert('El número de tarjeta no es válido');
        return;
      }


      if (!this.isValidCVV(this.cardData.cardCvv)) {
        alert('El CVV debe tener 3 o 4 dígitos');
        return;
      }


      if (!this.isValidExpiryDate(this.cardData.cardValidThru)) {
        alert('La fecha de vencimiento no es válida o la tarjeta está vencida');
        return;
      }
    }

    this.isProcessingOrder = true;
    this.showPaymentDialog = false;


    const cleanCardNumber = this.cardData.cardNumber.replace(/[\s-]/g, '');
    const cardDataToSend = this.paymentMethod === 'card' ? {
      ...this.cardData,
      cardNumber: cleanCardNumber
    } : undefined;


    this.cartService.createOrder(this.paymentMethod, cardDataToSend)
      .subscribe({
        next: (response) => {
          console.log('Orden creada exitosamente:', response);
          alert('¡Compra finalizada exitosamente!');


          this.cartService.clearCart();


          this.resetPaymentForm();


          this.close();

          this.isProcessingOrder = false;
        },
        error: (error) => {
          console.error('Error al crear la orden:', error);
          alert('Error al procesar la compra. Por favor, intenta nuevamente.');
          this.isProcessingOrder = false;
        }
      });
  }


  isValidCardNumber(cardNumber: string): boolean {

    const cleanNumber = cardNumber.replace(/[\s-]/g, '');

    return /^\d{13,19}$/.test(cleanNumber);
  }

  isValidCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }


  isValidExpiryDate(expiry: string): boolean {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1]);
    const year = parseInt(match[2]) + 2000;

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;


    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  }


  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substring(0, 19);
    }
    this.cardData.cardNumber = formattedValue;
  }


  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.cardData.cardValidThru = value;
  }


  formatCVV(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    this.cardData.cardCvv = value;
  }

  resetPaymentForm(): void {
    this.paymentMethod = 'transfer';
    this.cardData = {
      cardNumber: '',
      cardCvv: '',
      cardValidThru: '',
      cardHolder: ''
    };
  }

  cancelPayment(): void {
    this.showPaymentDialog = false;
    this.resetPaymentForm();
  }

  close() {
    this.cartService.closeCart();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}