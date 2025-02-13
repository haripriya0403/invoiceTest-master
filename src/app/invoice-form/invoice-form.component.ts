import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Import Router
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import {InvoiceService} from '../services/invoice.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, CommonModule, CardModule, FormsModule, InputGroupModule, InputGroupAddonModule],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {

  invoiceForm: FormGroup;

  constructor(private router: Router,private InvoiceService:InvoiceService) {  
    this.invoiceForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'address': new FormControl('', [Validators.required]),
      'grandTotal': new FormControl(0, [Validators.required]), // Ensure it's initialized and validated
      'items': new FormArray([]),  // Initialize empty FormArray
    });
  }

  ngOnInit(): void {
    // Add an initial item when the component is initialized
    this.addItem();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  // Function to add an item
  addItem(): void {
    const itemGroup = new FormGroup({
      'itemName': new FormControl('', [Validators.required]),
      'quantity': new FormControl(0, [Validators.required, Validators.min(1)]),
      'rate': new FormControl(0, [Validators.required, Validators.min(0)]),
      'total': new FormControl({ value: 0, disabled: true })  // Total field, disabled by default
    });

    // Listen to changes in quantity or rate and update total
    itemGroup.get('quantity')?.valueChanges.subscribe(() => this.updateTotal(itemGroup));
    itemGroup.get('rate')?.valueChanges.subscribe(() => this.updateTotal(itemGroup));

    // Add the item group to the items FormArray
    this.items.push(itemGroup);
  }

  // Function to remove an item
  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  // Function to update total for a specific item
  updateTotal(itemGroup: FormGroup): void {
    const quantity = itemGroup.get('quantity')?.value || 0;
    const rate = itemGroup.get('rate')?.value || 0;
    const total = quantity * rate;
    itemGroup.get('total')?.setValue(total, { emitEvent: false });
  }

  // Function to calculate the grand total
  calculateGrandTotal(): number {
    return this.items.controls.reduce((grandTotal, itemGroup) => {
      return grandTotal + (itemGroup.get('total')?.value || 0);
    }, 0);
  }

  

  submitInvoice(): void {
    if (this.invoiceForm.valid) {
      // Enable the total fields to include them in the form value
      this.items.controls.forEach(itemGroup => {
        itemGroup.get('total')?.enable();
      });
  
      const formData = this.invoiceForm.value;
  
      // Calculate the grand total and add it to the form data
      const grandTotal = this.calculateGrandTotal();
      
      // Set the grand total in the form data
      this.invoiceForm.get('grandTotal')?.setValue(grandTotal);
  
      const invoiceData = {
        ...formData, // Spread the existing form data
        grandTotal: grandTotal // Add the grand total
      };
  
      console.log('Submitted Data:', invoiceData);
  
      // Use InvoiceService to make a POST request to save the invoice data
      this.InvoiceService.createInvoice(invoiceData).subscribe(
        (response) => {
          // Success response
          console.log('Invoice created successfully:', response);
          alert('Invoice saved successfully!');
  
          // Reset the form after successful submission
          this.invoiceForm.reset();
  
          // Navigate to the invoice list page
          this.router.navigate(['/invoiceList']);
        },
        (error) => {
          // Error response
          console.error('Error creating invoice:', error);
          alert('There was an error saving the invoice. Please try again later.');
        }
      );
  
      // After submission, you can disable the total fields again
      this.items.controls.forEach(itemGroup => {
        itemGroup.get('total')?.disable();
      });
    } else {
      console.log('Form is not valid!');
      // Show a validation error message
      alert('Please make sure all fields are filled correctly!');
    }
  }
  

}
