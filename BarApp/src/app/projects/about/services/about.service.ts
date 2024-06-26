import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EntityListResponse } from '@common/models/entity.list.response';

import { environment } from 'src/environments/environment';
import { Contact } from '@common/models/about';
import { ContactMessage } from '@common/models/contactMessage';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getContact() {
    return this.http.get<EntityListResponse<Contact>>(this.apiUrl + '/about/');
  }

  putContact(selectedContact: Contact) {
    return this.http.put<Contact>(
      this.apiUrl + '/about/' + selectedContact.id,
      selectedContact
    );
  }

  postContact(selectedContact: Contact) {
    return this.http.post<Contact>(this.apiUrl + '/about/', selectedContact);
  }

  postMessage(message: ContactMessage) {
    return this.http.post<ContactMessage>(
      this.apiUrl + '/about/message',
      message
    );
  }
}
