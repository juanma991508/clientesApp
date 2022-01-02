import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})
export class DetalleComponent implements OnInit {
  title: String = 'Detalle del Cliente';
  cliente: Cliente;
  private imagenSeleccionada : File;
  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let id: number = +params.get('id');
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente;
        });
      }

    });
  }
     seleccionarFoto(event):void{
      this.imagenSeleccionada =event.target.files[0];
     console.log(this.imagenSeleccionada)
    }
    subirFoto(){
      this.clienteService.subirFoto(this.imagenSeleccionada,this.cliente.id).subscribe(cliente=>{
        this.cliente=cliente;
         swal.fire(
          'Imagen cliente actualizada',
          `${cliente.foto} insertada con exito`,
          'success'
        );

      })
    }
}
