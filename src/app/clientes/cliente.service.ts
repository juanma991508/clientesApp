import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
//import { CLIENTES } from "./clientes.json";
import { Cliente } from './cliente';
import { Observable, of, catchError, throwError } from 'rxjs';
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Region } from './region';
import { URL_BACKEND } from "../config/config";

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = URL_BACKEND +'/api/clientes';


  constructor(private http: HttpClient, private router: Router) {}



  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`);
  }

  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      //Tap permi
      tap((response: any) => {
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombre);
        });
      }),
      map((response: any) => {
        (response.content as Cliente[]).map((cliente) => {
          //  cliente.nombre= cliente.nombre.toUpperCase();
          //  cliente.createAt=formatDate(cliente.createAt,'dd/MM/yyyy','ES')
          return cliente;
        });
        return response;
      })
    );
  }
  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post(this.urlEndPoint, cliente )
      .pipe(map((response: any) => response.cliente as Cliente))
      .pipe(
        catchError((e) => {

          if (e.status === 400)         return throwError(e);

          if(e.error.mensaje) console.error(e.error.mensaje);

          return throwError(e);
        })
      );
  }
  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        if(e.status!=401 && e.error.mensaje){
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http
      .put(`${this.urlEndPoint}/${cliente.id}`, cliente)
      .pipe(map((response: any) => response.cliente as Cliente))
      .pipe(
        catchError((e) => {

          //  this.router.navigate(['/clientes']);
          if(e.error.mensaje) console.error(e.error.mensaje);

          return throwError(e);
        })
      );
  }
  deleteCliente(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndPoint}/${id}`)
      .pipe(
        catchError((e) => {

          // this.router.navigate(['/clientes']);
          if(e.error.mensaje) console.error(e.error.mensaje);


          return throwError(e);
        })
      );
  }
  subirFoto(file: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('id', id);



    const req = new HttpRequest(
      'POST',
      `${this.urlEndPoint}/upload`,
      formData,
      {
        reportProgress: true,

      }

    );

    return this.http.request(req);

    /**
  .pipe(
    map((response :any)=> response.cliente as Cliente ),
    catchError(e=>{
     // this.router.navigate(['/clientes']);
      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje,e.error.error,'error');
      return throwError(e);
    })

  ) */
  }
}
