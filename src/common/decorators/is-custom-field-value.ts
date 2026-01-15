import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCustomFieldValue', async: false })
export class IsCustomFieldValue implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      value instanceof Date
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a string, number, or Date`;
  }
}
