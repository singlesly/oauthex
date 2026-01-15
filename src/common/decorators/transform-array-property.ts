import { Transform } from 'class-transformer';

export const TransformArrayProperty = (): PropertyDecorator => {
  return Transform((v) => {
    if (v.value && !Array.isArray(v.value)) {
      v.value = [v.value];
    }
    if (!v.value) {
      v.value = [];
    }

    return v.value;
  });
};
