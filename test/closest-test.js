import assert from 'assert';
import {closest} from '..';


describe('closest', () => {
  const fixtures = document.createElement('div');
  fixtures.id = 'fixtures';

  beforeEach(() => document.body.appendChild(fixtures));
  afterEach(() => fixtures.innerHTML = '');
  after(() => document.body.removeChild(fixtures));

  it('should find a matching parent from a CSS selector', () => {
    fixtures.innerHTML =
        '<div id="div">' +
        '  <p id="p">' +
        '    <em id="em"></em>' +
        '  </p>' +
        '</div>';

    const div = document.getElementById('div');
    const p = document.getElementById('p');
    const em = document.getElementById('em');

    assert.equal(closest(em, 'p'), p);
    assert.equal(closest(em, '#div'), div);
    assert.equal(closest(p, 'html > body'), document.body);

    assert(!closest(em, '#nomatch'));
  });

  it('should test the element itself if the third args is true', () => {
    fixtures.innerHTML = '<p id="p"><em id="em"></em></p>';

    const p = document.getElementById('p');
    const em = document.getElementById('em');

    assert(!closest(em, 'em'));
    assert.equal(closest(em, 'em', true), em);
    assert(!closest(p, 'p'));
    assert.equal(closest(p, 'p', true), p);
  });

  it('handles invalid inputs gracefully', () => {
    assert(!closest());
    assert(!closest(null, 'div'));
    assert(!closest(document.body));
    assert(!closest(document, '*'));
  });
});
