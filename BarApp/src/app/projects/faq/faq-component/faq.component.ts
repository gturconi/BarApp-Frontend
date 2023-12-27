import { Component, OnInit } from '@angular/core';
import { LoginService } from '@common/services/login.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  categorias: any[] = [];
  preguntas: any[] = [];
  preguntasFiltradas: any[] = [];

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.loadFaq();
  }

  loadFaq() {
    if (this.loginService.isLoggedIn()) {
      if (this.loginService.isAdmin()) {
        this.loadFaqAdmin();
      } else if (this.loginService.isEmployee()) {
        this.loadFaqEmployee();
      } else {
        this.loadFaqUsers();
      }
    } else {
      this.loadFaqUsers();
    }
  }

  loadFaqAdmin() {
    this.categorias = [
      { nombre: 'Forma de pago', icono: 'card-outline' },
      { nombre: 'Cuenta', icono: 'people-outline' },
      { nombre: 'Pedido', icono: 'reader-outline' },
      { nombre: 'Reserva', icono: 'calendar-outline' },
      { nombre: 'Escanear QR', icono: 'qr-code-outline' },
    ];
    this.preguntas = [
      {
        categoria: 'Forma de pago',
        pregunta: '¿Cómo pago?',
        respuesta: 'Respuesta 1',
      },
      {
        categoria: 'Forma de pago',
        pregunta: '¿Cómo pago?',
        respuesta: 'Respuesta 1',
      },
      {
        categoria: 'Cuenta',
        pregunta: 'Otra pregunta',
        respuesta: 'Respuesta 2',
      },
    ];
    this.filterQuestionsByCategory(this.categorias[0]); // Seleccionar la primera categoría
  }

  loadFaqEmployee() {
    // Cargar categorías y preguntas específicas para el empleado
    this.categorias = [
      // Categorías para el empleado
    ];
    this.preguntas = [
      // Preguntas para el empleado
    ];
    this.filterQuestionsByCategory(this.categorias[0]); // Seleccionar la primera categoría
  }

  loadFaqUsers() {
    this.categorias = [
      { nombre: 'Forma de pago', icono: 'card-outline' },
      { nombre: 'Cuenta', icono: 'people-outline' },
      { nombre: 'Pedido', icono: 'reader-outline' },
      { nombre: 'Reserva', icono: 'calendar-outline' },
      { nombre: 'Escanear QR', icono: 'qr-code-outline' },
    ];
    this.preguntas = [
      {
        categoria: 'Forma de pago',
        pregunta: '¿Cómo pago?',
        respuesta: 'Respuesta 1',
      },
      {
        categoria: 'Forma de pago',
        pregunta: '¿Cómo pago?',
        respuesta: 'Respuesta 1',
      },
      {
        categoria: 'Cuenta',
        pregunta: '¿Cómo me registro?',
        respuesta: 'Respuesta 2',
      },
      {
        categoria: 'Cuenta',
        pregunta: '¿Cómo inicio sesión?',
        respuesta: 'Respuesta 2',
      },
      {
        categoria: 'Cuenta',
        pregunta: '¿Puedo editar los datos de mi cuenta?',
        respuesta: 'Respuesta 2',
      },
    ];
    this.filterQuestionsByCategory(this.categorias[0]); // Seleccionar la primera categoría
  }

  filterQuestionsByCategory(categoria: any) {
    this.preguntasFiltradas = this.preguntas.filter(
      pregunta => pregunta.categoria === categoria.nombre
    );
  }
}
