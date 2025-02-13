import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule, TableModule,InputTextModule , CardModule],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  Invoices: any[] = []; // Initialize the Invoices array
  selectedInvoice: any = null; // Holds the selected invoice data

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    // Log the platform to debug if the code is running in the correct environment
    console.log('Platform ID:', this.platformId);

    // Check if we're in the browser before accessing localStorage
    if (isPlatformBrowser(this.platformId)) {
      const storedData = localStorage.getItem('invoiceData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        this.Invoices.push(parsedData);
      } else {
        console.log('No invoice data found in localStorage');
      }
    } else {
      console.log('localStorage is not available in this environment');
    }
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
               <td>${this.selectedInvoice.invoiceId || ''}</td>
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
