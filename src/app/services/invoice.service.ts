import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = 'http://localhost:8080/api/invoice'; // Your base URL

  constructor(private http: HttpClient) {}

  // Create an Invoice
  createInvoice(invoiceData: any) {
    const apiUrl = `${this.apiUrl}/add`;  // Correct API URL for creating invoice
    return this.http.post(apiUrl, invoiceData);  // POST method for creating invoice
  }

  // Get all invoices
  getAllInvoices() {
    const apiUrl = `${this.apiUrl}/all`;  // Correct API URL to fetch all invoices
    return this.http.get(apiUrl);  // GET method to retrieve all invoices
  }

  // Get invoice by ID
  getInvoiceById(invoiceId: number) {
    const apiUrl = `${this.apiUrl}/${invoiceId}`;  // URL with invoice ID to fetch specific invoice
    return this.http.get(apiUrl);  // GET method to retrieve a specific invoice by ID
  }

  // Update invoice by ID
  updateInvoice(invoiceId: number, invoiceData: any) {
    const apiUrl = `${this.apiUrl}/${invoiceId}`;  // URL with invoice ID for updating
    return this.http.put(apiUrl, invoiceData);  // PUT method to update invoice by ID
  }
}
