import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderService } from '../../services/admin/admin.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

interface NotificationToast {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface NewProduct {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  image?: File;
}

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ProgressSpinnerModule,
    DropdownModule,
    FormsModule,
    ButtonModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  activeTab: 'orders' | 'products' = 'orders';


  orders: (Order & { tempStatus: string })[] = [];
  filteredOrders: (Order & { tempStatus: string })[] = [];
  loading = true;
  updating = false;


  searchId = '';
  filterStatus = '';
  filterPaymentMethod = '';


  notification: NotificationToast | null = null;


  statusOptions = [
    { label: 'Pendiente', value: 'pending' },
    { label: 'Pagado', value: 'paid' },
    { label: 'Expirado', value: 'expired' }
  ];


  newProduct: NewProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: undefined
  };


  selectedFileName: string = '';


  imagePreview: string | null = null;

  productCategories = [
    'Bebidas', 'Comidas', 'Postres', 'Snacks', 'Cerveza', 'Vino', 'Tragos',
    'Sin alcohol', 'Promoción', 'Happy Hour', 'Vegano', 'Apto Celíacos',
    'Café y Té', 'Entradas', 'Hamburguesas', 'Pizzas', 'Pastas', 'Sushi', 'Otros'
  ];

  creatingProduct = false;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  setActiveTab(tab: 'orders' | 'products'): void {
    this.activeTab = tab;
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data.map(order => ({
          ...order,
          tempStatus: order.status
        }));
        this.filteredOrders = [...this.orders];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener las órdenes', err);
        this.showNotification('error', 'Error al cargar las órdenes');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchId ||
        order._id.toLowerCase().includes(this.searchId.toLowerCase());
      const matchesStatus = !this.filterStatus || order.status === this.filterStatus;
      const matchesPayment = !this.filterPaymentMethod || order.paymentMethod === this.filterPaymentMethod;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  onTempStatusChange(order: Order & { tempStatus: string }): void {

  }

  confirmStatusUpdate(order: Order & { tempStatus: string }): void {
    if (order.tempStatus === order.status) return;

    this.updating = true;
    this.orderService.updateOrderStatus(order._id, order.tempStatus).subscribe({
      next: () => {
        const oldStatus = order.status;
        order.status = order.tempStatus;
        this.showNotification('success',
          `Orden ${order._id} actualizada de "${this.getStatusLabel(oldStatus)}" a "${this.getStatusLabel(order.status)}"`
        );
        this.updating = false;
      },
      error: (err) => {
        console.error('Error al actualizar el estado', err);
        this.showNotification('error', 'Error al actualizar el estado de la orden');
        this.updating = false;
      }
    });
  }

  trackByOrderId(index: number, order: Order): string {
    return order._id;
  }

  getPendingOrdersCount(): number {
    return this.orders.filter(order => order.status === 'pending').length;
  }

  getTotalRevenue(): number {
    return this.orders
      .filter(order => order.status === 'paid')
      .reduce((total, order) => total + order.total, 0);
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'status-pending',
      'paid': 'status-paid',
      'expired': 'status-expired'
    };
    return statusClasses[status] || 'status-default';
  }

  getStatusLabel(status: string): string {
    const statusOption = this.statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  }

  getPaymentIcon(paymentMethod: string): string {
    const icons: { [key: string]: string } = {
      'credit-card': 'fas fa-credit-card',
      'card': 'fas fa-credit-card',
      'paypal': 'fab fa-paypal',
      'bank-transfer': 'fas fa-university',
      'transfer': 'fas fa-university'
    };
    return icons[paymentMethod] || 'fas fa-money-bill';
  }

  getPaymentMethodLabel(paymentMethod: string): string {
    const labels: { [key: string]: string } = {
      'credit-card': 'Tarjeta de Crédito',
      'card': 'Tarjeta',
      'paypal': 'PayPal',
      'bank-transfer': 'Transferencia Bancaria',
      'transfer': 'Transferencia'
    };
    return labels[paymentMethod] || paymentMethod;
  }

  showNotification(type: NotificationToast['type'], message: string): void {
    this.notification = { type, message };
    setTimeout(() => this.notification = null, 4000);
  }

  getNotificationIcon(type: NotificationToast['type']): string {
    const icons = {
      'success': 'fas fa-check-circle',
      'error': 'fas fa-exclamation-circle',
      'warning': 'fas fa-exclamation-triangle',
      'info': 'fas fa-info-circle'
    };
    return icons[type];
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {

      if (!file.type.startsWith('image/')) {
        this.showNotification('error', 'Por favor seleccione un archivo de imagen válido');
        return;
      }


      if (file.size > 5 * 1024 * 1024) {
        this.showNotification('error', 'La imagen debe ser menor a 5MB');
        return;
      }

      this.newProduct.image = file;
      this.selectedFileName = file.name;


      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  clearImage(): void {
    this.newProduct.image = undefined;
    this.selectedFileName = '';
    this.imagePreview = null;


    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  createProduct(): void {
    if (!this.isProductFormValid()) {
      this.showNotification('error', 'Por favor complete todos los campos obligatorios');
      return;
    }

    this.creatingProduct = true;
    this.orderService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.showNotification('success', 'Producto creado correctamente');
        this.resetProductForm();
        this.creatingProduct = false;
      },
      error: (err) => {
        console.error('Error al crear producto', err);
        this.showNotification('error', 'Hubo un error al crear el producto');
        this.creatingProduct = false;
      }
    });
  }

  resetProductForm(form?: any): void {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      image: undefined
    };

    this.selectedFileName = '';
    this.imagePreview = null;


    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    if (form) {
      form.resetForm();
    }
  }

  private isProductFormValid(): boolean {
    return !!(this.newProduct.name &&
      this.newProduct.price > 0 &&
      this.newProduct.category);
  }
}