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
import { Department } from '../interfaces/department.interface';
import { DepartmentData } from '../interfaces/departmentData.interface';

@Component({
  selector: 'app-department-form-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './department-form.component.html',
})
export class DepartmentFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() department: Department | null = null;
  @Input() isSaving: boolean = false;

  @Output() save = new EventEmitter<DepartmentData>();
  @Output() closeModal = new EventEmitter<void>();

  public departmentForm: FormGroup;
  public isEditMode = false;

  constructor() {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['department'] && this.department) {
      this.isEditMode = true;
      this.departmentForm.patchValue(this.department);
    } else {
      this.isEditMode = false;
      this.departmentForm.reset();
    }
  }

  public onSubmit(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    this.save.emit(this.departmentForm.value);
  }

  public onCancel(): void {
    this.closeModal.emit();
  }
}
