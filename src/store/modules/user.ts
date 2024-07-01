import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators";
import store from "@/store";
import { IUserState } from "@/store/getters";
import LOGIN from "@/api/module/login";
import Utils from "@/utils/utils";
import { Message } from "@lui/lui-ui";

@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule implements IUserState {
  public token = "";
  public accountType = 0;
  public fullname = "";
  public username = "";
  public avatar = "";
  public email = "";
  public tenantCode = "";
  public personId = "";
  public expire = 0;
  public mobile = "";
  public userId = 0;
  public orgId = "";
  public orgName = "";
  public hrmDeptId = "";
  public roles = [];
  public ssoServiceTicket = Utils.queryUrl(window.location.href).sso_service_ticket;
  public loginType = {
    erp: "sso.jd.com",
    passport: "pin"
  };
  public tokenKey = this.loginType.erp;

  // @Mutation里的this指代state
  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token;
  }

  @Mutation
  private SET_NAME(fullname: string) {
    this.fullname = fullname;
  }

  @Mutation
  private SET_TOKEN_KEY(tokenKey: string) {
    this.tokenKey = tokenKey;
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar;
  }

  @Mutation
  private SET_USER_NAME(userName: string) {
    this.username = userName;
  }

  @Mutation
  private SET_USER_ID(userId: number) {
    this.userId = userId;
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email;
  }

  @Mutation
  private SET_ACCOUNT_TYPE(accountType: any) {
    this.accountType = accountType;
  }
  @Action
  public async commonErpLogin() {
    try {
      // 校验是否登录成功
      // 获取真实ticket并setCookie
      const loginRes: any = await LOGIN.login({
        url: window.location.href,
        appCode: window.env.erpLoginAppCode,
        ticket: this.ssoServiceTicket,
        code: Utils.queryUrl(window.location.href).code
      });
      // 未登录
      if (loginRes.code === 1) {
        const authorizeRes = await LOGIN.authorize({
          scope: "openid",
          response_type: "code",
          client_id: window.env.erpLoginAppCode,
          state: Date.now(),
          redirect_uri: window.location.href
        });
        const { type, value } = authorizeRes.data;
        // 根据不同type处理
        switch (type) {
          case "RETURN_URL":
            window.location.href = value;
            break;
          case "OIDC_CODE":
            window.location.href = `${window.location.href}${window.location.href.indexOf("?") > -1 ? "&" : "?"}code=${value}`;
            break;
          default:
            console.log("commonErpLogin 出现异常！");
            break;
        }
      }

      return loginRes;
    } catch (error) {
      console.log(error);
    }
  }

  // @Action
  // public async login() {
  //   const { erpHostname } = window.env;
  //   window.location.href = `${erpHostname}/sso/login?ReturnUrl=${encodeURIComponent(window.location.href)}` || ""; // erp内网 登录开启
  // }

  @Action
  public resetToken() {
    this.SET_TOKEN("");
  }

  @Action
  public async checkLogin() {
    const loginType = "erp";
    // 强校验
    switch (loginType) {
      case "erp":
        const getCheckLoginRes: any = await this.commonErpLogin();
        if (!getCheckLoginRes.code) {
          // 成功后写入用户信息
          const { fullname, username, email, avatar, userId } = getCheckLoginRes.data;
          this.SET_NAME(fullname);
          this.SET_USER_NAME(username);
          this.SET_EMAIL(email);
          this.SET_AVATAR(avatar);
          this.SET_USER_ID(userId);

          return true;
        } else if (getCheckLoginRes.code === 101) {
          // 应用未接入，联系luobinbin5提供erp的 appKey + appToken
          Message({
            type: "error",
            message: getCheckLoginRes.message
          });

          return false;
        }
        break;
      default:
        break;
    }
  }

  @Action
  public async logOut() {
    this.resetToken();
    const appCode = window.env.erpLoginAppCode;
    await LOGIN.logOut({ appCode });
    const { erpHostname } = window.env;
    window.location.href = `${erpHostname}/sso/logout?ReturnUrl=${encodeURIComponent(window.location.href)}` || ""; // erp内网 登出
  }

  @Action
  public setAccountType(no: any) {
    this.SET_ACCOUNT_TYPE(no);
  }
}

export const UserModule = getModule(User);
