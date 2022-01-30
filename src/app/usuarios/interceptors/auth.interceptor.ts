import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from "../../usuarios/auth.service";
import { Observable, catchError, throwError } from 'rxjs';
import swal from 'sweetalert2';
/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService,private router:Router){

  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(e=>{
        if (e.status==401) {
      if(this.authService.isAuthenticated()){
        this.authService.logOut();
      }
      this.router.navigate(['/login']);

    }
     if (e.status==403) {
       swal.fire('Acceso Denegado',`${this.authService.usuario.username} no tienes acceso al recurso`,'warning')
      this.router.navigate(['/clientes']);

    }
    return throwError(e);

      })
    );
  }


}
