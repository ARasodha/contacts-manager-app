"use strict";

import debounce from "./debounce.js";

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.renderContacts();
    this.handleAddContactButton();
    this.handleDeleteContactButton();

    this.handleSearchBox = debounce(this.handleSearchBox.bind(this), 700);
    this.handleSearchBox();
  }

  async renderContacts(searchContacts) {
    if (!searchContacts) {
      let contacts = await this.model.fetchContacts();
      this.view.displayContacts(contacts);
    } else {
      this.view.displayContacts(searchContacts);
    }
   
    this.handleDeleteContactButton();
    this.handleEditContactBtn();
  }

  handleAddContactButton() {
    this.view.addContactSection(this.handleAddContactForm.bind(this));
  }

  handleAddContactForm() {
    let addContactForm = document.getElementById("add-contact-form");
    addContactForm.addEventListener("submit", event => {
      event.preventDefault();

      if (this.validateFormInput()) {
        this.model.createContact(addContactForm);
        this.renderContacts();
      }
    });
  
    this.handleCancelButton();
  }

  handleCancelButton() {
    let cancelBtn = document.getElementById("cancel-btn");
    cancelBtn.addEventListener('click', event => {
      event.preventDefault();
      this.renderContacts();
    });
  }

  handleDeleteContactButton() {
    let deleteBtns = Array.from(document.getElementsByClassName("delete-btns"));
    deleteBtns.forEach(deleteBtn => {
      deleteBtn.addEventListener("click", event => {
        let confirmation = confirm('Do you want to delete the contact?');
        if (!confirmation) return;
  
        let contactId = Number(deleteBtn.getAttribute("data-id"));
        this.model.deleteContact(contactId);
        this.renderContacts();
      });
    });
  }

  handleEditContactBtn() {
    document.addEventListener("click", async (event) => {
      if (event.target.className === 'edit-btns') {
        let editBtn = event.target;

        let contactId = Number(editBtn.getAttribute("data-id"));
        let contact = await this.model.fetchContact(contactId);

        this.view.displayEditForm(contact);
        this.handleCancelButton();
        this.handleSubmitEditForm();
      }
    });
  }

  handleSubmitEditForm() {
    let editForm = document.getElementById("edit-contact-form");
    editForm.addEventListener("submit", event => {
      event.preventDefault();

      if (this.validateFormInput()) {
        let contactId = editForm.getAttribute("data-contact-id");
        this.model.editContact(contactId, editForm);
        this.renderContacts();
      }

    });
  }

  handleSearchBox() {
    let searchBox = document.getElementById('search-box');
    searchBox.addEventListener("keyup", async (event) => {
      let searchText = searchBox.value;
      let contacts = await this.model.searchContact(searchText);
      
      if (contacts.length === 0) {
        this.view.displayNoResults(searchText);
      } else {
        this.renderContacts(contacts);
      }
    });
  }

  validateFormInput() {
    let fullName = document.querySelector("[name=full_name]");
    let email = document.querySelector("[name=email]");
    let phoneNumber = document.querySelector("[name=phone_number]");

    let warningMessages = Array.from(document.getElementsByClassName("validation"));
    warningMessages.forEach(message => message.style.display = 'none');

    let warnings = [];

    if (!/^[a-z]+\s[a-z]+$/i.test(fullName.value)) warnings.push(fullName.name);
    if (!/^.+@.+$/i.test(email.value)) warnings.push(email.name);
    if (!/^\d\d\d\d\d\d\d\d\d\d$/.test(phoneNumber.value)) warnings.push(phoneNumber.name);

    warnings.forEach(warning => {
      document.getElementById(`${warning}-validation`).style.display = 'inline';
    });

    return warnings.length === 0;
  }
}

export default Controller;
