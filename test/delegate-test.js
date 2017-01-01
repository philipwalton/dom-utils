import assert from 'assert';
import sinon from 'sinon';
import {delegate, dispatch} from '..';


/* eslint no-invalid-this: 0 */
// NOTE: this use of this.skip() prevents usage of arrow functions in tests.

describe('delegate', function() {
  const fixtures = document.createElement('div');
  fixtures.id = 'fixtures';

  let div;
  let p;
  let em;

  /**
   * Adds the structure div > p > em as light DOM inside the fixture element.
   */
  function afixLightDom() {
    fixtures.innerHTML =
        '<div id="div">' +
        '  <p id="p">' +
        '    <em id="em"></em>' +
        '  </p>' +
        '</div>';

    div = document.getElementById('div');
    p = document.getElementById('p');
    em = document.getElementById('em');
  }

  /**
   * Adds the structure div > p > em as shadow DOM inside the fixture element.
   */
  function afixShadowDom() {
    div = document.createElement('div');
    fixtures.appendChild(div);
    div.attachShadow({mode: 'open'});
    div.shadowRoot.innerHTML = '<p><em></em></p>';

    p = div.shadowRoot.querySelector('p');
    em = div.shadowRoot.querySelector('em');
  }

  beforeEach(function() {
    document.body.appendChild(fixtures);
  });

  afterEach(function() {
    div = null;
    p = null;
    em = null;
    fixtures.innerHTML = '';
  });

  after(function() {
    document.body.removeChild(fixtures);
  });

  it('delegates the handling of events to an ancestor element', function() {
    // Skips this test in unsupporting browers.
    if (!Element.prototype.addEventListener) this.skip();

    afixLightDom();

    const spy = sinon.spy();
    const d = delegate(div, 'click', 'p', spy);
    dispatch(em, 'click', {bubbles: true, cancelable: true});

    assert(spy.calledOnce);

    d.destroy();
  });

  it('invokes the callback with the event and delegate target', function() {
    // Skips this test in unsupporting browers.
    if (!Element.prototype.addEventListener) this.skip();

    afixLightDom();

    const spy = sinon.spy();
    const d = delegate(div, 'click', 'p', spy);
    dispatch(em, 'click', {bubbles: true, cancelable: true});

    // PhantomJS and Safari don't work with sinon.match.instanceOf(Event), so
    // we have to manually call instance of here:
    // https://github.com/sinonjs/sinon/issues/594
    assert(spy.getCall(0).args[0] instanceof window.Event);
    assert.equal(spy.getCall(0).args[1], p);

    d.destroy();
  });

  it('binds the calback to the delegate target', function() {
    // Skips this test in unsupporting browers.
    if (!Element.prototype.addEventListener) this.skip();

    afixLightDom();

    const spy = sinon.spy();
    const d = delegate(div, 'click', 'p', spy);
    dispatch(em, 'click', {bubbles: true, cancelable: true});

    assert(spy.getCall(0).thisValue, em);

    d.destroy();
  });

  it('returns an object with a destroy method', function() {
    // Skips this test in unsupporting browers.
    if (!Element.prototype.addEventListener) this.skip();

    afixLightDom();

    const spy = sinon.spy();
    const d = delegate(div, 'click', 'p', spy);
    dispatch(em, 'click', {bubbles: true, cancelable: true});

    assert(spy.calledOnce);

    dispatch(em, 'click', {bubbles: true, cancelable: true});
    assert(spy.calledTwice);

    d.destroy();
    dispatch(em, 'click', {bubbles: true, cancelable: true});
    assert(spy.calledTwice);
  });

  it('can optionally bind to the event capture phase', function() {
    // Skips this test in unsupporting browers.
    if (!Element.prototype.addEventListener) this.skip();

    afixLightDom();

    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const d1 = delegate(document, 'click', 'p', spy1);
    const d2 = delegate(document, 'click', 'p', spy2, {useCapture: true});

    // Stops the event in the bubble phase.
    div.addEventListener('click', function(event) {
      event.stopPropagation();
    });

    dispatch(em, 'click', {bubbles: true, cancelable: true});
    assert(!spy1.called);
    assert(spy2.calledOnce);

    d1.destroy();
    d2.destroy();
  });

  // TODO(philipwalton): at the moment this test doesn't work in any
  // browser because events triggered via JavaScript do not seem to buble
  // outside of the shadow root.
  it('can delegate to elements inside a shadow tree', function() {
    // Skips this test in unsupporting browsers.
    if (!('composedPath' in Event.prototype)) this.skip();

    afixShadowDom();

    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const d1 = delegate(div, 'click', 'p', spy1);
    const d2 = delegate(div, 'click', 'p', spy2, {composed: true});

    dispatch(em, 'click', {bubbles: true, cancelable: true, composed: true});

    assert(!spy1.called);
    assert(spy2.calledOnce);

    d1.destroy();
    d2.destroy();
  });
});
