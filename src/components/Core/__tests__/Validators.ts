import * as validators from '../Validators';

describe('core/Validators', () => {
  it('all validators - should not allow empty', () => {
    expect(validators.validateName('')).toEqual(false);
    expect(validators.validateLogin('')).toEqual(false);
    expect(validators.validateEmail('')).toEqual(false);
    expect(validators.validatePhone('')).toEqual(false);
    expect(validators.validateMessage('')).toEqual(false);
    expect(validators.validatePassword('')).toEqual(false);
  });

  it('name - should not allow start with small letter', () => {
    expect(validators.validateName('supername')).toEqual(false);
  });

  it('name - should start with capital letter', () => {
    expect(validators.validateName('Supername')).toEqual(true);
  });

  it('login - should have length between 3 and 20 symbols', () => {
    expect(validators.validateLogin('sp')).toEqual(false);
    expect(validators.validateLogin('supersupersupersupers')).toEqual(false);
    expect(validators.validateLogin('supersupersupersupe')).toEqual(true);
  });

  it('login - should not start with any except letter', () => {
    expect(validators.validateLogin('0super')).toEqual(false);
    expect(validators.validateLogin('-super')).toEqual(false);
  });

  it('email - should have an "@"', () => {
    expect(validators.validateEmail('as@as.ss')).toEqual(true);
    expect(validators.validateEmail('as-at-as.ss')).toEqual(false);
  });

  it('email - should have dot', () => {
    expect(validators.validateEmail('as@asss')).toEqual(false);
  });

  it('phone - should contains only numbers and may start with +', () => {
    expect(validators.validatePhone('+79887776655')).toEqual(true);
    expect(validators.validatePhone('a79887776655')).toEqual(false);
  });

  it('phone - may not start with +', () => {
    expect(validators.validatePhone('79887776655')).toEqual(true);
  });

  it('phone - should be 10..15 symbols long', () => {
    expect(validators.validatePhone('798877766')).toEqual(false);
    expect(validators.validatePhone('3518887766123456t')).toEqual(false);
  });

  it('password - should contain at least one caputal letter and number', () => {
    expect(validators.validatePassword('mypasspasspass')).toEqual(false);
    expect(validators.validatePassword('myPassPassPass')).toEqual(false);
    expect(validators.validatePassword('mySuperPupe8rPass')).toEqual(true);
  });

  it('password - should be 8..40 symb. long', () => {
    expect(validators.validatePassword('myPass0')).toEqual(false);
    expect(validators.validatePassword('mySuperPupe8rPassmySuperPupe8rPassmySuperPupe8rPassmySuperPupe8rPass'))
      .toEqual(false);
  });

  it('repeated pass - should be equal with pass', () => {
    expect(validators.validateRepPassword('aaa', 'aaa')).toEqual(true);
    expect(validators.validateRepPassword('aaa', 'aasa')).toEqual(false);
  });
});
