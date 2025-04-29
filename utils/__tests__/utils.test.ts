import { capitalize, validateEmail, toSnakeCase, snakeToCamelKeys, camelToSnakeKeys } from '../utils';
import { SnakifyKeys } from '../types';

describe('Utility Functions', () => {
  // Test capitalize
  describe('capitalize', () => {
    it('should capitalize the first letter of a lowercase string', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should return an already capitalized string as is', () => {
      expect(capitalize('World')).toBe('World');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle strings with numbers or symbols', () => {
      expect(capitalize('1test')).toBe('1test');
      expect(capitalize('$test')).toBe('$test');
    });
  });

  // Test validateEmail
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('first.last@sub.domain.org')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('plainaddress')).toBe(false);
      expect(validateEmail('@missingusername.com')).toBe(false);
      expect(validateEmail('username@.com')).toBe(false);
      expect(validateEmail('username@domain.')).toBe(false);
      expect(validateEmail('username@domain .com')).toBe(false); // space
      expect(validateEmail('username@domain..com')).toBe(false); // double dot
    });
  });

   // Test toSnakeCase
   describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('dateTime')).toBe('date_time');
      expect(toSnakeCase('imageURL')).toBe('image_u_r_l'); // Note: Standard conversion might differ
    });

    it('should handle already snake_case strings', () => {
        expect(toSnakeCase('hello_world')).toBe('hello_world');
      });

    it('should handle single words', () => {
      expect(toSnakeCase('word')).toBe('word');
    });
  });

  // Test snakeToCamelKeys
  describe('snakeToCamelKeys', () => {
    it('should convert object keys from snake_case to camelCase', () => {
      const snakeObj: SnakifyKeys<{ firstName: string; lastName: string; dateOfBirth: Date }> = {
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: new Date('1990-01-01')
      };
      const expectedCamelObj = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01')
      };
      expect(snakeToCamelKeys(snakeObj)).toEqual(expectedCamelObj);
    });
  });

   // Test camelToSnakeKeys
   describe('camelToSnakeKeys', () => {
    it('should convert object keys from camelCase to snake_case', () => {
      const camelObj = {
        firstName: 'Jane',
        lastName: 'Doe',
        isUserActive: true,
      };
      const expectedSnakeObj = {
        first_name: 'Jane',
        last_name: 'Doe',
        is_user_active: true,
      };
      expect(camelToSnakeKeys(camelObj)).toEqual(expectedSnakeObj);
    });
  });
});