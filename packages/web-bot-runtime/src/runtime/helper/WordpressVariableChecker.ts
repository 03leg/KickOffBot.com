export class WordpressVariableChecker {
  public static isWordpressVariable(variableName: string): boolean {
    return [
      'wp_user_id',
      'wp_user_isLoggedIn',
      'wp_user_userName',
      'wp_user_email',
      'wp_user_firstName',
      'wp_user_lastName',
      'wp_user_displayName',
      'wp_woo_product',
      'wp_woo_cartTotal',
      'wp_woo_cartIsEmpty',
      'wp_woo_cartItems',
    ].includes(variableName);
  }
}
