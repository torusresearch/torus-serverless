import Schema from 'validate'
export default (_schema) => {
  const validator = new Schema(_schema)
  return validator
}
