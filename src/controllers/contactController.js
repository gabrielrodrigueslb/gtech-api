import { createContact, getAllContacts, getContactById, updateContact, deleteContact } from "../services/contactService.js";

export async function createContactController(req, res) {
  try {
    const data = req.body;
    const contact = await createContact(data);
    return res.status(201).json(contact);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getAllContactsController(req, res) {
  try {
    const contacts = await getAllContacts();
    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export async function getContactByIdController(req, res) {
    try {
        const { id } = req.params;
        const contact = await getContactById(id);
        return res.status(200).json(contact);
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

export async function updateContactController(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedContact = await updateContact(id, data);
    return res.status(200).json(updatedContact);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function deleteContactController(req, res) {
  try {
    const { id } = req.params;
    await deleteContact(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
