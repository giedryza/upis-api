import { OAuth2Client } from 'google-auth-library';

import { APP } from 'config';

export class GoogleAuth {
  private static clientId = APP.google.clientId;

  private static client = new OAuth2Client(this.clientId);

  static parseToken = async (token: string) => {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.clientId,
      });
      const payload = ticket.getPayload();

      if (!payload) return null;

      return payload;
    } catch (error) {
      return null;
    }
  };
}
