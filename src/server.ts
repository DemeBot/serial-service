import * as debug from "debug";
import * as websocket from "ws";

const SERVER_PORT: number = (typeof process.env.SERVER_PORT !== "undefined") ? process.env.SERVER_PORT : 8080;


if (typeof process.env.COM_NAME === "undefined") {
  console.error("You need to specify the serial port when you launch this script\n");
  console.error("    Specify it as an environment variable titled 'COM_NAME'");
  process.exit(1);
}

const COM_NAME: string = process.env.COM_NAME;

import SerialPortConnection from "./controllers/serialport.controller";

debug( "ts-ws:server" );

let wss: websocket.Server = new websocket.Server( { port: SERVER_PORT } );
let connections: websocket[] = [];

let serialPortConnection: SerialPortConnection = new SerialPortConnection( COM_NAME, broadcast );

wss.on( "connection", onListening );

console.log( "[ SERVER ] - port: " + SERVER_PORT );

function onError( error: NodeJS.ErrnoException ): void {
    if ( error.syscall !== "listen" ) throw error;

    let bind = ( typeof SERVER_PORT === "string" ) ? "Pipe " + SERVER_PORT : "Port " + SERVER_PORT;
    switch ( error.code ) {

        case "EACCES":
        console.error( `${bind} requires elevated privileges` );
        process.exit( 1 );
        break;

        case "EADDRINUSE":
        console.error( `${bind} is already in use` );
        process.exit( 1 );
        break;

        default:
        throw error;
    }
}

function onListening( client: websocket ): void {

    console.log( "[ NEW CLIENT ]" );

    connections.push( client );

    client.on( "open", () => {
        client.send( "CONNECTED" );
    } );

    client.on( "message", handleClientMessage );

    client.on( "close", handleClientDisconnect );
}

function handleClientMessage( data: string ) {
    serialPortConnection.write( data );
    if ( connections.length > 0 ) {

    }
}

function handleClientDisconnect( client: any ) {
    let position = connections.indexOf( client );
    connections.splice( position, 1 );
}

function broadcast( data ) {
    for (let connection in connections) {
        try
        {
            connections[connection].send(data);
        }
        catch ( Error ) {
            let position = connections.indexOf( connection );
            connections.splice( position, 1 );
            console.error(Error);
        }
        finally {
        }
    }
}