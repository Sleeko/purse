export class FirebaseUserModel {
    uid: string;
    image: string;
    name: string;
    provider: string;
    role: string;
    email : string;

    constructor() {
        this.uid = '';
        this.image = '';
        this.name = '';
        this.provider = '';
        this.role = '';
    }
}
