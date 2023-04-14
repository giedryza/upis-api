export const stripPhone = (phone: string): string =>
  phone.replace(/[^+\d]+/g, '');
