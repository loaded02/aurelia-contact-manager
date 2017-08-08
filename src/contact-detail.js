import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from './web-api';
import {ContactUpdated,ContactViewed} from './messages';
import {areEqual} from './utility';
import {Constants} from './Constants'
import {BindingSignaler} from 'aurelia-templating-resources';

@inject(WebAPI, EventAggregator, BindingSignaler)
export class ContactDetail {
  roles = Constants.ROLES;
  
  constructor(api, ea, bs){
    this.api = api;
    this.ea = ea;
    this.bs = bs;
  }
  
  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    
    return this.api.getContactDetails(params.id).then(contact => {
      this.contact = contact;
      this.routeConfig.navModel.setTitle(contact.firstName);
      this.originalContact = JSON.parse(JSON.stringify(contact));
      this.ea.publish(new ContactViewed(this.contact));
      this.onChange()
    });
  }
  
  get canSave() {
    return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
  }
  
  save() {
    this.api.saveContact(this.contact).then(contact => {
      this.contact = contact;
      this.routeConfig.navModel.setTitle(contact.firstName);
      this.originalContact = JSON.parse(JSON.stringify(contact));
      this.ea.publish(new ContactUpdated(this.contact));
    });
  }
  
  canDeactivate() {
    if(!areEqual(this.originalContact, this.contact)){
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');
      
      if(!result) {
        this.ea.publish(new ContactViewed(this.contact));
      }
      
      return result;
    }
    
    return true;
  }
  
  onChange() {
    this.bs.signal('my-signal')
  }
  
  getUserRole() {
    return this.contact.role;
  }
}
