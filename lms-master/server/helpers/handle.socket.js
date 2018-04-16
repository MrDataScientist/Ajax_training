import { BookController } from '../controllers/book.controller';

const BookCtrl = new BookController();
const handleSocket = (io) => {
    io.on('connection', function(socket){
        const socketId = socket.client.id
        socket.join(socketId)
        socket.on('SOCKET_MSG', function(msg){
            switch(msg.title){
                case 'GET_RATINGS' : 
                    BookCtrl.getRatingsUsingSocket(io, socketId)
                    break
                case 'GET_BORROW_EVENT' : 
                    BookCtrl.getBorrowEvent(io, socketId, msg.bookId)
                    break
                case 'GET_RETURN_EVENT' : 
                    BookCtrl.getReturnEvent(io, socketId, msg.bookId)
                    break
            }

        });
    });
}

export default handleSocket;