// My original approach which has been discarded and transformed into MVC with use of Fetch API
//  and additional features -- ignore and look at app.js, model.js, view.js and controller.js

function renderContacts(filteredContacts) {
  let contentSection = document.getElementById("content-section");
  let contactScript = document.getElementById("render-contacts");
  let contactsTemplate = Handlebars.compile(contactScript.innerHTML);

  if (!filteredContacts) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", '/api/contacts');
    xhr.responseType = 'json';
    xhr.send();
  
    xhr.addEventListener('load', event => {
      let contacts = formatTags(xhr.response);
      
      contentSection.innerHTML = contactsTemplate({contacts});

      handleDeleteContactButton();
      renderEditContactSection();
    });
  } else {

    contentSection.innerHTML = contactsTemplate({contacts: formatTags(filteredContacts)});
    handleDeleteContactButton();
    renderEditContactSection();
  }
}

function formatTags(arr) {
  arr.forEach(object => {
    if (object.tags.length === 0) {
      object.tags = 'no tags';
    } else {
      object.tags = object.tags.split(',').join(', ');
    }
  })

  return arr;
}

function handleDeleteContactButton() {
  let deleteBtns = Array.from(document.getElementsByClassName("delete-btns"));
  deleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", event => {
      let confirmation = confirm('Do you want to delete the contact?');
      if (!confirmation) return;

      let contactId = Number(deleteBtn.getAttribute("data-id"));
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", `/api/contacts/${contactId}`);
      xhr.send();

      xhr.addEventListener('load', event => {
        if (xhr.status === 204) {
          console.log("Successfully deleted contact: " + String(contactId));
          renderContacts();
        } else {
          console.log('There was an error deleting this contact.');
        }
      });
    });
  });
}

function renderEditContactSection() {
  let editBtns = Array.from(document.getElementsByClassName('edit-btns'));
  let contentSection = document.getElementById("content-section");
  let editContactTemplate = Handlebars.compile(document.getElementById("edit-contact").innerHTML);

  editBtns.forEach(editBtn => {
    editBtn.addEventListener("click", event => {
      toggleAddSearchSection();
      let contactId = Number(editBtn.getAttribute("data-id"));
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `/api/contacts/${contactId}`);
      xhr.responseType = 'json';
      xhr.send();
      
      xhr.addEventListener("load", event => {
        if (xhr.status === 200) {
          console.log(xhr.response)
          contentSection.innerHTML = editContactTemplate(xhr.response);
          handleSubmitEditFormButton(contactId)
        }
      });
    });
  });
}

function handleSubmitEditFormButton(contactId) {
  let editForm = document.getElementById("edit-contact-form");
  handleCancelButton();
  editForm.addEventListener("submit", event => {
    event.preventDefault();

    let formData = new FormData(editForm);
    let jsonData = formDataToJson(formData);

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", editForm.action + String(contactId));
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(jsonData);

    xhr.addEventListener("load", event => {
      if (xhr.status === 201) {
        alert('Contact successfully updated');
        renderContacts();
        toggleAddSearchSection();
      } else if (xhr.status === 400) {
        alert('There was an error updating the contact');
      }
    });
  });
}

function toggleAddSearchSection() {
  let addSearchSection = document.getElementById("add-search");
  if (addSearchSection.style.display === 'none') {
    addSearchSection.style.display = 'block';
  } else {
    addSearchSection.style.display = 'none'
  }
}

function renderAddContentSection() {
  let addContactBtn = document.getElementById("add-contact-btn");
  addContactBtn.addEventListener("click", event => {
    toggleAddSearchSection()

    let contentSection = document.getElementById("content-section");
    let addContactScript = document.getElementById("add-contact");
    let addContactTemplate = Handlebars.compile(addContactScript.innerHTML);
    contentSection.innerHTML = addContactTemplate(addContactScript);

    handleAddContactForm();
  });
}

function handleAddContactForm() {
  let addContactForm = document.getElementById("add-contact-form");
  addContactForm.addEventListener("submit", event => {
    event.preventDefault();

    let formData = new FormData(addContactForm);
    let jsonData = formDataToJson(formData);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", addContactForm.action);
    xhr.setRequestHeader("Content-Type", 'application/json; charset=UTF-8');
    xhr.send(jsonData);

    xhr.addEventListener("load", event => {
      if (xhr.status === 201) {
        alert("Successfully added contact");
        renderContacts();
        toggleAddSearchSection();
        addContactForm.reset();
      } else {
        alert("There was an error logging the contact: Status " + xhr.status);
      }
    });
  });

  handleCancelButton();
}

function handleCancelButton() {
  let cancelBtn = document.getElementById("cancel-btn");
  cancelBtn.addEventListener('click', event => {
    event.preventDefault();
    renderContacts();
    toggleAddSearchSection();
  });
}

function formDataToJson(formData) {
  let json = {};
  formData.forEach((value, key) => {
    json[key] = value;
  });

  json.tags = json.tags.split(' ').join(',');

  return JSON.stringify(json);
}

function handleSearchBox() {
  let searchBox = document.getElementById('search-box');
  searchBox.addEventListener("keyup", event => {
    let boxText = searchBox.value;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", '/api/contacts');
    xhr.responseType = 'json';
    xhr.send();

    xhr.addEventListener('load', event => {
      let contacts = xhr.response;
      let contactNames = contacts.map(({full_name}) => full_name);
      let filteredContactNames = contactNames.filter(name => name.toLowerCase().includes(boxText));
      let filteredContacts = contacts.filter(({full_name}) => filteredContactNames.includes(full_name));
      renderContacts(filteredContacts);
    });
  })
}

document.addEventListener("DOMContentLoaded", event => {
  renderContacts();
  renderAddContentSection();
  handleSearchBox();
});