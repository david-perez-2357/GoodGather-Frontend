function convertSecondsToString(seconds: any) {
  const metrics: { [key: string]: number } = {
    'años': 31536000,
    'mes': 2628000,
    'días': 86400,
    'horas': 3600,
    'minutos': 60,
    'segundos': 1,
  }

  let roundedNumber = seconds;
  let metric = '';
  let result: any = '';

  // Encontrar la métrica adecuada
  for (const key in metrics) {
    if (seconds >= metrics[key]) {
      roundedNumber = Math.floor(seconds / metrics[key]);
      metric = key;
      break;
    }
  }

  // Quitar la 's' si el número es 1
  if (roundedNumber === 1) {
    metric = metric.slice(0, -1);
  }

  // Crear el resultado
  return `${roundedNumber} ${metric}`;
}

export { convertSecondsToString };
