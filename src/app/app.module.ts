import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from "@angular/common";
import  localeES   from "@angular/common/locales/es";
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService  } from "./clientes/cliente.service";
import { RouterModule,Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormComponent } from './clientes/form.component';
import { FormsModule } from "@angular/forms";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PaginatorComponent } from './paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalleComponent } from './clientes/detalle/detalle.component';

registerLocaleData(localeES,'ES');
const routes:Routes =[
{path:'',redirectTo:'/clientes',pathMatch:'full'},
{path:'directivas',component: DirectivaComponent},
{path:'clientes',component: ClientesComponent},
{path:'clientes/page/:page',component: ClientesComponent},
{path:'clientes/form', component: FormComponent},
{path:'clientes/form/:id', component: FormComponent},
{path:'clientes/ver/:id', component: DetalleComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule

  ],
  providers: [ClienteService,
  MatDatepickerModule,
    MatNativeDateModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
