import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Module } from '../../interfaces/module';
import { GisLayer } from '../../models/gis-layer';
import { Group } from '../../interfaces/group'
import { Capa, Modulo, Grupo } from '../../interfaces/medium/mapa/Modulo';
import { isset, isNumeric } from '../../shared/helpers';

@Injectable()
export class ProjectLayersService
{
  private modulos:Module[];

  private observadorDeCapas:BehaviorSubject<GisLayer[]>;
  public capa$:Observable<GisLayer[]>;
  public capasProyectada$:Observable<GisLayer[]>;

  constructor(
  )
  {
    this.observadorDeCapas = new BehaviorSubject([]);
    this.capa$ = this.observadorDeCapas.asObservable();
    this.capasProyectada$ = this.observadorDeCapas.asObservable().pipe(map(capas => capas.filter(capa => capa.projected)));
  }

  get modulesNumber():number
  {
    return this.modulos.length;
  }

  get thereIsOnlyOneModule():boolean
  {
    return this.modulos.length === 1;
  }

  get thereIsMoreThanOneModule():boolean
  {
    return this.modulos.length > 1;
  }

  public next(modulos:Module[]):void{
    const capas:GisLayer[] = [];
    this.modulos = modulos;
    modulos.forEach(
      modulo => modulo.groups.forEach(
        grupo => grupo.gis_layers.forEach(
          capa => capas.push(capa)
        )
      )
    );

    capas.forEach(capa => {

      capa.refresh = () => capa.wms.setParams(({fake: Date.now()} as any));

      //
      /* capa.filterMap =  () => {

        let filter = {}, cqlFilter = capa.wms.wmsParams.cql_filter;
    
        if( cqlFilter )
        {
          cqlFilter.split(" AND ").forEach((filterStatement:string) => {

            // "atributo" IN (...)
            let attribute = filterStatement.substring(1, filterStatement.indexOf(" IN") - 1);

            // remover parentesis final ")"
            filterStatement = filterStatement.substring(0, filterStatement.length - 1);
      
            filter[attribute] =  filterStatement.substring( filterStatement.indexOf("(") + 1).split(", ").map(
              value => isNumeric(value) ? Number.parseFloat(value) : value.substring(1, value.length - 1)
            );

          });
        }

        if(capa.display_name === "control_obra" || capa.display_name === "gmao")
          filter = "";

        return filter;
      }; */

    });

    this.observadorDeCapas.next(capas);
  }

  public get():GisLayer[]
  {
    return this.observadorDeCapas.getValue();
  }

  public notificarCambioEnObservador():void
  {
    this.next(this.modulos);
  }

    /**
   * Obtener filtros de capas (proyectadas o desproyectadas).
   * @param proyectado:boolean 
   * @returns object
   */
    public obtenerFiltrosDeCapas(proyectado:boolean = true):{[filtroCapa:string]:string}
    {
      return this.get()
                .filter(capa => proyectado ? capa.projected : ! capa.projected )
                .reduce((obj, capa) => {

                  if( capa.display_name !== 'secciones' && capa.display_name !== 'control_obra' && capa.display_name !== 'gmao')
                    obj[`${capa.filterMap}`] = capa.wms.wmsParams.cql_filter ?? "";

                  return obj;

                }, {});
    }

  /**
   *  Obtener capas (todas proyectadas o desproyectadas, por modulo y por modulo y grupo).
   * @param datos 
   * @returns GisLayer[]
   */
    public obtenerCapas(datos?:{modulo:string, grupo:string, proyectado: boolean}):GisLayer[]
    {
      let capas = this.get().filter(capa => ! datos || datos.proyectado ? capa.projected : ! capa.projected);
            
      if( datos)
      {
        switch( true )
        {
          case isset(datos.modulo) && isset(datos.grupo):
            capas = capas.filter(capa => capa.module_id.toString() == datos.modulo && capa.group_id.toString() === datos.grupo);
            break;
  
          case isset(datos.modulo) && ! isset(datos.grupo):
            capas = capas.filter(capa => capa.module_id.toString() === datos.modulo);
            break;
        }
      }

      return capas;
    }

  /**
   *  Obtener modulos (donde todas sus capas esten proyectadas o no).
   * @param proyectado
   * @returns string[]
   */
    public obtenerModulos(proyectado:boolean = true):Module[]
    {
      return proyectado ? this.modulos.filter(
        modulo => modulo.groups.some(
          grupo => ! grupo.gis_layers.every(
            capa => ! capa.projected
          )
        )
      ) :
      this.modulos;
    }

  /**
   *  Obtener grupos por modulo (donde todas sus capas esten proyectadas o no).
   * @returns Grupo[]
   */
    public obtenerGruposPorModulo(nombre:string, proyectado:boolean = true):Grupo[]
    {
      try
      {
        const modulo = this.modulos.find(modulo => modulo.name === nombre);

        if(! modulo)
          throw new Error("Modulo no existe.");
        
          return proyectado ? modulo.groups.filter(
            grupo => grupo.gis_layers.some(
              capa => capa.projected
            )
          ) :
          modulo.grupos;
      }
      catch (error)
      {
        throw error;  
      }
    }

    /**
   * Obtener capa.
   * @param informacionDeCapa
   * @returns GisLayer
   */
    public obtenerCapa(informacionDeCapa:{modulo:string;grupo:string;nombre:string;}| string):GisLayer{
      try{
        let capa:GisLayer;
        if( typeof informacionDeCapa === "string" ){
          capa = this.get().find(capa => capa.filtro_capa === informacionDeCapa);
        }
        else
        {
          capa = this.get().find(capa => 
            capa.modulo === informacionDeCapa.modulo &&
            capa.grupo  === informacionDeCapa.grupo &&
            capa.nombre === informacionDeCapa.nombre
          );
        }

        if(! capa)
          throw new Error("Capa no existe.");
        
        return capa;
      }
      catch (error)
      {
        throw error;  
      }
    }
  
}
