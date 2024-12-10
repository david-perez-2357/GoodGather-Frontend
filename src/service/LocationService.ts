import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class LocationService {
  private apiKey: string = 'VjVpcDdzNEtLZFV4c1VJZHNqNXJjY0Z1ZHBpV2lFQWRWbnFBN0hKbQ==';

  constructor(private http: HttpClient) {
  }

  /**@
   * getAllCountries, getCountryByCode, getStatesByCountry, getStateByCode: Realizan solicitudes HTTP para obtener países y estados.
   */
  getAllCountries(): Observable<any> {
    const headers = new HttpHeaders().set("X-CSCAPI-KEY", this.apiKey);

    return this.http.get<any>('https://api.countrystatecity.in/v1/countries', { headers });
  }

  getCountryByCode(iso2: string): Observable<any> {
    const headers = new HttpHeaders().set("X-CSCAPI-KEY", this.apiKey);

    return this.http.get<any>(`https://api.countrystatecity.in/v1/countries/${iso2}`, { headers });
  }

  getStatesByCountry(countryCode: string): Observable<any> {
    const headers = new HttpHeaders().set("X-CSCAPI-KEY", this.apiKey);

    return this.http.get<any>(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, { headers });
  }

  getStateByCode(countryCode: string, stateCode: string): Observable<any> {
    const headers = new HttpHeaders().set("X-CSCAPI-KEY", this.apiKey);

    return this.http.get<any>(`https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}`, { headers });
  }
}
