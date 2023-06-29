import { MessageLapinou, sendMessage, connectLapinou } from './services/lapinouService';

export function initLapinou(){
    connectLapinou().catch((error) => console.log('Failed to connect to RabbitMQ.', error));
}
