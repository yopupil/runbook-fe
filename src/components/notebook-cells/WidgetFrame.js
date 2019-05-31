import React from 'react';
import BaseComponent from 'shared/BaseComponent';

export default class WidgetFrame extends BaseComponent {
  // *********************************************************
  // React methods
  // *********************************************************
  componentDidUpdate (prevProps) {
    // They change at the same time.
    for (let any of ['jsCode', 'htmlCode', 'cssCode']) {
      if (prevProps[any] !== this.props[any]) {
        this.reload();
        break;
      }
    }
  }

  render () {
    return (
      <iframe
        ref={this.setIframe.bind(this)}
        onLoad={this.callLoad.bind(this)}
      />
    );
  }

  // *********************************************************
  // Private methods
  // *********************************************************
  setIframe (iframe) {
    this.iframe = iframe;
  }

  callLoad () {
    this.mountHTMLCodeIntoFrame(this.props.htmlCode);
    this.mountJSCodeIntoFrame(this.props.jsCode);
    this.mountCSSCodeIntoFrame(this.props.cssCode);
  }

  mountHTMLCodeIntoFrame (code) {
    if (!this.iframe) {
      return;
    }
    const body = this.iframe.contentDocument.body;
    body.innerHTML = code;
  }

  mountJSCodeIntoFrame (code) {
    /*
      Right now, code injection happens via a lone script tag.
      There may be other script tags as well
     */
    if (!this.iframe) {
      return;
    }
    let found = this.getElementByTagAndType(
      this.iframe.contentDocument,
      'script',
      'text/javascript'
    );
    // Reattach tag so that script executes
    found.text = `${code}`;
  }

  mountCSSCodeIntoFrame (css) {
    if (!this.iframe) {
      return;
    }
    let found = this.getElementByTagAndType(
      this.iframe.contentDocument,
      'style',
      'text/css'
    );
    // Modify contents
    found.innerHTML = css;
  }

  reload () {
    // Force page reload
    this.iframe.contentWindow.location.reload();
  }

  getElementByTagAndType (doc, tagType, typeAttribute) {
    const tags = doc.getElementsByTagName(tagType);
    let found;
    for (let tag of tags) {
      if (tag.getAttribute('type') === typeAttribute) {
        found = tag;
      }
    }
    if (!found) {
      found = doc.createElement(tagType);
      found.setAttribute('type', typeAttribute);
      doc.head.appendChild(found);
    }
    return found;
  }
}
