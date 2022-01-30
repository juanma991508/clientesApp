import { Component, OnInit } from '@angular/core';
import { FacturasService } from "./services/facturas.service";
import { Factura } from "./models/factura";
import  swal  from "sweetalert2";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.css']
})
export class DetalleFacturaComponent implements OnInit {
  public factura:Factura;
  title:string="Detalle de la factura";
  constructor( private activateRoute: ActivatedRoute,private facturasService:FacturasService) { }

  ngOnInit(): void {
    this.cargarFactura();
  }
  cargarFactura(){
    this.activateRoute.paramMap.subscribe((param)=>{
      let id:number=+param.get('id');
      if(id!=0){
        this.facturasService.getFactura(id).subscribe(factura =>{ this.factura = factura;
         console.log(this.factura);
        });


      }
    })
  }


  }
