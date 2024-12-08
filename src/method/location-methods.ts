import Location from '@/interface/Location';

/**@
 * Convierte un objeto genérico en un objeto Location.
 * @param object
 */
function convertToLocation(object: any): Location {
  return {
    code: object.iso2,
    name: object.name
  };
}

/**2
 * Convierte una lista de objetos genéricos a una lista de Location.
 * @param objects
 */

function convertToLocationList(objects: any): Location[] {
  return objects.map(convertToLocation);
}

export { convertToLocation, convertToLocationList };
