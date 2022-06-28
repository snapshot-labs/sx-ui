import Ajv from 'ajv';
import { isAddress } from '@ethersproject/address';

export function validateForm(schema, form) {
  const ajv = new Ajv({ allErrors: true });

  ajv.addFormat('address', {
    validate: isAddress
  });

  ajv.addFormat('uint256', {
    validate: value => !!value.match(/^[0-9]+$/)
  });

  ajv.validate(schema, form);

  const output = {};
  if (!ajv.errors) {
    return output;
  }

  for (const error of ajv.errors) {
    const path = error.dataPath.split('.').slice(1);

    let current = output;
    for (let i = 0; i < path.length - 1; i++) {
      const subpath = path[i];
      if (!current[subpath]) current[subpath] = {};
      current = current[subpath];
    }

    current[path[path.length - 1]] = 'Invalid field';
  }

  return output;
}
