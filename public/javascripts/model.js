"use strict";
class Model {
  constructor() {
    this.contacts;
  }

  async fetchContacts() {
    const response = await fetch("/api/contacts", {
      method: 'GET',
    }).then(response => response.json())
      .then(data => data)
      .catch(() => alert('There as an error fetching the contacts.'));
    
    return response.map(res => this._formatTags(res));
  }

  async fetchContact(contactId) {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: 'GET',
    }).then(response => response.json())
      .then(data => data)
      .catch(() => alert("There was an error fetching the contact."));
      
    return response;
  }

  async createContact(addContactForm) {
    let formData = new FormData(addContactForm);

    await fetch(addContactForm.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: this._formDataToJson(formData),
    })
    .then(response => response.json())
    .then(() => alert("Successfully added contact."))
    .catch(() => alert("There was an error creating a new contact."));

  }

  async deleteContact(contactId) {
    await fetch(`/api/contacts/${contactId}`, {
      method: "DELETE",
    }).then(() => alert("Successfully deleted contact. Id: " + String(contactId)))
      .catch(() => alert("There was an error deleting the contact. Id: " + String(contactId)));
  }

  async editContact(contactId, editForm) {
    let data = new FormData(editForm);

    await fetch(`${editForm.action}${String(contactId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: this._formDataToJson(data)
    }).then(response => response.json())
      .then(() => alert("Contact successfully updated."))
      .catch(() => alert("There was an error updating the contact."));
  }

  async searchContact(searchText) {
    let contacts = await fetch("/api/contacts", {
      method: 'GET',
    })
    .then(response => response.json())
    .catch(() => alert('There was an error searching contacts.'));

    contacts.map(contact => this._formatTags(contact));

    let contactNames = contacts.map(({full_name}) => full_name);
    let filteredContactNames = contactNames.filter(name => name.toLowerCase().includes(searchText));
    let filteredContacts = contacts.filter(({full_name}) => filteredContactNames.includes(full_name));
    return filteredContacts;
  }

  _formDataToJson(formData) {
    let json = {};
    formData.forEach((value, key) => {
      json[key] = value;
    });
    
    this._preventDuplicateTags(json);
    json.tags = json.tags.split(' ').join(',');
  
    return JSON.stringify(json);
  }

  _formatTags(object) {
    if (object.tags.length === 0) {
      object.tags = ['no tags'];
    } else {
      object.tags = object.tags.split(',');
      
    }
    
    return object;
  }

  _preventDuplicateTags(object) {
    let nonDuplicates = [];

    object.tags.forEach(tag => {
      if (!nonDuplicates.includes(tag)) {
        nonDuplicates.push(tag);
      }
    });
    
    object.tags = nonDuplicates;
  }
}

export default Model;