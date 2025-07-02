import {
  Component,
  OnInit,
  inject,
  signal,
  WritableSignal,
  afterNextRender,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Department } from '../../interfaces/department.interface';
import { DepartmentService } from '../../services/department.service';
import { DepartmentFormComponent } from '../../components/department-form.component';
import { Modal } from 'bootstrap';
import { DepartmentData } from '../../interfaces/departmentData.interface';

@Component({
  selector: 'app-department-list-component',
  standalone: true,
  imports: [CommonModule, TranslocoModule, DepartmentFormComponent],
  templateUrl: './department-list.component.html',
})
export class DepartmentListComponent implements OnInit {
  private departmentSvc = inject(DepartmentService);
  private translocoSvc = inject(TranslocoService);

  public state: {
    departments: WritableSignal<Department[]>;
    isLoading: WritableSignal<boolean>;
    error: WritableSignal<string | null>;
  } = {
    departments: signal([]),
    isLoading: signal(true),
    error: signal(null),
  };

  public selectedDepartment = signal<Department | null>(null);
  public isSaving = signal(false);
  private departmentModal: Modal | undefined;

  constructor() {
    // Usiamo afterNextRender per inizializzare la modale di Bootstrap
    // solo dopo che la vista è stata renderizzata nel browser.
    afterNextRender(() => {
      const modalElement = document.getElementById('departmentFormModal');
      if (modalElement) {
        this.departmentModal = new Modal(modalElement);
      }
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  /**
   * Carica la lista dei dipartimenti dal servizio.
   */
  public loadDepartments(): void {
    this.state.isLoading.set(true);
    this.state.error.set(null);

    this.departmentSvc.getDepartments().subscribe({
      next: (departments) => {
        this.state.departments.set(departments);
        this.state.isLoading.set(false);
      },
      error: () => {
        // L'errore specifico viene già gestito e notificato dall'interceptor.
        // Qui impostiamo solo lo stato locale per la UI.
        const errorMessage = this.translocoSvc.translate(
          'departmentsPage.errorLoading'
        );
        this.state.isLoading.set(false);
      },
    });
  }

  /**
   * Gestisce il salvataggio (creazione o aggiornamento) del dipartimento.
   * Viene chiamato quando il DepartmentFormComponent emette l'evento 'save'.
   * @param departmentData I dati provenienti dal form.
   */
  public onSave(departmentData: DepartmentData): void {
    this.isSaving.set(true);

    const operation = this.selectedDepartment()
      ? this.departmentSvc.updateDepartment(
          this.selectedDepartment()!.id,
          departmentData
        )
      : this.departmentSvc.createDepartment(departmentData);

    operation.subscribe({
      next: () => {
        this.closeModal();
        this.loadDepartments();
      },
      error: () => {
        this.isSaving.set(false);
      },
      complete: () => {
        this.isSaving.set(false);
      },
    });
  }

  /**
   * Apre la modale per creare un nuovo dipartimento.
   */
  public openCreateModal(): void {
    this.selectedDepartment.set(null);
    this.departmentModal?.show();
  }

  /**
   * Apre la modale per modificare un dipartimento esistente.
   * @param department Il dipartimento da modificare.
   */
  public openEditModal(department: Department): void {
    this.selectedDepartment.set(department);
    this.departmentModal?.show();
  }

  public closeModal(): void {
    this.departmentModal?.hide();
  }

  /**
   * Gestisce la richiesta di eliminazione di un dipartimento.
   * @param department Il dipartimento da eliminare.
   */
  public onDelete(department: Department): void {
    const confirmMessage = this.translocoSvc.translate(
      'departmentsPage.confirmDeleteMessage',
      {
        departmentName: department.name,
      }
    );

    if (confirm(confirmMessage)) {
      this.departmentSvc.deleteDepartment(department.id).subscribe({
        next: () => {
          this.loadDepartments();
        },
      });
    }
  }
}
