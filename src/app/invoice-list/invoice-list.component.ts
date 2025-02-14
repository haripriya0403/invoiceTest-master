import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import {InvoiceService} from '../services/invoice.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule,FormsModule , TableModule,InputTextModule , CardModule],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  Invoices: any[] = []; // Initialize the Invoices array
  selectedInvoice: any = null; // Holds the selected invoice data
  filteredInvoices: any[] = []; // Holds the filtered invoice data
  searchTerm: string = ''; // Holds the search term entered by the user

  constructor(private InvoiceService:InvoiceService) {}

   ngOnInit(): void {
    // Fetch invoices from the API
    this.InvoiceService.getAllInvoices().subscribe(
      (data: any) => {
        this.Invoices = data;  // Assuming 'data' contains the invoice array
        this.filteredInvoices = [...this.Invoices]; // Initially, set filteredInvoices to all invoices
        console.log('Invoices fetched from API:', this.Invoices);
      },
      (error) => {
        console.error('Error fetching invoices from API:', error);
      }
    );
  }

  // Filter invoices based on the search term
  filterInvoices(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredInvoices = this.Invoices.filter(invoice => 
      (invoice.invoiceid && invoice.invoiceid.toString().toLowerCase().includes(term)) ||
      (invoice.name && invoice.name.toLowerCase().includes(term)) ||
      (invoice.date && invoice.date.toLowerCase().includes(term))
    );
  }

  // Watch for changes in the search term and filter the invoices accordingly
  ngOnChanges(): void {
    this.filterInvoices();
  }
   // Function to display the preview dialog
   preview(invoice: any): void {
    this.selectedInvoice = invoice;  // Set the selected invoice data
    if (!this.selectedInvoice) {
      console.error("Invoice data is not available.");
      return;
    }
  
    // Check if 'total' is available and is a valid number
    const total = this.selectedInvoice.total && !isNaN(this.selectedInvoice.total)
      ? this.selectedInvoice.total
      : 0; // Fallback to 0 if 'total' is invalid
  
    const printWindow = window.open('', '_blank');
  
    if (printWindow) {
      const printContent = `
      <html>
        <head>
          <style>
            /* Universal table styling */
            table {
              width: 100%;
              border-collapse: collapse; /* Ensures borders between cells are merged */
              border: 2px solid black; /* Outer border for the entire table */
            }
            table th, table td {
              border: 1px solid black; /* Inner cell borders */
              padding: 8px;
              text-align: left;
            }
            table th {
              background-color: #f2f2f2; /* Light grey background for header */
              font-weight: bold;
            }
            /* Additional optional styling */
            .container {
              font-family: Arial, sans-serif;
            }
            .text-center {
              text-align: center;
            }
            .font-bold {
              font-weight: bold;
            }
            .mt-4 {
              margin-top: 1rem;
            }
            .text-xl {
              font-size: 1.25rem;
            }
          </style>
        </head>
        <body>
          <div class="container flex">
            <img src="assets/images/logo2.png" class="w-150">
            <div class="text-center">
              <h1 class="text-xl font-bold text-black-800">Invoice</h1>
            </div>
            <table>
              <tr>
                <th>Invoice No:</th>
                 <th>Customer:</th>
                
              </tr>
              <tr>
               <td>${this.selectedInvoice.invoiceid || ''}</td>
               <td>${this.selectedInvoice.name || ''}</td>
               
              </tr>
             <tr>
               <th>From Date:</th>
                  <th>To Date:</th>
               
             </tr>
               <tr>
                <td>${this.selectedInvoice.date || ''}</td>
                <td>${this.selectedInvoice.todate || ''}</td>
               </tr>
            </table>
    
            <table>
            <h2 class="font-bold text-xl mt-4">Items Details</h2>

              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${this.selectedInvoice.items.map((item: { itemName: any; quantity: number; rate: number; }) => `
                  <tr>
                    <td>${item.itemName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.rate}</td>
                    <td>${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
    
            <div class="font-bold text-xl mt-4">Grand Total: ₹${invoice.grandTotal.toFixed(2)}</div>
    
          </div>
        </body>
      </html>`;
    
    
  
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      console.error("Failed to open print window.");
    }
  }
  

  
}
