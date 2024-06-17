import Document, {
  Html, Head, Main, NextScript
} from 'next/document';
import { settingService } from '@services/setting.service';

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const resp = await settingService.all();
    const settings = resp.data;
    return {
      ...initialProps,
      settings
    };
  }

  render() {
    const { settings } = this.props as any;
    return (
      <Html>
        <Head>
          <link rel="icon" href={settings && settings.favicon} sizes="64x64" />
          {/* GA code */}
          {settings && settings.gaCode && [
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaCode}`} />,
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `
                 window.dataLayer = window.dataLayer || [];
                 function gtag(){dataLayer.push(arguments);}
                 gtag('js', new Date());
                 gtag('config', '${settings.gaCode}');
             `
              }}
            />
          ]}
        </Head>
        <body>
          {/* extra script */}
          {settings && settings.headerScript && (
            // eslint-disable-next-line react/no-danger
            <div dangerouslySetInnerHTML={{ __html: settings.headerScript }} />
          )}
          <Main />
          <NextScript />

          {/* extra script */}
          {settings && settings.afterBodyScript && (
            // eslint-disable-next-line react/no-danger
            <div dangerouslySetInnerHTML={{ __html: settings.afterBodyScript }} />
          )}
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
