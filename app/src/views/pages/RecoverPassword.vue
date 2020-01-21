<template>
  <div class="bg">
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="6" sm="8">

          <CCard class="p-4 panel">
            <CCardBody>
              <h1 class="text-white">Recover Password</h1>
              <p class="text-white">Create new password</p>
              <b-alert v-model="errorAlert" variant="danger" dismissible>
            Password could not been changed!
          </b-alert>
          <b-alert v-model="successAlert" variant="success" dismissible>
            Password changed successfully!
          </b-alert>
  				<form @submit.prevent="recover">
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
  							<span class="input-group-text"><CIcon name="cil-lock-locked"/></span>
  						</div>
              <input placeholder="Confirm Password" @input="setConfirmPasswordTyped" type="password" v-model="user.confirmPassword" id="confirmPassword" name="confirmPassword" class="form-control" :class="{ 'is-invalid': (confirmPasswordTyped)  && $v.user.confirmPassword.$error }" />
              <div v-if="(confirmPasswordTyped) && $v.user.confirmPassword.$error" class="invalid-feedback text-danger">
                  <span v-if="!$v.user.confirmPassword.required">Confirm Password is required</span>
                  <span v-else-if="!$v.user.confirmPassword.sameAsPassword">Passwords must match</span>
              </div>
            </div>
  					<div class="form-group">
              <CButton type="submit" color="primary" class="px-4">Submit</CButton>
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
  import { required, minLength, sameAs } from 'vuelidate/lib/validators'

  export default {
    name: 'RecoverPassword',
    data () {
      return {
        user: {
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        },
        errorAlert: false,
        successAlert: false,
        passwordTyped: false,
        confirmPasswordTyped: false
      }
    },
    validations: {
      user: {
        password: { required, minLength: minLength(6) },
        confirmPassword: { required, sameAsPassword: sameAs('password') }
      }
    },
    methods: {
      recover: function (event) {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          api.set_new_password({
            token: this.$route.params.token,
            password: this.user.password
          })
            .then(res => {
              if (res.data.error !== true) {
                this.$v.$reset()
                this.user.password = ''
                this.user.confirmPassword = ''
                this.successAlert = true
                this.errorAlert = false
              } else {
                this.successAlert = false
                this.errorAlert = true
              }
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
