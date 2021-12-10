import { Component, OnInit } from '@angular/core';
import { Cliente } from "./cliente";
import { ClienteService } from "./cliente.service";
import { Router,ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
public cliente:Cliente=new Cliente();
public title:String="Crear cliente";

  constructor(private clienteService: ClienteService,
  private router: Router,private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }
  public create():void{
   this.clienteService.create(this.cliente).subscribe(
     cliente => {

         this.router.navigate(['/clientes'])
         swal.fire('Nuevo cliente',`Cliente ${cliente.nombre} creado con exito`,'success')
       }
     )
  }
  cargarCliente():void{
    this.activateRoute.params.subscribe(params => {
      let id=params['id'];
      if(id){
        this.clienteService.getCliente(id).subscribe(
          (cliente) => this.cliente=cliente
        )
      }
    } );

  }
  updateCliente():void{
    this.clienteService.updateCliente(this.cliente).subscribe(cliente => {
      this.router.navigate(['/clientes'])
         swal.fire('Cliente actualizado',`Cliente ${cliente.nombre} actualizado correctamente`,'success')
       });

  }

}
