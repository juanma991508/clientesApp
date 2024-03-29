import { Component, OnInit } from '@angular/core';
import { Cliente } from "./cliente";
import { ModalService } from "./detalle/modal.service";
import { ClienteService } from "./cliente.service";
import  swal  from "sweetalert2";
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from "../usuarios/auth.service";
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
 clientes:Cliente[];
 paginador:any;
  clienteSeleccionado:Cliente;

  constructor(private clienteService: ClienteService,
  private activateRoute: ActivatedRoute,
   public modalService:ModalService,
   public authService:AuthService) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe( params =>{
      let page:number=+params.get('page');
      if(!page)page=0
    this.clienteService.getClientes(page).subscribe(
      (response) =>{ this.clientes=response.content as Cliente[]; this.paginador= response;}
    )});
   this.modalService.notificarUpload.subscribe(cliente=>{
     this.clientes=this.clientes.map(clienteOriginal=>{
        if(cliente.id==clienteOriginal.id){
          clienteOriginal.foto=cliente.foto;
        }
        return clienteOriginal;
      })
    })
  }
delete(cliente:Cliente):void{
const swalWithBootstrapButtons = swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

swalWithBootstrapButtons.fire({
  title: '¿Estas seguro?',
  text: `No podrav recuperar al cliente ${cliente.nombre}${cliente.apellido} `,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Si, estoy seguro',
  cancelButtonText: 'No',
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) {
    this.clienteService.deleteCliente(cliente.id).subscribe(response=>{
      this.clientes=this.clientes.filter( cli => cli !== cliente)
       swalWithBootstrapButtons.fire(
      'Eliminado ',
      `El cliente ${cliente.nombre} ha sido eliminado`,
      'success'
    )
    });

  }
})
}
abrirModal(cliente:Cliente){
  this.clienteSeleccionado=cliente;
  this.modalService.abrirModal();
}
}
