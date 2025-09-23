const description = (value) => value.replace(/<[^>]+>/g, "");

const sanitizeData = {
  description,
};

export default sanitizeData;
