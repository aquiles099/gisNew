import { isset } from '../../shared/helpers';
import { Geometry, geometry, Feature, FeatureCollection, Position } from '@turf/helpers';

export type GeometryType = "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";

export class GeoJSONHelper
{
    public static invertGeometry(feature:Feature): any
    {
        let geometry;

        switch (feature.geometry.type) {
            case "Point":
                geometry = [...feature.geometry.coordinates].reverse();
                break;
            case "LineString":
                geometry = feature.geometry.coordinates.map(point => [...point].reverse());
                break;
            case "Polygon":
                geometry = feature.geometry.coordinates.map(pointsArray => pointsArray.map(point => [...point].reverse()))
                break;
            case "MultiLineString":
                geometry = (feature.geometry.coordinates as Position[][]).filter(pointsArray => pointsArray.length) // leaflet editable deja ultimo arreglo de puntos queda vacio.
                    .map(pointsArray => pointsArray.map(point => [...point].reverse()))
                break;
            case "MultiPolygon":
                geometry = feature.geometry.coordinates.map(
                    pointListingArray =>
                        pointListingArray
                            .filter(pointsArray => isset(pointsArray[0])) // leaflet editable deja ultimo arreglo de puntos con undefined.
                            .map(pointsArray => pointsArray.map(point => [...point].reverse()))
                )
                break;
        }

        return geometry;
    }

    public static matchFeatureGeometryType(feature:Feature, geometryType:GeometryType):boolean
    {
        try
        {
            if( feature.geometry.type !== geometryType )
                throw new Error("Invalid feature.");

            const featureGeometry = geometry(geometryType, feature.geometry.coordinates);
            
            return isset(featureGeometry); 
        }
        catch(error)
        {
            return false;
        }
    }
   
    public static removeInvalidFeatures(geojson:FeatureCollection):void
    {
      geojson.features = geojson.features.filter(feature => GeoJSONHelper.featureIsValid(feature));
    }

    public static featureIsValid(feature:Feature<any>):boolean
    {
        return isset(feature.geometry) && 
                isset(feature.geometry.type) &&
                isset(feature.geometry.coordinates) &&
                 feature.geometry.coordinates.length; 
    }

    public static geometryToWkt(geometry:Geometry):string
    {
        try
        {
            const coordinates = geometry.coordinates;
      
            let coordinatesInString;
      
            switch (geometry.type) {
                case "Point":
                  coordinatesInString = `(${coordinates.join(" ")})`;
                  break;
                case "LineString":
                      coordinatesInString = `(${coordinates.map(
                          point => point.join(" ")
                      )})`;
                    break;
                case "Polygon":
                case "MultiLineString":
                    coordinatesInString = `(${coordinates.map(
                      pointArray => `(${pointArray.map(
                        point => point.join(" ")
                      )})`
                    )})`;
                    break;
                case "MultiPolygon":
                    coordinatesInString = `(${coordinates.map(
                      pointListingArray => `(${pointListingArray.map(
                        pointArray => `(${pointArray.map(
                          point => point.join(" ")
                        )})`
                      )})`
                    )})`
                    break;

                default:
                    throw new Error("Tipo de geometria desconocido.");
            }
      
            return geometry.type.toUpperCase() + coordinatesInString;
        }
        catch (error)
        {
            throw error;
        }
    };
  
    public static geometryCoordsToLatLngObject(geometry:Geometry):string
    {
        try
        {
            const coordinates = geometry.coordinates;
            const pointToLngLatObj = point => ({'lng': point[0], 'lat': point[1] }); 
      
            let formattedCoordinates;
      
            switch (geometry.type) {
                case "Point":
                  formattedCoordinates =  pointToLngLatObj( coordinates );
                  break;
                case "LineString":
                      formattedCoordinates = coordinates.map(
                          point => pointToLngLatObj(point)
                      );
                    break;
                case "Polygon":
                case "MultiLineString":
                    formattedCoordinates = coordinates.map(
                      pointArray => pointArray.map(
                        point => pointToLngLatObj(point)
                      )
                    );
                    break;
                case "MultiPolygon":
                    formattedCoordinates = coordinates.map(
                      pointListingArray => pointListingArray.map(
                        pointArray => pointArray.map(
                          point => pointToLngLatObj(point)
                        )
                      )
                    )
                    break;

                default:
                    throw new Error("Tipo de geometria desconocido.");
            }
      
            return formattedCoordinates;
        }
        catch (error)
        {
            throw error;
        }
    };

    public static wktToGeometry(wkt:string):any
    {
        try
        {
            const geometryType = wkt.substring(0, wkt.indexOf("("));
      
            let geometry:any = {
                type: "",
                coordinates: []
            };
    
            const strStart = wkt.indexOf("(") + 1,
                  strEnd = wkt.length - 1;
      
            switch ( geometryType.toLowerCase() )
            {
                case "point":
                    geometry.type = "Point";
                    geometry.coordinates = wkt.substring(strStart, strEnd).split(" ").map(coordInString => Number.parseFloat(coordInString))
                  break;
    
                case "linestring":
                    geometry.type = "LineString";
                    geometry.coordinates = wkt.substring(strStart, strEnd).split(",").map(
                      pointInString => pointInString.split(" ").map(coordInString => Number.parseFloat(coordInString))
                    );
                  break;
    
                case "polygon":
                case "multilinestring":
                    geometry.type = geometryType.toLowerCase().includes("multi") ? "MultiLineString" : "Polygon";
                  geometry.coordinates = wkt.substring(strStart, strEnd).split("),").map(
                    lineInString => lineInString.substring(1).split(",").map(
                      pointInString => pointInString.split(" ").map(coordInString => Number.parseFloat(coordInString))
                    )
                  );
                  break;
    
                case "multipolygon":
                    geometry.type = "MultiPolygon";
                  geometry.coordinates = wkt.substring(strStart, strEnd).split("),").map(
                    polygonInString => polygonInString.substring(1).split("),").map(
                      lineInString => lineInString.substring( lineInString.charAt(0) !== "-" ? 1 : 0 ).split(",").map(
                        pointInString => pointInString.split(" ").map(coordInString => Number.parseFloat(coordInString))
                      )
                    )
                  );
                  break;

                default:
                    throw new Error("Tipo de geometria desconocido.");
            }
      
            return geometry;
    
        }
        catch (error)
        {
            throw error;
        }
    }

    public static sortFeatures(features:Feature[], sortProperty:string, sortMode:"asc"|"desc" = "asc"):void
    {
        features.sort((a, b) => {

            let _a = a, _b = b;

            if( sortMode === "desc" )
            {
                _a = b;
                _b = a;
            }        
            
            if( ! isNaN(_a.properties[sortProperty]) && ! isNaN(_b.properties[sortProperty]) )
            {
                return _a.properties[sortProperty] - _b.properties[sortProperty];
            }
            else
            {
                let value;

                switch(true)
                {
                    case _a.properties[sortProperty] > _b.properties[sortProperty] :
                        value = 1;
                        break;
                    case _a.properties[sortProperty] < _b.properties[sortProperty] :
                        value = -1;
                        break;
                    case _a.properties[sortProperty] === _b.properties[sortProperty] :
                        value = 0;
                        break;
                }

                return value;
            }
        });
    }

    public static invertGeometryCoordinates(geometry:Geometry, lngFirst:boolean=true):void
    {  
        const coordinates:any = geometry.coordinates;
          
      switch( geometry.type )
      {
        case "Point":
          (geometry.coordinates as any) = [
            coordinates[ Number(lngFirst) ],
            coordinates[ Number( !lngFirst ) ]
          ];
          break;
  
        case "LineString":
          geometry.coordinates = coordinates.map(
            _latlng => [  
                _latlng[ Number(lngFirst) ],
                _latlng[ Number( !lngFirst ) ]
              ]
          );
          break;
  
        case "Polygon":
        case "MultiLineString":
          geometry.coordinates = coordinates.map( 
            _latlngsGroup => _latlngsGroup.map( _latlng => {
              return [ 
                _latlng[ Number(lngFirst) ],
                _latlng[ Number( !lngFirst ) ]
             ]
            })
          );
          break;
  
        case "MultiPolygon":
          geometry.coordinates = coordinates.map( arrayGroup => 
            arrayGroup.map(
              _latlngsGroup => _latlngsGroup.map( _latlng => {
                return [ 
                  _latlng[ Number(lngFirst) ],
                  _latlng[ Number( !lngFirst ) ]
               ]
              })
            )
          );
          break;
      }
    }

    public static removeDepthInFeatures(features:Feature<any>[]):void
    {
      try
      {
        const removeDepth = point => point.length === 2 || point.pop();

        for(let feature of features)
        {
          let geometry = feature.geometry;

          switch (geometry.type.toLowerCase())
          {
              case "point":
                removeDepth(geometry.coordinates);
                break;
              case "linestring":
                    geometry.coordinates.map(
                        point => removeDepth(point)
                    );
                  break;
              case "polygon":
              case "multilinestring":
                  geometry.coordinates.map(
                    pointArray => pointArray.map(
                      point => removeDepth(point)
                    )
                  );
                  break;
              case "multipolygon":
                  geometry.coordinates.map(
                    pointListingArray => pointListingArray.map(
                      pointArray => pointArray.map(
                        point => removeDepth(point)
                      )
                    )
                  )
                  break;
  
              default:
                  throw new Error("Tipo de geometria desconocido.");
          }
        }
        
      }
      catch (error)
      {
          throw error;
      }
    }
}