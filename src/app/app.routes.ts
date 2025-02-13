import { Routes } from '@angular/router';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

export const routes: Routes = [
  {
    path: '', // Default path
    redirectTo: '/invoiceList', // Redirect to invoiceList
    pathMatch: 'full' // Ensures exact match for the root path
  },
  {
    path: 'invoiceForm',
    component: InvoiceFormComponent
  },
  {
    path: 'invoiceList',
    component: InvoiceListComponent
  }
];
