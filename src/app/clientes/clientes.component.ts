import { Component, OnInit } from '@angular/core';
import { Cliente } from "./cliente";
import { ClienteService } from "./cliente.service";
import  swal  from "sweetalert2";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
 clientes:Cliente[];
 paginador:any;
  constructor(private clienteService: ClienteService,private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe( params =>{
      let page:number=+params.get('page');
      if(!page)page=0
    this.clienteService.getClientes(page).subscribe(
      (response) =>{ this.clientes=response.content as Cliente[]; this.paginador= response;}
    )});
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
}
