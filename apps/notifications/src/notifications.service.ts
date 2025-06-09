import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { Logger } from 'nestjs-pino';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NotificationsService {
  private readonly transporter: nodemailer.Transporter;
  private readonly template: handlebars.TemplateDelegate;

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('SMTP_USER'),
        clientId: this.configService.get<string>('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: this.configService.get<string>(
          'GOOGLE_OAUTH_CLIENT_SECRET',
        ),
        refreshToken: this.configService.get<string>(
          'GOOGLE_OAUTH_REFRESH_TOKEN',
        ),
      },
    });

    // Load and compile the email template
    const templatePath = path.join(__dirname, 'public', 'index.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    this.template = handlebars.compile(templateSource);
  }

  async notifyEmail({
    email,
    subject,
    text,
    date,
    ...additionalData
  }: NotifyEmailDto) {
    try {
      const templateData = {
        email,
        subject,
        text,
        date: new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        ...additionalData,
      };

      const html = this.template(templateData);

      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_USER'),
        to: email,
        subject,
        text,
        html,
      });

      this.logger.log(
        `Email sent to ${email} with subject "${subject}"`,
        NotificationsService.name,
      );
    } catch (error) {
      this.logger.error(
        `Error sending email to ${email}: ${error}`,
        NotificationsService.name,
      );
      throw new InternalServerErrorException(error);
    }
  }
}
