<template>
<div class="bg">
  <CContainer class="min-vh-100 d-flex align-items-center">
    <CRow class="w-100 justify-content-center">
      <CCol md="6" sm="8">
        <CCard class="p-4 panel">
          <CCardBody>
            <h1 class="text-white">Register</h1>
            <p class="text-white">Create your account</p>
          <b-alert v-model="errorAlert" variant="danger" dismissible>
            Registration failed!
          </b-alert>
          <b-alert v-model="successAlert" variant="success" dismissible>
            Registration successful!
          </b-alert>
  				<form @submit.prevent="register">
  					<div class="input-group form-group">
  						<div class="input-group-prepend">
  							<span class="input-group-text"><CIcon name="cil-user"/></i></span>
  						</div>
              <input placeholder="Username" @input="setUsernameTyped" label="Username" type="text" v-model="user.username" id="username" name="username" class="form-control" :class="{ 'is-invalid': (usernameTyped) && ($v.user.username.$error || !usernameAvailable || usernameContainsWhitespace)}" />
              <div v-if="(usernameTyped) && ($v.user.username.$error || !usernameAvailable || usernameContainsWhitespace)" class="invalid-feedback text-danger">
                <span v-if="!$v.user.username.required">Username is required</span>
                <span v-if="!$v.user.username.minLength">Username must be at least 8 characters</span>
                <span v-if="!usernameAvailable">User is already exists</span>
                <span v-if="usernameContainsWhitespace">Username contains unexpected characters</span>
              </div>
  					</div>
            <div class="input-group form-group">
  						<div class="input-group-prepend">
  							<span class="input-group-text">@</span>
  						</div>
              <input placeholder="Email" @change="setEmailChanged" type="text" v-model="user.email" id="email" name="email" class="form-control" :class="{ 'is-invalid': (emailChanged) && ($v.user.email.$error || !emailAvailable) }" />
              <div v-if="(emailChanged) && ($v.user.email.$error || !emailAvailable)" class="invalid-feedback text-danger">
                  <span v-if="!$v.user.email.required">Email is required</span>
                  <span v-if="!$v.user.email.email">Email is invalid</span>
                  <span v-if="!emailAvailable">Email is already registered</span>
              </div>
  					</div>
  					<div class="input-group form-group">
  						<div class="input-group-prepend">
  							<span class="input-group-text"><CIcon name="cil-lock-locked"/></span>
  						</div>
              <input placeholder="Password" @input="setPasswordTyped" type="password" v-model="user.password" id="password" name="password" class="form-control" :class="{ 'is-invalid': (passwordTyped) && $v.user.password.$error }" />
              <div v-if="(passwordTyped)  && $v.user.password.$error" class="invalid-feedback text-danger">
                  <span v-if="!$v.user.password.required">Password is required</span>
                  <span v-if="!$v.user.password.minLength">Password has to be at least 6 characters</span>
              </div>
            </div>
            <div class="input-group form-group">
  						<div class="input-group-prepend">
  							<span class="input-group-text"><CIcon name="cil-lock-locked"/></i></span>
  						</div>
              <input placeholder="Confirm Password" @input="setConfirmPasswordTyped" type="password" v-model="user.confirmPassword" id="confirmPassword" name="confirmPassword" class="form-control" :class="{ 'is-invalid': (confirmPasswordTyped)  && $v.user.confirmPassword.$error }" />
              <div v-if="(confirmPasswordTyped) && $v.user.confirmPassword.$error" class="invalid-feedback text-danger">
                  <span v-if="!$v.user.confirmPassword.required">Confirm Password is required</span>
                  <span v-else-if="!$v.user.confirmPassword.sameAsPassword">Passwords must match</span>
              </div>
            </div>
  					<div class="form-group">
  						<CButton type="submit" color="primary" class="px-4">Register</CButton>
  					</div>
  				</form>
      </CCardBody>
      <div class="card-footer panel">
  				<div class="d-flex justify-content-center links text-white">
  					Have an account?<a href="/#/pages/login">Sign In</a>
  				</div>
  			</div>
        </CCard>

      </CCol>
    </CRow>
  </CContainer>
</div>
</template>

<script>
  import api from '../../api'
  import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

  function validateUsername () {
    if (this.user.username !== '') {
      this.usernameContainsWhitespace = !this.re.test(this.user.username)
      return !this.usernameContainsWhitespace
    } else {
      this.usernameContainsWhitespace = false
    }
    return false
  }

  export default {
    name: 'Register',
    data () {
      return {
        user: {
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        },
        usernameTyped: false,
        usernameAvailable: false,
        usernameContainsWhitespace: false,
        emailChanged: false,
        emailAvailable: false,
        passwordTyped: false,
        confirmPasswordTyped: false,
        errorAlert: false,
        successAlert: false,
        re: /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/
      }
    },
    validations: {
      user: {
        username: { required, validateUsername, minLength: minLength(8) },
        email: { required, email },
        password: { required, minLength: minLength(6) },
        confirmPassword: { required, sameAsPassword: sameAs('password') }
      }
    },
    methods: {
      register: function (event) {
        if (this.handleSubmit(event)) {
          api.register({
            username: this.user.username,
            email: this.user.email,
            password: this.user.password
          })
            .then(res => {
              this.$v.$reset()
              this.usernameAvailable = false
              this.emailAvailable = false
              this.usernameContainsWhitespace = false
              this.usernameTyped = false
              this.emailChanged = false
              this.passwordTyped = false
              this.confirmPasswordTyped = false
              this.user.username = ''
              this.user.email = ''
              this.user.password = ''
              this.user.confirmPassword = ''
              this.successAlert = true
              this.errorAlert = false
            })
            .catch(err => {
              if (err) {
                this.successAlert = false
                this.errorAlert = true
              }
            })
        } else {
          this.successAlert = false
          this.errorAlert = true
        }
      },
      handleSubmit: function (event) {
        this.$v.$touch()
        if (this.$v.$invalid || !this.usernameAvailable || !this.emailAvailable || this.usernameContainsWhitespace) {
          return false
        }
        return true
      },
      setUsernameTyped: function (event) {
        api.check_username({
          username: this.user.username
        })
          .then(res => {
            if (res.data.error === false) {
              this.usernameAvailable = true
            } else {
              this.usernameAvailable = false
            }
            this.usernameTyped = true
            this.$v.user.username.$touch()
          })
      },
      setEmailChanged: function (event) {
        api.check_email({
          email: this.user.email
        })
          .then(res => {
            if (res.data.error === false) {
              this.emailAvailable = true
            } else {
              this.emailAvailable = false
            }
            this.emailChanged = true
            this.$v.user.email.$touch()
          })
      },
      setPasswordTyped: function (event) {
        this.passwordTyped = true
        this.$v.user.password.$touch()
      },
      setConfirmPasswordTyped: function (event) {
        this.confirmPasswordTyped = true
        this.$v.user.confirmPassword.$touch()
      }
    }
  }
</script>

<style>
.bg {
  background-image: url('../../../public/img/bg.jpg');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #464646;
}

.panel {
  background: rgba(0, 0, 0, 0.6)!important;
}
</style>
