"use strict";
class View {
  constructor() {
    this.contentSection = document.getElementById("content-section");
    this.contactScript = document.getElementById("render-contacts");
    this.contactsTemplate = Handlebars.compile(this.contactScript.innerHTML);
  }

  displayContacts(contacts) {
    this.contentSection.innerHTML = this.contactsTemplate({contacts});
    this.displayAddSearchSection();
  }

  addContactSection(handleAddContactForm) {
    let addContactBtn = document.getElementById("add-contact-btn");
    addContactBtn.addEventListener("click", event => {
  
      let addContactScript = document.getElementById("add-contact");
      let addContactTemplate = Handlebars.compile(addContactScript.innerHTML);
      this.contentSection.innerHTML = addContactTemplate(addContactScript);
      this.displayAddSearchSection();
      handleAddContactForm();
    });
  }

  displayAddSearchSection() {
    let addSearchSection = document.getElementById("add-search");

    let contactCard = document.querySelector(".contact-card");
    if (this.contentSection.contains(contactCard)) {
      addSearchSection.style.display = 'block';
    } else {
      addSearchSection.style.display = 'none';
    }
  }

  displayEditForm(contact) {
    let editContactTemplate = Handlebars.compile(document.getElementById("edit-contact").innerHTML);
    this.contentSection.innerHTML = editContactTemplate(contact);
    this.displayAddSearchSection();
  }

  displayNoResults(searchText) {
    let noResultsTemplate = Handlebars.compile(document.getElementById("no-results").innerHTML);
    this.contentSection.innerHTML = noResultsTemplate({searchText});
  }

}

export default View;