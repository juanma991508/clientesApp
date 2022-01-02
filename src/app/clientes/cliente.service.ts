import { Injectable } from '@angular/core';
import { formatDate } from "@angular/common";
//import { CLIENTES } from "./clientes.json";
import { Cliente } from "./cliente";
import { Observable,of,catchError,throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map,tap } from "rxjs/operators";
import swal from "sweetalert2";

import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
private urlEndPoint:string='http://localhost:8080/api/clientes';
private httpHeaders= new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient , private router:Router) { }


  getClientes(page: number): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint+"/page/"+page).pipe(
      //Tap permi
      tap( (response:any) =>{

        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);

        })
      }),
      map((response:any)=> {

         (response.content as Cliente[]).map( cliente =>{
        //  cliente.nombre= cliente.nombre.toUpperCase();
        //  cliente.createAt=formatDate(cliente.createAt,'dd/MM/yyyy','ES')
          return cliente;
        })
        return response;
      })
    );
    }
create(cliente:Cliente):Observable<Cliente>{
return this.http.post(this.urlEndPoint,cliente,{headers: this.httpHeaders}).pipe(
  map((response:any) => response.cliente as Cliente)
).pipe(
    catchError(e=>{
    //  this.router.navigate(['/clientes']);
    if(e.status===400){
      return throwError(e);

    }
      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje,e.error.error,'error');
      return throwError(e);
    })
  );
}
getCliente(id):Observable<Cliente>{
  return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
    catchError(e=>{
      this.router.navigate(['/clientes']);
      console.error(e.error.mensaje);
      swal.fire('Error al obtener el cliente',e.error.mensaje,'error');
      return throwError(e);
    })
  )
}

updateCliente(cliente : Cliente):Observable<Cliente>{
  return this.http.put(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers: this.httpHeaders}).pipe(
  map((response:any) => response.cliente as Cliente)
).pipe(
    catchError(e=>{
    //  this.router.navigate(['/clientes']);
      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje,e.error.error,'error');
      return throwError(e);
    })
  )
}
deleteCliente(id : number):Observable<Cliente>{
  return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.httpHeaders}).pipe(
    catchError(e=>{
     // this.router.navigate(['/clientes']);
      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje,e.error.error,'error');
      return throwError(e);
    })
  )
}
subirFoto(file:File,id):Observable<Cliente>{
  let formData=new FormData();
  formData.append("file",file);
  formData.append("id",id);
  return this.http.post(`${this.urlEndPoint}/upload`,formData).pipe(
    map((response :any)=> response.cliente as Cliente ),
    catchError(e=>{
     // this.router.navigate(['/clientes']);
      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje,e.error.error,'error');
      return throwError(e);
    })

  )
}




}
