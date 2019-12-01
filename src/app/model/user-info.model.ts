import { PersonalInfo } from './personal-info.model';
import { AccountInfo } from './account-info.model';
import { GovermentDocuments } from './goverment-docs.model';

export class UserInfo {
    docId : string;
    uid: string;
    email: string;
    personalInfo: PersonalInfo;
    beneficiaries : PersonalInfo[];
    accountInfo: AccountInfo;
    governmentDocuments: GovermentDocuments;
    role: string;
    dateRegistered?: Date = new Date();
}
