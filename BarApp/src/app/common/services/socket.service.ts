import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private message = new BehaviorSubject<string>('');

  io = io(environment.webSocketUrl, {
    autoConnect: true,
    withCredentials: true,
  });
  constructor() {
    this.io.on('newOrder', data => {
      this.message.next(data);
    });
  }

  ngOnInit() {}

  getMessage() {
    return this.message.asObservable();
  }

  sendMessage(socket: string, msg: string) {
    this.io.emit(socket, msg);
  }

  disconnect() {
    if (this.io) {
      this.io.disconnect();
    }
  }
}
