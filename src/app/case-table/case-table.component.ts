import { Component, Input, OnInit } from '@angular/core';
import { CaseServiceService } from '../case-service.service';
import { Case } from '../CaseModel';
import { Modal } from 'bootstrap';

declare var bootstrap:any;

@Component({
  selector: 'app-case-table',
  templateUrl: './case-table.component.html',
  styleUrls: ['./case-table.component.css']
})
export class CaseTableComponent implements OnInit{
  cases: Case[] = []
  locations: any[] = []
  @Input() showMarker!: (id: number) => void
  @Input() addMarker!: (id:number, latitude:number, longitude:number, location:string, count: number) => void
  private createModal: Modal | undefined
  private locationModal: Modal | undefined
  private moreModal: Modal | undefined
  showLocationInputs: boolean = false

  //more info vars
  name: string = ""
  id: string = ""
  contact: string = ""
  date: string = ""
  location: string = ""
  info: string = ""
  latitude: string = ""
  longitude: string = ""


  constructor(private caseService: CaseServiceService) {  }

  async ngOnInit() {
    this.cases = await this.caseService.getCases()
    this.locations = await this.caseService.getLocations()

    document.querySelectorAll(".table-sortable th").forEach( (headerCell) => {
      if(headerCell.innerHTML !== "" && headerCell.innerHTML !== "Status") {
        headerCell.addEventListener("click", () => {
          const tableElement = headerCell.parentElement!.parentElement!.parentElement as HTMLTableElement
          const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement!.children, headerCell)
          const currentIsAscending = headerCell.classList.contains("th-sort-asc");

          this.sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        })
      }
    })
    
    for(let i = 0; i < this.cases.length; i++) {
      const tableBodyNode = document.getElementById("tbody")

      const newRow = document.createElement("tr")
      newRow.id = this.cases[i].getID().toString();

      const locationTd = document.createElement("td")
      locationTd.innerHTML = this.cases[i].getLocation()
      locationTd.style.verticalAlign = "middle"

      const reportedTd = document.createElement("td")
      reportedTd.innerHTML = this.cases[i].getName()
      reportedTd.style.verticalAlign = "middle"

      const dateTd = document.createElement("td")
      dateTd.innerHTML = this.cases[i].getDate()
      dateTd.style.verticalAlign = "middle"

      const locateElement = document.createElement("td");
      const locateButton = document.createElement("button");
      locateButton.innerHTML = "Locate"
      locateButton.type = "button"
      locateButton.className = "btn btn-outline-success"
      locateButton.style.verticalAlign = "middle"
      locateElement.appendChild(locateButton);

      const moreInfoElement = document.createElement("td");
      const moreInfoButton = document.createElement("button");
      moreInfoButton.innerHTML = "More Info"
      moreInfoButton.type = "button"
      moreInfoButton.className = "btn btn-outline-primary"
      moreInfoElement.style.verticalAlign = "middle"
      moreInfoElement.appendChild(moreInfoButton);

      const deleteElement = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-outline-danger"
      deleteButton.type = "button"
      deleteButton.innerHTML = "Remove"
      deleteElement.appendChild(deleteButton);

      locateButton.addEventListener("click", (event) => {
        this.showMarker(this.cases[i].getID())
        window.scrollTo(0,50)
      })

      moreInfoButton.addEventListener("click", (event) => {
        this.moreModal = new bootstrap.Modal(document.getElementById("moreInfoModal"), {
          keyboard: false
        })
        this.name = this.cases[i].getName()
        this.contact = this.cases[i].getPhone()
        this.id = this.cases[i].getID().toString()
        this.location = this.cases[i].getLocation()
        this.info = this.cases[i].getInfo()
        this.date = this.cases[i].getDate()
        this.moreModal?.show()
      })

      deleteButton.addEventListener("click", async (event) => {
        this.location = this.cases[i].getLocation()
        this.id = this.cases[i].getID().toString()
        
        if(this.cases.length === 1) {
          await this.caseService.updateLocationCount(this.location, 0)
          await this.caseService.deleteCase(parseInt(this.id))
          tableBodyNode?.removeChild(tableBodyNode.firstElementChild as HTMLTableRowElement)
        }
        else {
          var count
          for(let i = 0; i < this.locations.length; i++) {
            if(this.location === this.locations[i].location) {
              count = this.locations[i].count
            }
          }
          count--
          await this.caseService.updateLocationCount(this.location, count)
          await this.caseService.deleteCase(parseInt(this.id))
          document.getElementById(this.id)?.remove()
        }
      })

      newRow.appendChild(locationTd)
      newRow.appendChild(reportedTd)
      newRow.appendChild(dateTd)
      newRow.appendChild(locateElement)
      newRow.appendChild(moreInfoElement)
      newRow.appendChild(deleteElement)
      tableBodyNode?.appendChild(newRow)
    }


    const selectElement = document.getElementById("locationSelect") as HTMLSelectElement
    for(let i = 0; i < this.locations.length; i++) {
      const optionElement = document.createElement("option")
      optionElement.value = this.locations[i].location
      optionElement.innerHTML = this.locations[i].location
      selectElement.appendChild(optionElement)
    }
  }

  sortTableByColumn(table: HTMLTableElement, column: number, asc: boolean = true ) {
    const dirModifier = asc ? 1 : -1
    const tBody = table.tBodies[0]
    const rows = Array.from(tBody.querySelectorAll("tr"))

    //sort each row
    const sortedRows = rows.sort( (a, b) => {
      const aColText = a.querySelector(`td:nth-child(${column + 1})`)!.textContent!.trim();
      const bColText = b.querySelector(`td:nth-child(${column + 1})`)!.textContent!.trim();

      return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier)
    })

    //remove all existing TRs from the table
    while(tBody.firstChild) {
      tBody.removeChild(tBody.firstChild);
    }

    //re-add newly sorted rows
    tBody.append(...sortedRows)

    //remember how column is sorted
    table.querySelectorAll("th").forEach( (th) => (th.classList.remove("th-sort-asc", "th-sort-desc")) )
    table.querySelector(`th:nth-child(${column + 1})`)!.classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column + 1})`)!.classList.toggle("th-sort-des", !asc);
  }

  /**
   * Create case popup
   */
  createCaseModal() {
    this.createModal = new bootstrap.Modal(document.getElementById("createModal"), {
      keyboard: false
    })
    this.createModal?.show()
  }

  /**
   * Location popup
   */
  createLocationModal() {
    var name = (document.getElementById("nameInput") as HTMLInputElement).value
    var phone = (document.getElementById("phoneInput") as HTMLInputElement).value
    var id = (document.getElementById("idInput") as HTMLInputElement).value

    if(name === "" || phone === "" || id === "") {
      window.alert("Please fill the patient's name, phone number and medical ID")
      return;
    }
    else {
      this.createModal?.hide()
      this.locationModal = new bootstrap.Modal(document.getElementById("locationModal"), {
        keyboard: false
      })
      this.locationModal?.show()
    }
  }

  /**
   * Logic function to handle location selecting
   */
  addLocationInput() {
    var locationSelectElement = (document.getElementById("locationSelect") as HTMLSelectElement)
    var switchButton = document.getElementById("addLocationButton") as HTMLButtonElement

    if(this.showLocationInputs === false) {
      const locationInput = document.getElementById("locationInput") as HTMLInputElement
      locationInput.style.visibility = "visible"
      const latitudeInput = document.getElementById("latitudeInput") as HTMLInputElement
      latitudeInput.style.visibility = "visible"
      const longitudeInput = document.getElementById("longitudeInput") as HTMLInputElement
      longitudeInput.style.visibility = "visible"
      switchButton.innerHTML = "-"
      locationSelectElement.disabled = true
    }
    else {
      const locationInput = document.getElementById("locationInput") as HTMLInputElement
      locationInput.style.visibility = "hidden"
      const latitudeInput = document.getElementById("latitudeInput") as HTMLInputElement
      latitudeInput.style.visibility = "hidden"
      const longitudeInput = document.getElementById("longitudeInput") as HTMLInputElement
      longitudeInput.style.visibility = "hidden"
      switchButton.innerHTML = "+"
      locationSelectElement.disabled = false
    }
    this.showLocationInputs = !this.showLocationInputs
  }

  /**
   * Asynchronous call to add new case into REST server
   */
  async addCase() {
    const name = (document.getElementById("nameInput") as HTMLInputElement).value
    const phone = (document.getElementById("phoneInput") as HTMLInputElement).value
    const id = (document.getElementById("idInput") as HTMLInputElement).value
    const info = (document.getElementById("infoInput") as HTMLInputElement).value

    //location logic
    const locationSelect = document.getElementById("locationSelect") as HTMLSelectElement
    var location = ""
    var latitude
    var longitude
    var count = 0
    if(locationSelect.disabled === true) {
      const locationInput = document.getElementById("locationInput") as HTMLInputElement
      location = locationInput.value
      const longitudeInput = document.getElementById("longitudeInput") as HTMLInputElement
      longitude = longitudeInput.value
      const latitudeInput = document.getElementById("latitudeInput") as HTMLInputElement
      latitude = latitudeInput.value

      const locationObject = {
        "location": location,
        "latitude": parseFloat(latitude),
        "longitude": parseFloat(longitude),
        "count": 1
      }
      await this.caseService.addLocation(locationObject)
    }
    else {
      const locationObject = this.caseService.findLocation(locationSelect.value)
      location = locationObject.location
      latitude = locationObject.latitude
      longitude = locationObject.longitude
      count = locationObject.count + 1
      console.log(count)
      await this.caseService.updateLocationCount(location, count)
    }
    //

    var today = new Date()
    var date = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    var time = String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0');
    const dateTime = date+' '+time;

    const newCase = new Case(name, phone, parseInt(id), location, dateTime, info)
    await this.caseService.addCase(newCase)
    this.addMarker(parseInt(id),latitude,longitude,location,count)


    //add pig into table
    const newRow = document.createElement("tr")
    newRow.id = id
    const locationElement = document.createElement("td")
    locationElement.innerHTML = location
    locationElement.style.verticalAlign = "middle"
    const reportedElement = document.createElement("td")
    reportedElement.innerHTML = name
    reportedElement.style.verticalAlign = "middle"
    const dateElement = document.createElement("td")
    dateElement.innerHTML = dateTime
    dateElement.style.verticalAlign = "middle"
  
    const locateElement = document.createElement("td");
    const locateButton = document.createElement("button");
    locateButton.innerHTML = "Locate"
    locateButton.type = "button"
    locateButton.className = "btn btn-outline-success"
    locateButton.style.verticalAlign = "middle"
    locateElement.appendChild(locateButton);

    const moreInfoElement = document.createElement("td");
    const moreInfoButton = document.createElement("button");
    moreInfoButton.innerHTML = "More Info"
    moreInfoButton.type = "button"
    moreInfoButton.className = "btn btn-outline-primary"
    moreInfoElement.style.verticalAlign = "middle"
    moreInfoElement.appendChild(moreInfoButton);

    const deleteElement = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-outline-danger"
    deleteButton.type = "button"
    deleteButton.innerHTML = "Remove"
    deleteElement.appendChild(deleteButton);

    locateButton.addEventListener("click", (event) => {
      this.showMarker(parseInt(id))
      window.scrollTo(0,50)
    })

    moreInfoButton.addEventListener("click", (event) => {
      this.moreModal = new bootstrap.Modal(document.getElementById("moreInfoModal"), {
        keyboard: false
      })
      this.name = name
      this.contact = phone
      this.id = id
      this.location = location
      this.info = info
      this.date = dateTime
      this.moreModal?.show()
    })

    deleteButton.addEventListener("click", async (event) => {
      this.location = location
      this.id = id
      
      if(this.cases.length === 1) {
        await this.caseService.updateLocationCount(this.location, 0)
        await this.caseService.deleteCase(parseInt(this.id))
        tableBodyNode?.removeChild(tableBodyNode.firstElementChild as HTMLTableRowElement)
      }
      else {
        var count
        for(let i = 0; i < this.locations.length; i++) {
          if(this.location === this.locations[i].location) {
            count = this.locations[i].count
          }
        }
        count--
        await this.caseService.updateLocationCount(this.location, count)
        await this.caseService.deleteCase(parseInt(this.id))
        document.getElementById(this.id)?.remove()
      }
    })
    
    const tableBodyNode = document.getElementById("tbody")
    newRow.appendChild(locationElement)
    newRow.appendChild(reportedElement)
    newRow.appendChild(dateElement)
    newRow.appendChild(locateElement)
    newRow.appendChild(moreInfoElement)
    newRow.appendChild(deleteElement)
    tableBodyNode?.appendChild(newRow)
    this.locationModal?.hide()
  }

}
