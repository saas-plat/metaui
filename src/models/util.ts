import { SimpleModel } from './SimpleModel';

export function createModel({ type, ...props }) {
  switch (type) {
    default:
      return new SimpleModel({ type, ...props });
  }
}
