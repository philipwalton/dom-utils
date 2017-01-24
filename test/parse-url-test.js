import assert from 'assert';
import {parseUrl} from '..';


describe('parseUrl', () => {
  it('parses the a URL and returns a location-like object', () => {
    const url = parseUrl(
        'https://www.example.com:1234/path/to/file.html?a=b&c=d#hash');

    assert.deepEqual(url, {
      hash: '#hash',
      host: 'www.example.com:1234',
      hostname: 'www.example.com',
      href: 'https://www.example.com:1234/path/to/file.html?a=b&c=d#hash',
      origin: 'https://www.example.com:1234',
      pathname: '/path/to/file.html',
      port: '1234',
      protocol: 'https:',
      search: '?a=b&c=d',
    });
  });

  it('parses a sparse URL', () => {
    const url = parseUrl('http://example.com');

    assert.deepEqual(url, {
      hash: '',
      host: 'example.com',
      hostname: 'example.com',
      href: 'http://example.com/', // Note the trailing slash.
      origin: 'http://example.com',
      pathname: '/',
      port: '',
      protocol: 'http:',
      search: '',
    });
  });

  it('parses URLs relative to the root', () => {
    const url = parseUrl('/path/to/file.html?a=b&c=d#hash');

    // Specified portions of the URL.
    assert.equal(url.hash, '#hash');
    assert.equal(url.pathname, '/path/to/file.html');
    assert.equal(url.search, '?a=b&c=d');

    // Non-specified portions of the URL should match `window.location`.
    assert.equal(url.host, location.host);
    assert.equal(url.hostname, location.hostname);
    assert.equal(url.port, location.port);
    assert.equal(url.protocol, location.protocol);

    // Not all browsers support the `origin` property, so we derive it.
    const origin = location.origin || location.protocol + '//' + location.host;
    assert.equal(url.origin, origin);
  });

  it('parses URLs relative to the file', () => {
    // Assumes the tests are hosted at `/test/`;
    const url = parseUrl('../path/to/file.html?a=b&c=d#hash');

    // Manually calculate the pathname since these tests run on servers as well
    // as using the file protocol.
    const pathname = location.pathname
        .replace(/test\/(index\.html)?/, '') + 'path/to/file.html';

    // Specified portions of the URL.
    assert.equal(url.hash, '#hash');
    assert.equal(url.pathname, pathname);
    assert.equal(url.search, '?a=b&c=d');

    // Non-specified portions of the URL should match `window.location`.
    assert.equal(url.host, location.host);
    assert.equal(url.hostname, location.hostname);
    assert.equal(url.port, location.port);
    assert.equal(url.protocol, location.protocol);

    // Not all browsers support the `origin` property, so we derive it.
    const origin = location.origin || location.protocol + '//' + location.host;
    assert.equal(url.origin, origin);
  });


  it('should resolve various relative path types', () => {
    const url1 = parseUrl('.');
    assert.equal(url1.pathname, location.pathname);

    const url2 = parseUrl('..');
    assert.equal(url2.pathname,
        location.pathname.replace(/test\/(index.html)?$/, ''));

    const url3 = parseUrl('./foobar.html');
    assert.equal(url3.pathname,
        location.pathname.replace(/(index.html)?$/, 'foobar.html'));

    const url4 = parseUrl('../foobar.html');
    assert.equal(url4.pathname,
        location.pathname.replace(/test\/(index.html)?$/, 'foobar.html'));

    const url5 = parseUrl('.../foobar.html');
    assert.equal(url5.pathname,
        location.pathname.replace('index.html', '') + '.../foobar.html');
  });

  it('parses the current URL when given a falsy value', () => {
    const url = parseUrl();

    // Assumes the tests are hosted at `/test/`;
    assert.equal(url.hash, location.hash);
    assert.equal(url.pathname, location.pathname);
    assert.equal(url.search, location.search);

    // Non-specified portions of the URL should match `window.location`.
    assert.equal(url.host, location.host);
    assert.equal(url.hostname, location.hostname);
    assert.equal(url.port, location.port);
    assert.equal(url.protocol, location.protocol);

    // Not all browsers support the `origin` property, so we derive it.
    const origin = location.origin || location.protocol + '//' + location.host;
    assert.equal(url.origin, origin);

    assert.deepEqual(url, parseUrl(null));
    assert.deepEqual(url, parseUrl(''));
  });
});
