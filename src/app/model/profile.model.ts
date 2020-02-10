import { MemberProfile } from './member-profile.model';
import { Beneficiaries } from './beneficiaries.model';
import { BankAccount } from './bank-account.model';
import { GovermentDocuments } from './government-documents.model';


export class Profile {
    memberProfile : MemberProfile = new MemberProfile();
    beneficiaries : Beneficiaries = new Beneficiaries();
    bankAccount : BankAccount = new BankAccount();
    govDocs : GovermentDocuments = new GovermentDocuments();
}