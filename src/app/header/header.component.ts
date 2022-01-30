import { Component } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  titleNav = 'Angular';
  constructor(public authService: AuthService, private router: Router) {}
  logOut(): void {
    let username = this.authService.usuario?.username;
    swal.fire(
      'Logout',
      `Hola ${username} ha cerrado sesion con exito`,
      'success'
    );
    this.router.navigate(['/login']);
    this.authService.logOut();
  }
}
