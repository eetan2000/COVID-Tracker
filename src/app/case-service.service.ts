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

  constructor(private http: HttpClient) { }

  getCaseObservable(): Observable<any> {
    return this.http.get<Object>('https://272.selfip.net/apps/nxRNBp1Q5H/collections/cases/documents/cases1/')
  }

  async getCases(): Promise<Case[]> {
    return new Promise( (resolve, reject) => {
      this.getCaseObservable()
      .subscribe( (data: any) => {
        this.caseData = data

        let i = 0;
        while(this.caseData.data[i]) {
          var name = JSON.parse(this.caseData.data[i]).name
          var phone = JSON.parse(this.caseData.data[i]).phone
          var id = JSON.parse(this.caseData.data[i]).id
          var location = JSON.parse(this.caseData.data[i]).location
          var info = JSON.parse(this.caseData.data[i]).info

          var newCase = new Case(name, phone, id, location, info)
          this.cases.push(newCase)
          i++
        }

        resolve(this.cases)
      })
    })
  }
}
