import { Component, OnInit } from '@angular/core';
import { CaseServiceService } from '../case-service.service';
import { Case } from '../CaseModel';

@Component({
  selector: 'app-case-table',
  templateUrl: './case-table.component.html',
  styleUrls: ['./case-table.component.css']
})
export class CaseTableComponent implements OnInit{
  cases: Case[] = []

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

}
