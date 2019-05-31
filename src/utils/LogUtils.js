// Load and cache NODE_ENV
const NODE_ENV = process.env.NODE_ENV;

const isProduction = NODE_ENV === 'production' ? true : false;

export function logOrRaise (error) {
  if (isProduction) {
    console.error(error);
  } else {
    throw new Error(error);
  }
}
