import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent implements OnInit,OnChanges {
@Input() paginador:any;
desde:number;
hasta:number;
paginas: number[];

  constructor() { }

  ngOnInit(): void {
    this.initPaginator();
  }
ngOnChanges(changes: SimpleChanges):void
{
let paginadorActualizado=changes['paginador'];
if(paginadorActualizado.previousValue){
  this.initPaginator();
}
}
private initPaginator():void{
   this.desde=Math.min(Math.max(1,this.paginador.number-4),this.paginador.totalPages-5);
    this.hasta=Math.max(Math.min(this.paginador.totalPages,this.paginador.number+4),6)
    if(this.paginador.totalPages >5){
      this.paginas = new Array(this.hasta-this.desde+1).fill(0).map((_valor,indice) => indice+this.desde)
  }else{
    this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor,indice) => indice+1)
  }
}
}
