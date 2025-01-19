export interface DataSendByUserInterface {
    name: string;
    id: string;
    email: string;
    phone: string;
    avatar: string;
    pickuplocation: {
        latitude: number;
        longitude: number;
        name: string;
    };
    droplocation: {
        latitude: number;
        longitude: number;
        name: string;
    };
    price: number;
    vechicelType: string;
    distance: number;
}
export interface DataSendByDriverInterface {
    name: string;
    id: string;
    email: string;
    phone: string;
    avatar: string;
    location: {
        latitude: number;
        longitude: number;
    };
    vechicel:{
        color:string,
        plate:string,
        vehicleType:string
    }
    price:number
    distance:number
}
