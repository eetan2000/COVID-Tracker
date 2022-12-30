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
  @Input() showMarker!: (id: number) => void
  private createModal: Modal | undefined
  private locationModal: Modal | undefined


  constructor(private caseService: CaseServiceService) {  }

  async ngOnInit() {
    this.cases = await this.caseService.getCases()

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

      newRow.appendChild(locationTd)
      newRow.appendChild(reportedTd)
      newRow.appendChild(dateTd)
      newRow.appendChild(locateElement)
      newRow.appendChild(moreInfoElement)
      newRow.appendChild(deleteElement)
      tableBodyNode?.appendChild(newRow)
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

  createCaseModal() {
    this.createModal = new bootstrap.Modal(document.getElementById("createModal"), {
      keyboard: false
    })
    this.createModal?.show()
  }

  createLocationModal() {
    var name = (document.getElementById("nameInput") as HTMLInputElement).value
    var phone = (document.getElementById("phoneInput") as HTMLInputElement).value
    var id = (document.getElementById("idInput") as HTMLInputElement).value

    if(name === "" || phone === "" || id === "") {
      window.alert("Please fill the reporter name, phone number, and the PigID of pig")
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

}
