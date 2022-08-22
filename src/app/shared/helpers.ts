import {SweetAlertOptions,SweetAlertResult} from 'sweetalert2/dist/sweetalert2.js'
import swal from 'sweetalert2';

export async function showPreconfirmMessage(
		title:string,
		html:string,
		type:string = "warning",
		cancelButtonText:string = "Cancelar",
		confirmButtonText:string = "Eliminar",
	):Promise<SweetAlertResult>
{
	const swalOptions = {
		title: title,
		html: html,
		type: type,
		showCancelButton: true,
		confirmButtonColor: "#d33",
		cancelButtonColor: "#3085d6",
		cancelButtonText: cancelButtonText,
		confirmButtonText: confirmButtonText,
	} as SweetAlertOptions;

	return await swal.fire(swalOptions);
}

export function toggleFullscreen(event:any):void 
{
	let elem = event instanceof HTMLElement ? event : event.target

	if (!document.fullscreenElement) {
		elem.requestFullscreen().catch(err => {
			alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
		});
	} else {
		document.exitFullscreen();
	}
} 

export function convertHexToRGBA(hexCode:string, opacity:number = 100)
{
    let hex = hexCode.replace('#', '');
    
    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }    
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity / 100})`;
};

export function addAlphaToHexColor(hexCode: string, opacity: number): string
{
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return hexCode + _opacity.toString(16).toUpperCase();
}

/**
 * Verificar si los archivos tienen las extensiones dadas
 * @param files:File[]
 * @param allowedExtensions:string[] 
 * @returns boolean
 */
export function checkIfTheFileExtensionIsCorrect(files:Array<File>, allowedExtensions:Array<string>):boolean
{
    return files.every((file:File) => allowedExtensions.includes( getFileExtension(file) ));
}

export function getFileExtension(file:File):string
{
    return file.name.split('.').pop();    
}

export function getFileName(file:File):string
{
    return file.name.split('.').shift();    
}

export function isJsonString(str:string):boolean 
{
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export async function getFileContent(file:File|Blob, readAs:"text"|"dataURL"|"buffer"|"binary" = "text"):Promise<any>
{
    return new Promise((resolve, reject) => {

        const reader = new FileReader;
    
        reader.onloadend = () => resolve(reader.result);

        reader.onerror = () => reject(new Error("Error al intentar obtener contenido de archivo"));

        switch(readAs)
        {
            case "text":
                reader.readAsText(file);
                break;
            case "dataURL":
                reader.readAsDataURL(file);
                break;
            case "buffer":
                reader.readAsArrayBuffer(file);
                break;
            case "binary":
                reader.readAsBinaryString(file);
                break;
        }

  });
  
}

/**
 * Suspender ejecucion de codigo por un tiempo determinado.
 * @param time - Number : tiempo en milisegundos
 * @returns Promise : void
 */
export async function delayExecution(time:number):Promise<void>
{
    return new Promise(resolve => setTimeout(resolve, time));
}

 export function getRandomColor():string
 {
    let letters = '0123456789ABCDEF';
    let color = '#';
    
    for (let i = 0; i < 6; i++)
    {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  export function sortArray(array:Array<any>, sort:"asc" | "desc"= "asc", propertyOfObject?:string|number):Array<any>
  {
    return array.sort((a, b) => {

        let _a = a, _b = b;

        if( sort === "desc" )
        {
            _a = b;
            _b = a;
        }
        
        if(propertyOfObject)
        {
            _a = _a[propertyOfObject];
            _b = _b[propertyOfObject];
        }
        
        if( isNumeric(_a) && isNumeric(_b) )
        {
            return _a - _b;
        }
        else
        { 
            let value;

            switch(true)
            {
                case _a > _b :
                    value = 1;
                    break;
                case _a < _b :
                    value = -1;
                    break;
                case _a === _b :
                    value = 0;
                    break;
            }

            return value;
           
        }
    });

  }

  export function stringToHtml(htmlString:string):HTMLElement
  {
    const htmlElement = document.createElement("DIV");

    htmlElement.innerHTML = htmlString;

    return (htmlElement.firstElementChild as HTMLElement);
  }

  export function htmlToString(element:HTMLElement):string
  {
    const htmlElement = document.createElement("DIV");

    htmlElement.appendChild(element);

    return htmlElement.innerHTML;
  }

  export function arrayFlatten(array:any[][]):any[]
  {
    return array.reduce((acum, value) => {

        const values = Array.isArray(value[0]) ? arrayFlatten(value) : value;

        return acum.concat(values);
    }, []);
  }

  export function getTimeDiff(from:Date, to:Date = new Date, unit:"minute"|"hour"|"day"|"week" = "day"):number
  {
    const differenceInTime = to.getTime() - from.getTime();

    let result;

    switch(unit)
    {
        case "minute":
         result =  differenceInTime / (1000 * 60);
        break;
        case "hour":
         result =  differenceInTime / (1000 * 60 * 60);
        break;
        case "day":
         result =  differenceInTime / (1000 * 60 * 60 * 24);
        break;
        case "week":
         result =  differenceInTime / (1000 * 60 * 60 * 24 * 7);
        break;
    }
    
    return Number.parseInt(result);
  }

  export function monthDiff(d1:Date, d2:Date):number
  {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

  export function isset(value:any):boolean
  {
      return value !== null && value !== undefined && value.toString().trim() !== "";
  }

  export function lightenDarkenColor(col:string, amt:number):string
  {
    let usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    let num = parseInt(col,16);
 
    let r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    let b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    let g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

export function isNumeric(value:any):boolean
{
    return ! isNaN(value);
}

export function stringToBoolean(string:string):boolean
{
    return string.toLowerCase() === "true";
}

export function typeValue(value:any):any
{
    switch(true)
    {
        case isNumeric(value):
            value = Number.parseFloat(value);
            break;
        case typeof value === "string" && (value.toLowerCase() === "true" || value.toLowerCase() === "false"):
            value = stringToBoolean(value);
            break;
    }

    return value;
}

export function getRandomInt(max:number = 10):number
{
    return Math.floor(Math.random() * max);
}

export async function fetchWithTimeout(url:string, options:{timeout: number}) {
    
    const { timeout } = options;
    
    const controller = new AbortController();

    const maximunWaitingTime = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal  
    });
    
    clearTimeout(maximunWaitingTime);

    return response;
}

export async function resolveAll(promises:{[key:string]:Promise<any>}):Promise<{[key:string]:any}>
{
    try
    {
        let callbacks = [];
    
        for( let [key, promise] of Object.entries(promises) )
        {
            const callback = new Promise(async (resolve, reject) => {
    
                try
                {
                    const data = await promise;

    
                    resolve({key, data});
                }
                catch(error)
                {
                    reject(error);
                }
    
            });
    
            callbacks.push(callback);
        }
    
        const results = await Promise.all(callbacks);

        const data = {};
        
        for(let result of results)
            data[result.key] = result.data;

        return data;
        
    } catch (error)
    {
        throw error;
    }
}

export function applyMixins(derivedCtor: any, constructors: any[]):void
{
    constructors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
            Object.create(null)
        );
      });
    });
}