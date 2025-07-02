import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { CompanyData } from '../interfaces/company-data.interface';
import { Company } from '../interfaces/company.interface';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './company-form.component.html',
})
export class CompanyFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() company: Company | null = null;
  @Input() isSaving = false;
  @Output() save = new EventEmitter<CompanyData>();
  @Output() closeModal = new EventEmitter<void>();

  public companyForm: FormGroup;
  public isEditMode = false;

  constructor() {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['company'] && this.company) {
      this.isEditMode = true;
      this.companyForm.patchValue(this.company);
    } else {
      this.isEditMode = false;
      this.companyForm.reset();
    }
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.companyForm.value);
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
