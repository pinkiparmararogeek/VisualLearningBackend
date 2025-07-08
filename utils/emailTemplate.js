async function resetPassEmailTemplate({ name, email, password }) {

   
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <link
      rel="preload"
      as="image"
      href="https://vectoemindsnew.s3.us-east-1.amazonaws.com/image/1743594070551_inurum_logo.png" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body
    style="background-color:#f9f9f9;font-family:&#x27;Inter&#x27;, sans-serif;margin:0;padding:0;overflow:hidden">
    <!--$-->
    <div
      style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
      Your Inurum Technologies password has been reset
     
    </div>
    <table
      role="presentation"
      width="100%"
      height="100vh"
      style="background-color:#f9f9f9;min-height:100vh">
      <tr>
        <td valign="top" style="flex:1;padding:20px">
          <table
            align="center"
            role="presentation"
            style="background-color:#ffffff;border-radius:8px;box-shadow:0px 0px 10px rgba(0, 0, 0, 0.1);padding:20px;min-height:calc(80vh - 80px)">
            <tr>
              <td align="center" style="padding-bottom:20px">
              <p>Password reset successfully.</p>
              </td>
            </tr>
           
            <tr>
              <td style="font-size:16px;color:#555;padding-bottom:10px">
                <p>Hi ${name},</p>
                <p>
                  Your password has been successfully reset. You can now log in
                  to your account using the new credentials provided below.
                </p>
              </td>
            </tr>
            <tr>
              <td
                align="center"
                style="background-color:#f3f3f3;padding:15px;border-radius:8px;margin:20px 0">
                 <p
                  style="font-size:16px;line-height:24px;font-weight:bold;margin-bottom:16px;margin-top:16px">
                  Email: ${email}
                </p>
                <p
                  style="font-size:16px;line-height:24px;font-weight:bold;margin-bottom:16px;margin-top:16px">
                  Username: ${name}
                </p>
              
                <p
                  style="font-size:16px;line-height:24px;font-weight:bold;margin-top:10px;margin-bottom:16px">
                  New Password: ${password}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <hr
                  style="width:100%;border:none;border-top:1px solid #eaeaea;margin:20px 0;border-color:#ddd" />
              </td>
            </tr>
            <tr>
              <td
                align="center"
                style="font-size:14px;color:#888;padding-bottom:20px">
                For your security, we recommend changing this password after
                logging in. If you didn’t request this change, please contact
                our IT support team immediately.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <!--7--><!--/$-->
  </body>
</html>
`;
}

module.exports = { resetPassEmailTemplate};