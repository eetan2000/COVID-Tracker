export class Case {
    private name: string;
    private phone: string;
    private id: number;
    private location: string;
    private date: string;
    private info: string;

    constructor(name:string, phone:string, id:number, location:string, date:string, info:string) {
        this.name = name;
        this.phone = phone;
        this.id = id;
        this.location = location;
        this.date = date;
        this.info = info
    }

    getName() {
        return this.name;
    }

    getPhone() {
        return this.phone;
    }

    getID() {
        return this.id;
    }

    getLocation() {
        return this.location;
    }

    getDate() {
        return this.date;
    }

    getInfo() {
        return this.info;
    }
}