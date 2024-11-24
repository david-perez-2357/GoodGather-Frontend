import Location from '@/interface/Location';

function convertToLocation(object: any): Location {
  return {
    code: object.iso2,
    name: object.name
  };
}

function convertToLocationList(objects: any): Location[] {
  return objects.map(convertToLocation);
}

export { convertToLocation, convertToLocationList };
