function calculatePaintStatus(paint) {
  if (paint.inventory == 0) {
    return "out of stock";
  }
  return paint.inventory > paint.runningLow ? "available" : "running low";
}

function paintWithStatus(paint) {
  return { ...paint, status: calculatePaintStatus(paint) }
}

module.exports = function(app, PAINTS) {
  app.get('/paints', (request, response, next) => {
    try {
      const paintsWithStatus = PAINTS.map(paint => paintWithStatus(paint));
      response.send(paintsWithStatus);
    } catch (error) {
      next(error)
    }
  })

  app.put('/paints/:color', (request, response, next) => {
    try {
      const color = request.params.color;
      const paintIndex = PAINTS.findIndex(paint => paint.color === color)

      if (paintIndex === -1) {
        response.status(404).send('Paint not found.')
        return
      }
      const runningLow = request.body?.runningLow || PAINTS[paintIndex].runningLow
      const paintUpdated = paintWithStatus({color, runningLow, ...request.body});
      PAINTS.splice(paintIndex, 1, paintUpdated)
      response.send(PAINTS[paintIndex])
    } catch (error) {
      next(error)
    }
  })
}