import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import {randomBytes} from "crypto";
import jwt from 'jsonwebtoken';

import User from "../db/models/User.js";
import Session from "../db/models/Session.js";

import { accessTokenLifetime, refreshTokenLifetime } from "../constants/users.js";

import { SMTP } from '../constants/email.js';
import { getEnvVar } from "../utils/getEnvVar.js";
import { sendEmail } from '../utils/sendMail.js';

const createSessionData = () => ({
    accessToken: randomBytes(30).toString("base64"),
    refreshToken: randomBytes(30).toString("base64"),
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

export const register = async (payload) => {
    const { email, password } = payload;

    const user = await User.findOne({ email });
    if(user) {
        throw createHttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...payload, password: hashPassword});

    // const token = jwt.sign({email}, JWT_SECRET, {expiresIn: "5m"});

    return newUser;
};

export const login = async ({email, password}) => {
    const user = await User.findOne({email});
    if(!user) {
        throw createHttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw createHttpError(401, "Email or password invalid");
    }

    await Session.deleteOne({userId: user._id});

    const sessionData = createSessionData();

    return Session.create({
        userId: user._id,
        ...sessionData,
    });
};

export const refreshToken = async(payload) => {
    const oldSession = await Session.findOne({
        _id: payload.sessionId,
        refreshToken: payload.refreshToken,
    });
    if(!oldSession) {
        throw createHttpError(401, "Session not found");
    }

    if(Date.now() > oldSession.refreshTokenValidUntil) {
        throw createHttpError(401, "Refresh token expired");
    }

    await Session.deleteOne({_id: payload.sessionId});

    const sessionData = createSessionData();

    return Session.create({
        userId: oldSession.userId,
        ...sessionData,
    });
};

export const logout = async sessionId => {
    await Session.deleteOne({_id: sessionId});
};

export const sendResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetUrl = `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password!</p>`,
    });
  } catch (err) {
    throw createHttpError(500, 'Failed to send the email, please try again later.',
    );
  }
};

export const resetPwd = async (payload) => {
    let entries;
  
    try {
      entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
    } catch (err) {
      if (err instanceof Error) throw createHttpError(401, "Token is expired or invalid.");
      throw err;
    }
  
    const user = await User.findOne({
      email: entries.email,
      _id: entries.sub,
    });
  
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
  
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
  
    await User.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );
  };

export const getUser = filter => User.findOne(filter);

export const getSession = filter => Session.findOne(filter);
