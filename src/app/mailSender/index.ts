/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import config from '../../config';
import AppError from '../ErrorHandler/AppError';
import httpStatus from 'http-status';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: config.mailName,
    pass: config.mailPassword,
  },
});

export const sendMail = async ({
  users,
  subject,
  //   textMessage,
  htmlMessage,
}: any) => {
  if (!users && !subject && !htmlMessage) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'please provide userMail, subject, and message',
    );
  }
  try {
    const res = await transporter.sendMail({
      from: config.mailName,
      to: users,
      subject: subject, // Subject line
      //   text: textMessage,
      html: htmlMessage, // html body
    });
    return res;
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, err || 'mail send failed');
  }
};
