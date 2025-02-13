import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  // private apiUrl = 'http://localhost:8080/api/invoices'; // Change the URL to your API endpoint

  constructor(private http: HttpClient) {}



  createInvoice(invoiceData: any): Observable<any> {
    const apiUrl = 'http://localhost:8080/api/invoice/add';  // Make sure the URL is correct
    return this.http.post<any>(apiUrl, invoiceData);  // POST method for creating invoice
  }
  

 
}
