export type Character= {
    [x: string]: any;
    id:number
    name: string
    status: string
    species: string
    gender: string
    origin: Origen
    location: Origen
    created: string
}
export type Origen = {
    name: string;
    url: string;
};
