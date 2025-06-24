import { HttpContextToken } from '@angular/common/http';

export const SILENT_REQUEST = new HttpContextToken<boolean>(() => false);
