const {
  isAValidEmail,
  isAWeakPassword,
} = require('../../utils/utils');

const email = 'admin@gmail.com';
const password = 'adminbq';

describe('isAValidEmail', () => {
  it('should return true if we give a valid email', () => {
    expect(isAValidEmail(email)).toBe(true);
  });
  it('should return false if we give an invalid email', () => {
    expect(isAValidEmail('12345')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('should return true for a valid password', () => {
    expect(isAWeakPassword(password)).toBe(true);
  });
  it('should return false for an invalid password', () => {
    expect(isAWeakPassword('13')).toBe(false);
  });
  it('should return false for an invalid password', () => {
    expect(isAWeakPassword('13')).toBe(false);
  });
});
