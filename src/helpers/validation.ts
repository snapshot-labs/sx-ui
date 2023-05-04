import Ajv, { ErrorObject } from 'ajv';
import { validateAndParseAddress } from 'starknet';
import { isAddress } from '@ethersproject/address';
import { parseUnits } from '@ethersproject/units';
import { Zero, MinInt256, MaxInt256, MaxUint256 } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';

function getErrorMessage(errorObject: ErrorObject): string {
  if (!errorObject.message) return 'Invalid field.';

  if (errorObject.keyword === 'format') {
    switch (errorObject.params.format) {
      case 'address':
        return 'Must be a valid address.';
      case 'uint256':
      case 'int256':
        return `Must be a valid ${errorObject.params.format} value.`;
      case 'ethValue':
        return 'Must be a valid Ethereum value.';
      default:
        return 'Invalid format.';
    }
  }

  return `${errorObject.message.charAt(0).toLocaleUpperCase()}${errorObject.message
    .slice(1)
    .toLocaleLowerCase()}.`;
}

export function validateForm(schema, form): Record<string, string> {
  const ajv = new Ajv({ allErrors: true });

  ajv.addFormat('address', {
    validate: (value: string) => {
      try {
        return !!validateAndParseAddress(value);
      } catch (err) {
        return isAddress(value);
      }
    }
  });

  ajv.addFormat('stamp', {
    validate: () => true
  });

  ajv.addFormat('long', {
    validate: () => true
  });

  ajv.addFormat('uint256', {
    validate: value => {
      if (!value.match(/^([0-9]|[1-9][0-9]+)$/)) return false;

      try {
        const number = BigNumber.from(value);
        return number.gte(Zero) && number.lte(MaxUint256);
      } catch {
        return false;
      }
    }
  });

  ajv.addFormat('ethValue', {
    validate: value => {
      if (!value.match(/^([0-9]|[1-9][0-9]+)(\.[0-9]+)?$/)) return false;

      try {
        parseUnits(value, 18);
        return true;
      } catch {
        return false;
      }
    }
  });

  ajv.addFormat('int256', {
    validate: value => {
      if (!value.match(/^-?([0-9]|[1-9][0-9]+)$/)) return false;

      try {
        const number = BigNumber.from(value);
        return number.gte(MinInt256) && number.lte(MaxInt256);
      } catch {
        return false;
      }
    }
  });

  ajv.addKeyword('options');

  ajv.validate(schema, form);

  const output = {};
  if (!ajv.errors) {
    return output;
  }

  for (const error of ajv.errors) {
    const path = error.instancePath.split('/').slice(1);

    let current = output;
    for (let i = 0; i < path.length - 1; i++) {
      const subpath = path[i];
      if (!current[subpath]) current[subpath] = {};
      current = current[subpath];
    }

    current[path[path.length - 1]] = getErrorMessage(error);
  }

  return output;
}
