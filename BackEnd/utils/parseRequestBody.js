function parseRequestBody(req, res, next) {
  let body = {};

  if (req.body && Object.keys(req.body).length > 0) {
    body = req.body;
  }

  if (req.file) {
    body.field_image = req.file.filename;
  }

  // Flexible parse options
  if (body.options) {
    try {
      body.options = JSON.parse(body.options);
    } catch {
      // keep as string if not JSON
      body.options = body.options;
    }
  }

  // Flexible parse conditional_logic
  if (body.conditional_logic) {
    try {
      body.conditional_logic = JSON.parse(body.conditional_logic);
    } catch {
      body.conditional_logic = body.conditional_logic;
    }
  }

  req.parsedBody = body;
  next();
}

module.exports = parseRequestBody;
