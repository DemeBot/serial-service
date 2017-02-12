import * as serialport from "serialport";

const BAUD_RATE: number = ( typeof process.env.BAUD_RATE !== "undefined" ) ? process.env.BAUD_RATE : 9600;

// Creates and configures a serialport connection.
export class SerialPortConnections {

    private port: serialport;

    private COM_NAME: string;

    constructor ( COM_NAME: string, broadcast: Function ) {

        this.COM_NAME = COM_NAME;

        this.port = new serialport(COM_NAME, {
            baudRate: BAUD_RATE,
            parser: serialport.parsers.readline("\n")
        });

        this.port.on( "open", this.portOpened );

        this.port.on( "data", ( data: any ) => {
            this.portData( data );
            broadcast( data );
        } );

        this.port.on( "close", this.portClosed );

        this.port.on( "error", this.portError );
    }

    public write = ( data ) => {
        this.port.write(data);
    }

    private portOpened = () => {
        console.log( "[ PORT OPEN ] - name: " + this.COM_NAME + " | baud rate: " + BAUD_RATE );
    }

    private portClosed = () => {
        console.log( "[ PORT CLOSED ] - name:" + this.COM_NAME );
    }

    private portError = ( error ) => {
        console.log("[ PORT ERRORED ] - message: " + error);
    }

    private portData = ( data ) => {
        console.log( "[ RECIEVED DATA @" + new Date().toLocaleTimeString() + " ] - data: " + data );
    }

}

export default SerialPortConnections;