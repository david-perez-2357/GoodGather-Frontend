import Location from '@/interface/Location';

/**
 * Convierte un objeto genérico en un objeto de tipo `Location`.
 * Este método toma un objeto con datos de ubicación y lo transforma en una
 * instancia de la interfaz `Location` con las propiedades esperadas.
 * @param {any} object - Objeto genérico que contiene información de ubicación.
 * @returns {Location} Objeto `Location` con las propiedades `code` y `name` mapeadas desde el objeto original.
 */
function convertToLocation(object: any): Location {
  return {
    code: object.iso2,
    name: object.name
  };
}


/**
 * Convierte una lista de objetos genéricos en una lista de objetos de tipo `Location`.
 * Este método aplica la conversión definida en `convertToLocation` a cada objeto
 * de una lista, generando un arreglo de instancias de `Location`.
 * @param {any[]} objects - Lista de objetos genéricos que contienen información de ubicación.
 * @returns {Location[]} Arreglo de objetos `Location` transformados.
 */
function convertToLocationList(objects: any): Location[] {
  return objects.map(convertToLocation);
}

export { convertToLocation, convertToLocationList };
