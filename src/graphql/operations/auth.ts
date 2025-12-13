import { gql } from '@apollo/client';
import { USER_FULL_FRAGMENT } from '../fragments';

// ============================================
// QUERIES
// ============================================

export const ME_QUERY = gql`
  query Me {
    me {
      ...UserFull
    }
  }
  ${USER_FULL_FRAGMENT}
`;

// ============================================
// MUTATIONS
// ============================================

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      refreshToken
      expiresAt
      user {
        ...UserFull
      }
    }
  }
  ${USER_FULL_FRAGMENT}
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      refreshToken
      expiresAt
      user {
        ...UserFull
      }
    }
  }
  ${USER_FULL_FRAGMENT}
`;

export const SOCIAL_LOGIN_MUTATION = gql`
  mutation SocialLogin($input: SocialLoginInput!) {
    socialLogin(input: $input) {
      token
      refreshToken
      expiresAt
      user {
        ...UserFull
      }
    }
  }
  ${USER_FULL_FRAGMENT}
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
      expiresAt
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      message
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      message
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;

export const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation ResendVerificationEmail {
    resendVerificationEmail {
      success
      message
    }
  }
`;
