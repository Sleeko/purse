import { Status } from './status.model';
import { Store } from './store.model';

export class Voucher {
    id : string;
    voucherName : string;
    amount : number;
    voucherStatus : string;
    storeCode : string;
    storeBranch : string;
}