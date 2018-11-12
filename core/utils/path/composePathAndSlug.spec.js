/* eslint-env jest */

import composePathAndSlug from './composePathAndSlug';

describe('composePathAndSlug', () => {
  test('should return path plus slug', () => {
    const path = '/some/path';
    const slug = 'slug';
    const result = composePathAndSlug(path, slug);
    expect(result).toBe('/some/path/slug');
  });
  test('should return path plus empty slug', () => {
    const path = '/some/path';
    const slug = '';
    const result = composePathAndSlug(path, slug);
    expect(result).toBe('/some/path');
  });
  test('should return empty path puls empty slug', () => {
    const path = '/';
    const slug = '';
    const result = composePathAndSlug(path, slug);
    expect(result).toBe('/');
  });
  test('should return empty path puls empty slug', () => {
    const path = '/';
    const slug = 'slug';
    const result = composePathAndSlug(path, slug);
    expect(result).toBe('/slug');
  });
  test('should return empty path puls undefined slug', () => {
    const path = '/';
    const slug = undefined;
    const result = composePathAndSlug(path, slug);
    expect(result).toBe('/');
  });
  test('should return path puls undefined slug', () => {
    const path = '/some/path';
    const slug = undefined;
    const result = composePathAndSlug(path, slug);
    expect(result).toBe('/some/path');
  });

  test('should return path plus slug for uk locale', () => {
    const path = '/some/path';
    const slug = 'slug';
    const locale = 'uk';
    const result = composePathAndSlug(path, slug, locale);
    expect(result).toBe('/some/path/slug');
  });
  test('should return path plus empty slug for uk locale', () => {
    const path = '/some/path';
    const slug = '';
    const locale = 'uk';
    const result = composePathAndSlug(path, slug, locale);
    expect(result).toBe('/some/path');
  });
  test('should return empty path puls empty slug for uk locale', () => {
    const path = '/';
    const slug = '';
    const locale = 'uk';
    const result = composePathAndSlug(path, slug, locale);
    expect(result).toBe('/');
  });
  test('should return empty path puls empty slug for uk locale', () => {
    const path = '/';
    const slug = 'slug';
    const locale = 'uk';
    const result = composePathAndSlug(path, slug, locale);
    expect(result).toBe('/slug');
  });
  test('should return path plus slug for en locale', () => {
    const path = '/some/path';
    const slug = 'slug';
    const locale = 'en';
    const result = composePathAndSlug(path, slug, locale);
    expect(result).toBe('/en/some/path/slug');
  });
  test('should return path plus empty slug for en locale', () => {
    const path = '/some/path';
    const slug = '';
    const locale = 'en';
    const result = composePathAndSlug(path, slug, locale);
    expect(result).toBe('/en/some/path');
  });
  test('should return empty path puls empty slug for en locale', () => {
    const path = '/';
    const slug = '';
    const locale = 'en';
    const result = composePathAndSlug(path, slug, locale);
    expect(result).toBe('/en');
  });
  test('should return empty path puls empty slug for en locale', () => {
    const path = '/';
    const slug = 'slug';
    const locale = 'en';
    const result = composePathAndSlug(path, slug, locale);
    expect(result).toBe('/en/slug');
  });
});
