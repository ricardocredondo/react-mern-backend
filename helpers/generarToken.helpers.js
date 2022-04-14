const generarToken = () => {
  const aleatorio = Math.random().toString(36).substring(2);
  const fecha = Date.now().toString(36);
  return aleatorio + fecha;
};
export default generarToken;
