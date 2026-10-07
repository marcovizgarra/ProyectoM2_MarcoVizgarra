export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // unique violation (email already exists, etc.)
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Entrada duplicada: el recurso ya existe'
    });
  }

  // foreign key violation (author_id does not exist, etc.)
  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Violación de clave foránea: el registro relacionado no existe'
    });
  }

  // not-null constraint violation
  if (err.code === '23502') {
    return res.status(400).json({
      error: 'Campo obligatorio faltante: se intentó guardar un valor nulo en un campo requerido'
    });
  }

  // invalid input syntax / data type mismatch
  if (err.code === '22P02') {
    return res.status(400).json({
      error: 'Tipo de dato inválido para la base de datos'
    });
  }

  // string length exceeded (VARCHAR limit reached)
  if (err.code === '22001') {
    return res.status(400).json({
      error: 'Longitud de texto excedida: el contenido supera el límite máximo de caracteres permitido'
    });
  }

  // generic 500 Internal Server Error
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno del servidor';

  return res.status(statusCode).json({
    error: message
  });
};