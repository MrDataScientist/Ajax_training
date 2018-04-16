import React from 'react'
import GoogleLogin from 'react-google-login'

const LoginButton = ({
  authenticated,
  loginSuccess,
  loginFailure,
  success,
  className,
  disabled,
  buttonText,
  logo
}) => {
  return (
    authenticated
    ? <button
        className={className}
        onClick={() => success()}
        disabled={disabled}>{buttonText}</button>
    : <a
        className={className}
        disabled={disabled}
        href={ !disabled ? 'auth/google' : 'javascript:void(0)' }>
          { logo && <span><span className={logo}></span>&nbsp;&nbsp;</span> }
          <strong>{buttonText}</strong>
        </a>
  )
}

export default LoginButton
