import {io} from 'socket.io-client';

export const initSocket = async () => {
    const option = {
        'force new connection': true,  // ek room id bnd ho toh dusra chalu so jae, wait na krna pre
        reconnectionAttempt: 'infinity',
        timout: 10000,
        transports: ['websocket']
    };
    return io('http://localhost:3000', option);
}