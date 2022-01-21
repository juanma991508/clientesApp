import { Component, OnInit } from '@angular/core';
import { Usuario } from "./usuario";
import  swal  from "sweetalert2";
import { AuthService } from "./auth.service";
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  titulo:String = 'Iniciar Sesion';
   usuario:Usuario;

    constructor(private authService:AuthService,private router: Router) {
      this.usuario=new Usuario();
     }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      swal.fire('Login',`Ya estas autenticado : ${this.authService.usuario.username}`,'info')
      this.router.navigate(['/clientes']);
    }
  }
  login():void {
    console.log(this.usuario);
    if (this.usuario.username== null||this.usuario.password== null) {
       swal.fire(
          'Error',
          `Usuario o password incorrecta`,
          'error'
        );
        return;
    }else{
      this.authService.login(this.usuario).subscribe(
        (response)=>{
         // console.log(response);
        // console.log(JSON.parse(atob(response.access_token.split(".")[1]))["user_name"]);
          this.authService.guardarUsuario(response.access_token);
          this.authService.guardarToken(response.access_token);
          let usuario= this.authService.usuario;
          this.router.navigate(['/clientes']);
          swal.fire('Login',`Bienvenido  ${usuario.username}`,'success')
        },(err)=>{
          if(err.status==400){
          swal.fire('Error',`Usuario o contraseña invalida `,'error')
          }
        }
      );
    }


  }

}
