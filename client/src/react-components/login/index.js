import React from "react";
import "./styles.css";
import { login, register } from "./../../api/login-api"
import LoginTextField from "./textfiled/index";

const stateDefault = {
  page: "login",
  password: "",
  passwordMsg: "",
  passwordValid: true,
  comfirm: "",
  comfirmMsg: "",
  comfirmValid: true,
  email: "",
  emailMsg: "",
  emailValid: true,
  username: "",
  usernameMsg: "",
  usernameValid: true
};

class Login extends React.Component {
  state = stateDefault;

  passwordHandler(e) {
    const pass = e.target.value;
    this.setState({
      password: pass,
      passwordMsg: "",
      passwordValid: true
    });
    if (this.state.page === "signup") {
      if (this.state.comfirm !== "" && pass !== this.state.comfirm) {
        this.setState({
          comfirmMsg: "The passwords you entered do not match.",
          comfirmValid: false
        });
      } else {
        this.setState({
          comfirmMsg: "",
          comfirmValid: true
        });
      }
    } else if (this.state.email !== "") {
      this.setState({
        emailValid: true,
        emailMsg: ""
      });
    }
  }

  comfirmHandler(e) {
    const comf = e.target.value;
    if (this.state.page === "signup" && this.state.password !== comf) {
      this.setState({
        comfirm: comf,
        comfirmMsg: "The passwords you entered do not match.",
        comfirmValid: false
      });
    } else {
      this.setState({
        comfirm: comf,
        comfirmMsg: "",
        comfirmValid: true
      });
    }
  }

  emailHandler(e) {
    this.setState({
      email: e.target.value,
      emailValid: true,
      emailMsg: ""
    });
  }

  nameHandler(e) {
    this.setState({
      username: e.target.value,
      usernameValid: true,
      usernameMsg: ""
    });
  }

  loginHandler() {
    let isValid = true;
    if (this.state.email === "") {
      isValid = false;
      this.setState({
        emailValid: false,
        emailMsg: "this field cannot be empty."
      });
    }
    if (this.state.password === "") {
      isValid = false;
      this.setState({
        passwordValid: false,
        passwordMsg: "this field cannot be empty."
      });
    }
    if (isValid) {
      login({email:this.state.email, password:this.state.password}, (msg, authorized) => {
        if (!authorized) {
          this.setState({
            emailValid: false,
            emailMsg: msg
          });
        }
        else {
          this.props.history.push("/");
        }
      });
    }
  }

  signupHandler() {
    this.setState(stateDefault);
    this.setState({ page: "signup" });
    let inputs = document.querySelectorAll(".textfield, .textfield-invalid");
    for (const input of inputs) {
      input.value = "";
    }
  }

  backHandler() {
    this.setState(stateDefault);
    let inputs = document.querySelectorAll(".textfield, .textfield-invalid");
    for (const input of inputs) {
      input.value = "";
    }
  }

  registerHandler() {
    let valid = this.state.comfirmValid;
    if (this.state.email === "") {
      valid = false;
      this.setState({
        emailValid: false,
        emailMsg: "this field cannot be empty."
      });
    }
    if (this.state.password === "") {
      valid = false;
      this.setState({
        passwordValid: false,
        passwordMsg: "this field cannot be empty."
      });
    }
    if (this.state.username === "") {
      valid = false;
      this.setState({
        usernameValid: false,
        usernameMsg: "this field cannot be empty."
      });
    }
    if (this.state.comfirm === "") {
      valid = false;
      this.setState({
        comfirmValid: false
      });
    }
    if (valid) {
      register({
        email: this.state.email, 
        username: this.state.username, 
        password: this.state.password}, (msg, authorized) => {
        if (!authorized) {
          for (var field in msg) {
            this.setState({
              [field + "Valid"]: false,
              [field + "Msg"]: msg[field]
            });
          }
        }
        else {
          this.props.history.push("/");
        }
      });
    }
  }

  render() {
    return (
      <div>
        <div>
          <img id="logoImg" src={require("../../logo.svg")} alt="TeamUp" />
        </div>
        <div>
          <LoginTextField
            placeHolder="Email"
            contentType="text"
            onChangeHandler={e => this.emailHandler(e)}
            msg={this.state.emailMsg}
            isValid={this.state.emailValid}
          />
        </div>
        <div>
          {this.state.page === "signup" ? (
            <LoginTextField
              placeHolder="Name"
              contentType="text"
              onChangeHandler={e => this.nameHandler(e)}
              msg={this.state.usernameMsg}
              isValid={this.state.usernameValid}
            />
          ) : null}
        </div>
        <div>
          {this.state.page !== "forgot password" ? (
            <LoginTextField
              placeHolder="Password"
              contentType="password"
              onChangeHandler={e => this.passwordHandler(e)}
              msg={this.state.passwordMsg}
              isValid={this.state.passwordValid}
            />
          ) : null}
        </div>
        <div>
          {this.state.page === "signup" ? (
            <LoginTextField
              placeHolder="Comfirm Password"
              contentType="password"
              onChangeHandler={e => this.comfirmHandler(e)}
              msg={this.state.comfirmMsg}
              isValid={this.state.comfirmValid}
            />
          ) : null}
        </div>
        <div id="bts">
          <div>
            {this.state.page === "login" ? (
              <button
                className="login-button button-common"
                onClick={() => this.loginHandler()}
              >
                <b>Login</b>
              </button>
            ) : null}
          </div>
          <div>
            {this.state.page === "login" ? (
              <button
                className="login-button button-common"
                onClick={() => this.signupHandler()}
              >
                <b>Signup</b>
              </button>
            ) : null}
          </div>
          <div>
            {this.state.page === "signup" ? (
              <button
                className="login-button button-common"
                onClick={() => this.registerHandler()}
              >
                <b>Register</b>
              </button>
            ) : null}
          </div>
          <div id="f-password">
            {this.state.page === "login" ? (
              <a className="login-link">Forgot password?</a>
            ) : null}
            {this.state.page === "signup" ? (
              <a className="login-link" onClick={() => this.backHandler()}>
                back
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
