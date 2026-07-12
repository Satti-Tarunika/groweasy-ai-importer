async function getFieldMapping(headers) {
  const mapping = {};

  headers.forEach((header) => {
    const h = header.toLowerCase();

    if (h.includes("name")) {
      mapping[header] = "name";
    } else if (h.includes("email")) {
      mapping[header] = "email";
    } else if (h.includes("phone") || h.includes("mobile")) {
      mapping[header] = "phone";
    } else if (h.includes("city") || h.includes("location")) {
      mapping[header] = "city";
    }
  });

  return mapping;
}

module.exports = { getFieldMapping };