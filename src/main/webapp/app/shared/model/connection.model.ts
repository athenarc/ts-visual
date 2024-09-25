export interface IConnection {
    name: string;
    type: string;
    host: string;
    port: string;
    username: string;
    password: string;
    database: string;
}

export const defaultValue: Readonly<IConnection> = {
    name: '',
    type: '',
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
};