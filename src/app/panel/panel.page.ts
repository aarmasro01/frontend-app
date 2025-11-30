import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AfterViewInit } from '@angular/core';


// Chart.js ESM
import {
  Chart,
  ChartConfiguration,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend
);

type Pedido = { idEstadoPedido: number; fecha?: string; };
type Producto = { idCategoriaMenu: number; idEstadoProducto: number; };

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
})
export class PanelPage implements OnInit, OnDestroy, AfterViewInit {

  // KPI state
  kpis = {
    usuarios: 0,
    productosActivos: 0,
    reclamos: 0,
    ingresoTotal: 0,
    pedidosDelDia: 0,
  };

  // charts
  private chartPedidos?: Chart;
  private chartProductos?: Chart;

  // constants
  private estados = ['Recibidos', 'Confirmados', 'Listos', 'En camino', 'Entregados', 'Cancelados'];
  private categorias = ['Entradas', 'Segundos', 'Bebidas'];
  private colores = ['#007aff', '#34c759', '#ff9500', '#774f22ff', '#5856d6', '#ff2d55'];

  ngOnInit(): void {
    this.cargarKPIs();
  }

  ngAfterViewInit():void{
    setTimeout(() => { 
      this.cargarGraficoPedidos(); 
      this.cargarGraficoProductos(); 
    }, 0); 
  }
  ngOnDestroy(): void {
    this.chartPedidos?.destroy();
    this.chartProductos?.destroy();
  }

  // ============ API calls ============

  private async obtenerUsuarios(): Promise<number> {
    const res = await fetch('https://backend-app-fa5c.onrender.com/api/auth/usuarios');
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  }

  private async obtenerProductos(): Promise<Producto[]> {
    const res = await fetch('https://backend-app-fa5c.onrender.com/api/products/');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }

  private async obtenerProductosDisponibles(): Promise<number> {
    const productos = await this.obtenerProductos();
    return productos.filter(p => p.idEstadoProducto === 1).length;
  }

  private async obtenerReclamos(): Promise<number> {
    const res = await fetch('https://backend-app-fa5c.onrender.com/api/reclamos/obtener');
    const data = await res.json();
    const reclamos = Array.isArray(data?.reclamos) ? data.reclamos : [];
    return reclamos.length;
  }

  private async obtenerIngresoTotal(): Promise<number> {
    const res = await fetch('https://backend-app-fa5c.onrender.com/api/pagos');
    const data = await res.json();
    const pagos = Array.isArray(data) ? data : [];
    let total = 0;
    pagos.forEach((p: any) => total += parseFloat(p.montoPago));
    return total;
  }

  private async obtenerPedidos(): Promise<Pedido[]> {
    const res = await fetch('https://backend-app-fa5c.onrender.com/api/pedidos/all');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }

  private async obtenerPedidosDelDia(): Promise<number> {
    const res = await fetch('https://backend-app-fa5c.onrender.com/api/pedidos/all');
    const data: Pedido[] = await res.json();
    const hoy = new Date().toISOString().split('T')[0];

    return (Array.isArray(data) ? data : []).filter((p) => {
      const fechaPedido = p.fecha?.split('T')[0];
      return fechaPedido === hoy;
    }).length;
  }

  // ============ KPIs ============

  private async cargarKPIs(): Promise<void> {
    const [
      usuarios,
      productosActivos,
      reclamos,
      ingresoTotal,
      pedidosDelDia,
    ] = await Promise.all([
      this.obtenerUsuarios(),
      this.obtenerProductosDisponibles(),
      this.obtenerReclamos(),
      this.obtenerIngresoTotal(),
      this.obtenerPedidosDelDia(),
    ]);

    this.kpis = {
      usuarios,
      productosActivos,
      reclamos,
      ingresoTotal,
      pedidosDelDia,
    };
  }

  // ============ Charts ============

  private async cargarGraficoPedidos(): Promise<void> {
    const [recibidos, confirmados, listos, camino, entregados, cancelados] =
      await Promise.all([
        this.contarEstado(1),
        this.contarEstado(2),
        this.contarEstado(3),
        this.contarEstado(4),
        this.contarEstado(5),
        this.contarEstado(6),
      ]);

    const canvas = document.getElementById('grafico1') as HTMLCanvasElement | null;
    if (!canvas) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.estados,
        datasets: [
          {
            label: 'Cantidad (unidades)',
            data: [recibidos, confirmados, listos, camino, entregados, cancelados],
            backgroundColor: this.colores,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    };

    this.chartPedidos?.destroy();
    this.chartPedidos = new Chart(canvas, config);
  }

  private async cargarGraficoProductos(): Promise<void> {
    const [entradas, segundos, bebidas] = await Promise.all([
      this.contarCategoria(1),
      this.contarCategoria(2),
      this.contarCategoria(3),
    ]);

    const canvas = document.getElementById('grafico3') as HTMLCanvasElement | null;
    if (!canvas) return;

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: this.categorias,
        datasets: [
          {
            label: 'Índice de productos',
            data: [entradas, segundos, bebidas],
            backgroundColor: this.colores,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    };

    this.chartProductos?.destroy();
    this.chartProductos = new Chart(canvas, config);
  }

  // Helpers

  private async contarEstado(estado: number): Promise<number> {
    const pedidos = await this.obtenerPedidos();
    return pedidos.filter(p => p.idEstadoPedido === estado).length;
  }

  private async contarCategoria(categoria: number): Promise<number> {
    const productos = await this.obtenerProductos();
    return productos.filter(p => p.idCategoriaMenu === categoria).length;
  }
}
