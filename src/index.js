/**
 * Build styles
 */
require('./index.css').toString();

/**
 * @typedef {object} PagetitleData
 * @description Tool's input and output data format
 * @property {string} text — Title's content
 */

/**
 * @typedef {object} PagetitleConfig
 * @description Tool's config from Editor
 * @property {string} placeholder — Block's placeholder
 */

/**
 * Pagetitle block for the Editor.js.
 *
 */
class Pagetitle {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: PagetitleData, config: PagetitleConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    /**
     * Styles
     *
     * @type {object}
     */
    this._CSS = {
      block: this.api.styles.block,
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
      wrapper: 'ce-pagetitle',
    };

    /**
     * Tool's settings passed from Editor
     *
     * @type {PagetitleConfig}
     * @private
     */
    this._settings = config;

    /**
     * Block's data
     *
     * @type {PagetitleData}
     * @private
     */
    this._data = this.normalizeData(data);

    /**
     * List of settings buttons
     *
     * @type {HTMLElement[]}
     */
    this.settingsButtons = [];

    /**
     * Main Block wrapper
     *
     * @type {HTMLElement}
     * @private
     */
    this._element = this.getTag();
  }

  /**
   * Normalize input data
   *
   * @param {PagetitleData} data - saved data to process
   *
   * @returns {PagetitleData}
   * @private
   */
  normalizeData(data) {
    const newData = {};

    if (typeof data !== 'object') {
      data = {};
    }

    newData.text = data.text || '';

    return newData;
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLHeadingElement}
   * @public
   */
  render() {
    return this._element;
  }

  /**
   * Validate Text block data:
   * - check for emptiness
   *
   * @param {PagetitleData} blockData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(blockData) {
    return blockData.text.trim() !== '';
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
   * @returns {PagetitleData} - saved data
   * @public
   */
  save(toolsContent) {
    return {
      text: toolsContent.innerHTML
    };
  }

  /**
   * Allow Header to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      export: 'text', // use 'text' property for other blocks
      import: 'text', // fill 'text' property from other block's export string
    };
  }

  /**
   * Sanitizer Rules
   */
  static get sanitize() {
    return {
      text: {}
    };
  }

  /**
   * Returns true to notify core that read-only is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get current Tools`s data
   *
   * @returns {PagetitleData} Current data
   * @private
   */
  get data() {
    this._data.text = this._element.innerHTML;

    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {PagetitleData} data — data to set
   * @private
   */
  set data(data) {
    this._data = this.normalizeData(data);

    /**
     * If level is set and block in DOM
     * then replace it to a new block
     */
    if (data.level !== undefined && this._element.parentNode) {
      /**
       * Create a new tag
       *
       * @type {HTMLHeadingElement}
       */
      const newHeader = this.getTag();

      /**
       * Save Block's content
       */
      newHeader.innerHTML = this._element.innerHTML;

      /**
       * Replace blocks
       */
      this._element.parentNode.replaceChild(newHeader, this._element);

      /**
       * Save new block to private variable
       *
       * @type {HTMLHeadingElement}
       * @private
       */
      this._element = newHeader;
    }

    /**
     * If data.text was passed then update block's content
     */
    if (data.text !== undefined) {
      this._element.innerHTML = this._data.text || '';
    }
  }

  /**
   * Get tag for target level
   * By default returns second-leveled header
   *
   * @returns {HTMLElement}
   */
  getTag() {
    /**
     * Create element for current Block's level
     */
    const tag = document.createElement('h1');

    /**
     * Add text to block
     */
    tag.innerHTML = this._data.text || '';

    /**
     * Add styles class
     */
    tag.classList.add(this._CSS.wrapper);

    /**
     * Make tag editable
     */
    tag.contentEditable = this.readOnly ? 'false' : 'true';

    /**
     * Add Placeholder
     */
    tag.dataset.placeholder = this.api.i18n.t(this._settings.placeholder || '');

    return tag;
  }

  /**
   * Handle H1-H6 tags on paste to substitute it with header Tool
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(event) {
    const content = event.detail.data;
    this.data = {
      text: content.innerHTML,
    };
  }

  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle H1 tags.
   *
   * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ['H1'],
    };
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="#fff" d="M38.5 181.5V51.7l33.2-33.2h89.8v163z"/><path d="M158.5 21.5v157h-117V53L73 21.5h85.5m6-6h-94l-35 35v134h129v-169z"/><path fill="none" stroke="#000" stroke-width="6" stroke-linecap="square" stroke-miterlimit="10" d="M73 22v32H41"/><g><path d="M64.2 70.7h72.2l.1 24.2H133c-1.1-8.7-4.4-14.5-9.7-17.6-3-1.7-7.5-2.6-13.5-2.8v63.2c0 4.4.8 7.3 2.3 8.8s4.8 2.2 9.6 2.2v3H79.1v-3c4.7 0 7.8-.7 9.3-2.2 1.5-1.5 2.3-4.4 2.3-8.8V74.6c-5.9.2-10.4 1.1-13.5 2.8-5.7 3.1-9 9-9.7 17.6H64l.2-24.3z"/></g></svg>`,
      title: 'Page title',
    };
  }
}

module.exports = Pagetitle;
