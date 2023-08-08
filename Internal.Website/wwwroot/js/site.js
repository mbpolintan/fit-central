// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

//function getNotification() {

//    alert('hello');
//};

//let connection = new signalR.HubConnection("/signalServer");

//connection.on('displayNotification', () => {
//    getNotification();
//});

//connection.start();

let connection = new signalR.HubConnectionBuilder()
    .withUrl("/signalServer")
    .build();

connection.on("getSMSInboundMessage", data => {
    getReplyMessage(data);
});

connection.start();
    //.then(() => connection.invoke("displayNotification", "Hello"));