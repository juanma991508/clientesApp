import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
//import { CLIENTES } from "./clientes.json";
import { Cliente } from './cliente';
import { Observable, of, catchError, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Region } from './region';
import { AuthService } from "../usuarios/auth.service";
@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router,private authService:AuthService) {}
  private agregarAuthorizationHeader(){
    let token=this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization','Bearer' +token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e):boolean{
    if (e.status==401) {
      this.router.navigate(['/login']);
      return true;
    }
     if (e.status==403) {
       swal.fire('Acceso Denegado',`${this.authService.usuario.username} no tienes acceso al recurso`,'warning')
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;

  }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`,{headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);

      })
    );
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
      .post(this.urlEndPoint, cliente, {headers: this.agregarAuthorizationHeader()} )
      .pipe(map((response: any) => response.cliente as Cliente))
      .pipe(
        catchError((e) => {
         if (this.isNoAutorizado(e)) {
            return throwError(e);
         }
          if (e.status === 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }
  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.agregarAuthorizationHeader()}).pipe(
      catchError((e) => {
         if (this.isNoAutorizado(e)) {
            return throwError(e);
         }
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al obtener el cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http
      .put(`${this.urlEndPoint}/${cliente.id}`, cliente,{headers: this.agregarAuthorizationHeader()})
      .pipe(map((response: any) => response.cliente as Cliente))
      .pipe(
        catchError((e) => {
           if (this.isNoAutorizado(e)) {
            return throwError(e);
         }
          //  this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }
  deleteCliente(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.agregarAuthorizationHeader()})
      .pipe(
        catchError((e) => {
           if (this.isNoAutorizado(e)) {
            return throwError(e);
         }
          // this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }
  subirFoto(file: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('id', id);

    let httpHeaders= new HttpHeaders();
    let token=this.authService.token;
    if(token != null){
      httpHeaders=httpHeaders.append('Authorization','Bearer' + token);
    }
    const req = new HttpRequest(
      'POST',
      `${this.urlEndPoint}/upload`,
      formData,
      {
        reportProgress: true,
        headers: httpHeaders
      }

    );

    return this.http.request(req)
    .pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);

      })
    );
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
