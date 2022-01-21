import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import swal from 'sweetalert2';
import { AuthService } from "../../usuarios/auth.service";

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})
export class DetalleComponent implements OnInit {
  title: String = 'Detalle del Cliente';
  @Input() cliente: Cliente;
  imagenSeleccionada: File;
  progreso: number = 0;
  constructor(private clienteService: ClienteService,public modalService : ModalService, public authService:AuthService) {}

  ngOnInit(): void {}
  seleccionarFoto(event): void {
    this.imagenSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.imagenSeleccionada);
    if (this.imagenSeleccionada.type.indexOf('image') < 0) {
      swal.fire(
        'Error: Upload ',
        `Debe seleccionar un archivo de  imagen`,
        'error'
      );
      this.imagenSeleccionada = null;
    }
  }
  subirFoto() {
    if (!this.imagenSeleccionada) {
      swal.fire('Error: Upload ', `Debe seleccionar una foto`, 'error');
    } else {
      this.clienteService
        .subirFoto(this.imagenSeleccionada, this.cliente.id)
        .subscribe((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            swal.fire(
              'Imagen cliente actualizada',
              `${this.cliente.foto} insertada con exito`,
              'success'
            );
          }
        });
    }
  }
  cerrarModal(){
    this.modalService.cerrarModal();
    this.imagenSeleccionada=null;
    this.progreso=0;
  }
}
