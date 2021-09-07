enum MailJobType {
  SEND_EMAIL_VERIFICATION,
}

export interface IMailerService {
  /**
   * Sends a welcome email
   *
   * @param {string} to the email address of the receiver
   * @param {string} subject the subject of the mail
   * @param {string} text the text content of the mail
   * @returns {Promise<boolean>}
   * @memberof IMailService
   */
  sendEmailVerification(to: string, code: number): Promise<{ delivered: number; status: string }>;

  /**
   *
   *
   * @param {MailJobType} sequenceType
   * @param {*} data
   * @memberof IMailService
   */
  // startEmailSequence(sequenceType: MailJobType, data: any): void;
}
