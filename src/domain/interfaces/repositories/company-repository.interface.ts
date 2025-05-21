// src/domain/interfaces/repositories/company-repository.interface.ts

import { Company } from "../../entities/company.entity";


export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>;
}