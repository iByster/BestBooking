const { GET_TYPE_TITLE, GET_TYPE_INPUT, GET_TYPE_TEXT } = require('../consts');

const getContentByType = (type, node) => {
  if (type === GET_TYPE_INPUT) {
    return node.value;
  }

  if (type === GET_TYPE_TITLE) {
    return node.textContent;
  }

  if (type === GET_TYPE_TEXT) {
    return node.innerText;
  }

  return node.innerText;
};

module.exports = getContentByType;
