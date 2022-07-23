// src/model/fragment.js

const contentType = require('content-type');
const logger = require('../logger');
const { randomUUID } = require('crypto');

const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const validTypes = ['text/plain', 'text/markdown', 'text/html', 'application/json'];

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (typeof ownerId !== 'string') {
      throw new Error(`ownerId must be a string, got ownerId=${ownerId}`);
    }

    if (typeof type !== 'string') {
      throw new Error(`type must be a string, got type=${type}`);
    }

    if (typeof size !== 'number') {
      throw new Error(`size must be a number, got size=${size}`);
    }

    if (id && typeof id !== 'string') {
      throw new Error(`id must be a string if given, got id=${id}`);
    }

    if (id) {
      this.id = id;
    } else {
      this.id = randomUUID();
    }

    this.ownerId = ownerId;

    if (created) {
      this.created = created;
    } else {
      this.created = new Date().toISOString();
    }

    if (updated) {
      this.updated = updated;
    } else {
      this.updated = new Date().toISOString();
    }

    if (validTypes.includes(contentType.parse(type).type)) {
      this.type = type;
    } else {
      throw new Error(`content type is invalid, got type=${type}`);
    }

    if (size >= 0) {
      this.size = size;
    } else {
      throw new Error(`size cannot be negative, got size=${size}`);
    }

    logger.info({ id: this.id }, 'new fragment created');
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    if (typeof ownerId !== 'string') {
      throw new Error(`ownerId must be a string, got ownerId=${ownerId}`);
    }

    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    if (typeof ownerId !== 'string') {
      throw new Error(`id lookup failed: ownerId must be a string, got ownerId=${ownerId}`);
    }
    if (typeof id !== 'string') {
      throw new Error(`id lookup failed: id must be a string, got id=${id}`);
    }

    const result = await readFragment(ownerId, id);

    if (typeof result == 'undefined') {
      throw new Error(`id lookup failed: fragment with id = ${id} not found`);
    }

    return new Fragment({
      id: result.id,
      ownerId: result.ownerId,
      created: result.created,
      updated: result.updated,
      type: result.type,
      size: result.size,
    });
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    if (typeof ownerId !== 'string') {
      throw new Error(`ownerId must be a string, got ownerId=${ownerId}`);
    }
    if (typeof id !== 'string') {
      throw new Error(`id must be a string, got id=${id}`);
    }

    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  async save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    if (!data) {
      throw new Error(`data is invalid, got data = ${data}`);
    }
    this.size = data.length;
    this.save();
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return RegExp('text/.*').test(this.type);
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    let availableFormats;

    // to be expanded when images are supported
    if (this.isText) {
      availableFormats = ['text/plain', 'text/markdown', 'text/html'];
    } else {
      availableFormats = ['application/json'];
    }
    return availableFormats;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    return validTypes.includes(contentType.parse(value).type);
  }
}

module.exports.Fragment = Fragment;
