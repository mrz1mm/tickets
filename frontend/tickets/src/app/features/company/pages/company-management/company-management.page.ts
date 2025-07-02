import {
  afterNextRender,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { finalize } from 'rxjs';
import { Company } from '../../interfaces/company.interface';
import { Modal } from 'bootstrap';
import { CompanyFormComponent } from '../../components/company-form.component';
import { CompanyData } from '../../interfaces/company-data.interface';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-management-page',
  standalone: true,
  imports: [CommonModule, TranslocoModule, CompanyFormComponent, DatePipe],
  templateUrl: './company-management.page.html',
})
export class CompanyManagementPage implements OnInit {
  private companySvc = inject(CompanyService);

  public companies = signal<Company[]>([]);
  public isLoading = signal(true);
  public selectedCompany = signal<Company | null>(null);
  public isSaving = signal(false);
  private companyModal: Modal | undefined;

  constructor() {
    afterNextRender(() => {
      const modalEl = document.getElementById('companyFormModal');
      if (modalEl) this.companyModal = new Modal(modalEl);
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading.set(true);
    this.companySvc
      .getCompanies()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((data) => {
        this.companies.set(data);
      });
  }

  onSave(data: CompanyData): void {
    this.isSaving.set(true);
    const operation = this.selectedCompany()
      ? this.companySvc.updateCompany(this.selectedCompany()!.id, data)
      : this.companySvc.createCompany(data);

    operation.pipe(finalize(() => this.isSaving.set(false))).subscribe(() => {
      this.closeModal();
      this.loadCompanies();
    });
  }

  onDelete(company: Company): void {
    if (
      confirm(
        `Sei sicuro di voler eliminare l'azienda "${company.name}"? Questa azione non può essere annullata.`
      )
    ) {
      this.companySvc.deleteCompany(company.id).subscribe(() => {
        this.loadCompanies();
      });
    }
  }

  openCreateModal(): void {
    this.selectedCompany.set(null);
    this.companyModal?.show();
  }

  openEditModal(company: Company): void {
    this.selectedCompany.set(company);
    this.companyModal?.show();
  }

  closeModal(): void {
    this.companyModal?.hide();
  }
}
