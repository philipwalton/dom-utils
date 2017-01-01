import assert from 'assert';
import {getAttributes} from '..';


describe('getAttributes', () => {
  it('returns an object representation of the element attributes', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    div.setAttribute('foo', 'FOO');
    div.setAttribute('bar', 'BAR');
    div.setAttribute('qux', 'QUX');
    assert.deepEqual(getAttributes(div), {
      'foo': 'FOO',
      'bar': 'BAR',
      'qux': 'QUX',
    });

    document.body.removeChild(div);
  });

  it('returns an empty object when there are no attributes', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    assert.deepEqual(getAttributes(div), {});

    document.body.removeChild(div);
  });

  it('handles invalid inputs gracefully', () => {
    assert.deepEqual(getAttributes(), {});
    assert.deepEqual(getAttributes(null), {});
    assert.deepEqual(getAttributes(document), {});
  });
});
