import { Status } from './status.model';
import { Store } from './store.model';

export class Voucher {
    docId : string;
    name : string;
    amount : number;
    status : string;
    storeCode : string;
    storeBranch : string;
}