import Location from '@/interface/Location';

/**
 * Convert an object to a Location object
 * @param object The object to convert
 * @returns The Location object
 */
function convertToLocation(object: any): Location {
  return {
    code: object.iso2,
    name: object.name
  };
}

/**
 * Convert a list of objects to a list of Location objects
 * @param objects The objects to convert
 * @returns The list of Location objects
 */
function convertToLocationList(objects: any): Location[] {
  return objects.map(convertToLocation);
}

export { convertToLocation, convertToLocationList };
