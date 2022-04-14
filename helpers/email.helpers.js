import nodemailer from 'nodemailer';
export const emailRegistro = async (datos) => {
  const { nombre, email, token } = datos;
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const info = await transport.sendMail({
    from: '"Mern practicas - Administrador de proyectos" - <cuentas@uptask.com>',
    to: email,
    subject: 'Mern Practicas - Comprueba tu cuenta',
    text: 'Comprueba tu cuenta en Mern Practicas',
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en Mern Practicas</p>
      <p>Tu cuenta está casi lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Comprobar cuenta</a>
      </p>
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
      `,
  });
};
export const emailOlvidePassword = async (datos) => {
  const { nombre, email, token } = datos;
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const info = await transport.sendMail({
    from: '"Mern practicas - Administrador de proyectos" - <cuentas@uptask.com>',
    to: email,
    subject: 'Mern Practicas - Reestablece tu password',
    text: 'Reestablece tu password',
    html: `<p>Hola: ${nombre} Has solicitado reestablecer tu password</p>
      <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Comprobar cuenta</a>
      </p>
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
      `,
  });
};
