import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Case } from './CaseModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaseServiceService {
  caseData: any = []
  cases: Case[] = []
  locationsData: any = []
  locations: any[] = []

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'pkZYsmXsF5Wg40SDzT6LjdUNu7FxXb'
    })
  };

  constructor(private http: HttpClient) { 
    
  }

  /**
   * Used for getting data
   * @returns Observable to a get request for case data
   */
  getCaseObservable(): Observable<any> {
    return this.http.get<Object>('https://272.selfip.net/apps/nxRNBp1Q5H/collections/cases/documents/cases1/')
  }

  /**
   * Used for getting data
   * @returns Observable for location data
   */
  getLocationObservable(): Observable<any> {
    return this.http.get<Object>('https://272.selfip.net/apps/nxRNBp1Q5H/collections/locations/documents/locations1/')
  }

  /**
   * Used for adding data
   * @param newCase: New case to be added into REST server
   * @returns Observable to newly updated data
   */
  putCaseObservable(newCase: Case): Observable<any> {
    this.cases.push(newCase)

    const casesJSON: Object[] = []
    this.cases.forEach( (currentCase) => {
      casesJSON.push(JSON.stringify(currentCase))
    } )
    
    return this.http.put<Object>('https://272.selfip.net/apps/nxRNBp1Q5H/collections/cases/documents/cases1/', 
    {
        "key": "cases1",
        "data": casesJSON
      }, this.httpOptions)
  }
    
  /**
   * Used for adding data
   * @param newLocation: New location to be added into REST server
   * @returns Observable to newly updated data
   */
  putLocationsObservable(newLocation: any): Observable<any> {
    this.locations.push(newLocation)
    
    const locationsJSON: Object[] = []
    this.locations.forEach( (currentLocation) => {
      locationsJSON.push(JSON.stringify(currentLocation))
    } )

    return this.http.put<Object>('https://272.selfip.net/apps/nxRNBp1Q5H/collections/locations/documents/locations1/', 
    {
      "key": "locations1",
      "data": locationsJSON
    }, this.httpOptions)
  }

  /**
   * Used for updating data
   * @param locationsJSON: JSON array of locations
   * @returns Observable to newly updated data
   */
  putLocationsCountObservable(locationsJSON: Object[]): Observable<any> {
    return this.http.put<Object>('https://272.selfip.net/apps/nxRNBp1Q5H/collections/locations/documents/locations1/', 
    {
      "key": "locations1",
      "data": locationsJSON
    }, this.httpOptions)
  }

  /**
   * Used for updating data
   * @param casesJSON: JSON array of cases
   * @returns Observable to newly updated data
   */
  updateCaseObservable(casesJSON: Object[]): Observable<any> {
    return this.http.put<Object>('https://272.selfip.net/apps/nxRNBp1Q5H/collections/cases/documents/cases1/', 
    {
      "key": "cases1",
      "data": casesJSON
    }, this.httpOptions)
  }

  /**
   * Top level get function for cases
   * @returns Promise for case array from REST server
   */
  async getCases(): Promise<Case[]> {
    return new Promise( (resolve, reject) => {
      this.getCaseObservable()
      .subscribe( (data: any) => {
        var casesTemp = []
        this.caseData = data

        let i = 0;
        while(this.caseData.data[i]) {
          var name = JSON.parse(this.caseData.data[i]).name
          var phone = JSON.parse(this.caseData.data[i]).phone
          var id = JSON.parse(this.caseData.data[i]).id
          var location = JSON.parse(this.caseData.data[i]).location
          var date = JSON.parse(this.caseData.data[i]).date
          var info = JSON.parse(this.caseData.data[i]).info

          var newCase = new Case(name, phone, id, location, date, info)
          casesTemp.push(newCase)
          i++
        }
        this.cases = casesTemp
        resolve(casesTemp)
      })
    })
  }
  
  /**
   * Top level get function for locations
   * @returns Promise for location array from REST server
   */
  async getLocations(): Promise<any[]> {
    return new Promise( (resolve, reject) => {
      this.getLocationObservable()
      .subscribe( (data: any) => {
        var locationsTemp = []
        this.locationsData = data

        let i = 0
        while(this.locationsData.data[i]) {
          locationsTemp.push(JSON.parse(this.locationsData.data[i]))
          i++
        }
        this.locations = locationsTemp
        resolve(locationsTemp)
      })
    })
  }
  
  /**
   * Top level function for adding cases
   * @param newCase: New case to be added
   * @returns Promise for newly updated case array
   */
  async addCase(newCase: Case): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.putCaseObservable(newCase)
      .subscribe( (data:any) => {
        resolve(data)
      } )
    } )
  }
  
  /**
   * Top level function for deleting a case
   * @param id: id of case
   * @returns Promise for newly updated case array
   */
  async deleteCase(id:number): Promise<any> {
    console.log(id)
    for(let i = 0; i < this.cases.length; i++) {
      if(this.cases[i].getID() === id) {
        this.cases.splice(i, 1)
      }
    }
    console.log(this.cases)


    console.log(this.cases)
    const casesJSON: Object[] = []
    this.cases.forEach( (currentCase) => {
      casesJSON.push(JSON.stringify(currentCase))
    } )

    return new Promise( (resolve, reject) => {
      this.updateCaseObservable(casesJSON)
      .subscribe( (data:any) => {
        resolve(data)
      } )
    } )
  }

  /**
   * Top level function for adding new location
   * @param newLocation: new location to be added
   * @returns Promise to newly updated locations array
   */
  async addLocation(newLocation: any): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.putLocationsObservable(newLocation)
      .subscribe( (data:any) => {
        resolve(data)
      } )
    } )
  }

  /**
   * Updating the count of a location
   * @param location: name of location
   * @param count: new count of that location
   * @returns Promise to newly updated locations array
   */
  async updateLocationCount(location: string, count: number): Promise<any> {
    for(let i = 0; i < this.locations.length; i++) {
      if(this.locations[i].location === location) {
        this.locations[i].count = count 
      }
    }
    const locationsJSON: Object[] = []
    this.locations.forEach( (location) => {
      locationsJSON.push(JSON.stringify(location))
    } )

    return new Promise( (resolve, reject) => {
      this.putLocationsCountObservable(locationsJSON)
      .subscribe( (data:any) => {
        resolve(data)
      } )
    } )
  }

  /**
   * Search for a location
   * @param location: target location
   * @returns The location that has been found or null
   */
  findLocation(location: string): any {
    for(let i = 0; i < this.locations.length; i++) {
      if(this.locations[i].location === location) {
        return this.locations[i]
      }
    }
    return null
  }
}
