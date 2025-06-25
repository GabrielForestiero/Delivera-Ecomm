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
  // Propiedades existentes
  orders: (Order & { tempStatus: string })[] = [];
  filteredOrders: (Order & { tempStatus: string })[] = [];
  loading = true;
  updating = false;

  // Propiedades para filtros
  searchTerm = '';
  statusFilter = '';
  paymentFilter = '';

  // Propiedades para notificaciones
  notification: NotificationToast | null = null;

  statusOptions = [
    { label: 'Pendiente', value: 'pending' },
    { label: 'Pagado', value: 'paid' },
    { label: 'Expirado', value: 'expired' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
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

  // Métodos para filtros
  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order._id.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || order.status === this.statusFilter;
      const matchesPayment = !this.paymentFilter || order.paymentMethod === this.paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  // Métodos para el manejo de estados
  onTempStatusChange(order: Order & { tempStatus: string }): void {
    // Este método se ejecuta cuando cambia el select
  }

  confirmStatusUpdate(order: Order & { tempStatus: string }): void {
    if (order.tempStatus === order.status) {
      return;
    }

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

  // Métodos de utilidad para el template
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
      'paypal': 'fab fa-paypal',
      'bank-transfer': 'fas fa-university'
    };
    return icons[paymentMethod] || 'fas fa-money-bill';
  }

  getPaymentMethodLabel(paymentMethod: string): string {
    const labels: { [key: string]: string } = {
      'credit-card': 'Tarjeta de Crédito',
      'paypal': 'PayPal',
      'bank-transfer': 'Transferencia Bancaria'
    };
    return labels[paymentMethod] || paymentMethod;
  }

  // Métodos para notificaciones
  showNotification(type: NotificationToast['type'], message: string): void {
    this.notification = { type, message };
    
    // Auto-ocultar notificación después de 4 segundos
    setTimeout(() => {
      this.notification = null;
    }, 4000);
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
}