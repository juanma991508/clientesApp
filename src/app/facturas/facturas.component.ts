import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { FacturasService } from './services/facturas.service';
import { Producto } from './models/producto';
import { ItemFactura } from './models/item-factura';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import  swal  from "sweetalert2";
@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css'],
})
export class FacturasComponent implements OnInit {
  title: string = 'Nueva Factura';
  factura: Factura = new Factura();
  autocompleteControl = new FormControl();
  //productos: string[] = ['Mesa', 'TV', 'Sony','Tablet','Bicicleta'];
  productosFiltrados: Observable<Producto[]>;

  constructor(
    private clienteService: ClienteService,
    private activateRoute: ActivatedRoute,
    private facturasService: FacturasService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.cargarClienteEnFactura();
    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map((value) => (typeof value === 'string' ? value : value.nombre)),
      flatMap((value) => (value ? this._filter(value) : []))
    );
  }

  cargarClienteEnFactura() {
    this.activateRoute.paramMap.subscribe((param) => {
      let clienteId: number = +param.get('clienteId');

      this.clienteService.getCliente(clienteId).subscribe((cliente) => {
        this.factura.cliente = cliente;
      });
    });
  }
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturasService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }
  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
   // console.log(producto);

   if(this.existeItem(producto.id)){

     this.incrementaCantidad(producto.id);
   }else{
    let nuevoItem = new ItemFactura();
    nuevoItem.producto = producto;
    this.factura.items.push(nuevoItem);
   }
    //console.log(this.factura.items);
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }
  actulizarCantidad(id :number,event:any):void{
    let cantidad:number= event.target.value as number;
    if(cantidad==0){
      return this.delete(id);
    }
    this.factura.items= this.factura.items.map((item:ItemFactura) =>{
      if(id===item.producto.id){
        item.cantidad=cantidad;
      }
      return item;
    })


  }
   crearFactura(facturaForm):void{
     if(this.factura.items.length == 0) this.autocompleteControl.setErrors({'invalid' : true});
     if(facturaForm.form.valid || this.factura.items.length > 0){
      this.facturasService.createFactura(this.factura).subscribe(factura=>{
        swal.fire(this.title,`Factura ${factura.descripcion} creada con exito!`);
        this.route.navigate(['/clientes'])
      })
     }
    }
existeItem(id:number):boolean{
  let existe=false;
  this.factura.items.forEach((item:ItemFactura)=>{
    if(id===item.producto.id){
      existe=true;
    }

  })
 return existe;
}
incrementaCantidad(id:number):void{

 this.factura.items= this.factura.items.map((item:ItemFactura) =>{
      if(id===item.producto.id){
        ++item.cantidad;
      }
      return item;
    })

}
delete(id: number):void{
  this.factura.items = this.factura.items.filter((item: ItemFactura)=>{ id !== item.producto.id; })
}
}
