import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from './web-api';
import {ContactUpdated, ContactViewed} from './messages';
import {inject, BindingEngine} from 'aurelia-framework';

@inject(WebAPI, EventAggregator, BindingEngine)
export class ContactList {
  constructor(api, ea, be) {
    this.api = api;
    this.contacts = [];
    
    ea.subscribe(ContactViewed, msg => this.select(msg.contact));
    ea.subscribe(ContactUpdated, msg => {
      let id = msg.contact.id;
      let found = this.contacts.find(x => x.id == id);
      Object.assign(found, msg.contact);
    });
    this.bindingEngine = be;
  }
  
  created() {
    this.api.getContactList().then(contacts => {
      this.contacts = contacts;
      this.subscription = this.bindingEngine.propertyObserver(this.contacts[0], 'firstName').subscribe((newValue, oldValue) => console.log(`FirstName changed from ${oldValue} to ${newValue}`))
    });
  }
  
  unbind() {
    this.subscription.dispose();
  }
  
  select(contact) {
    this.selectedId = contact.id;
    return true;
  }
}
