<template>
  <div class="bg">
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="6" sm="8">

          <CCard class="p-4 panel">
            <CCardBody>
              <h1 class="text-white">Login</h1>
              <p class="text-white">Sign In to your account</p>
              <b-alert v-model="errorAlert" variant="danger" dismissible>
            Invalid username or password!
          </b-alert>
  				<form @submit.prevent="login">
  					<div class="input-group form-group">
  						<div class="input-group-prepend">
  							<span class="input-group-text"><CIcon name="cil-user"/></span>
  						</div>
              <input label="Username" placeholder="Username" type="text" v-model="user.username" id="username" name="username" class="form-control" :class="{ 'is-invalid': $v.user.username.$error}" />
              <div v-if="$v.user.username.$error" class="invalid-feedback">
                <span v-if="!$v.user.username.required">Username is required</span>
                <span v-if="!$v.user.username.minLength">Username must be at least 8 characters</span>
              </div>
  					</div>
  					<div class="input-group form-group">
  						<div class="input-group-prepend">
  							<span class="input-group-text"><CIcon name="cil-lock-locked"/></span>
  						</div>
              <input placeholder="Password" type="password" v-model="user.password" id="password" name="password" class="form-control" :class="{ 'is-invalid': $v.user.password.$error }" />
              <div v-if="$v.user.password.$error" class="invalid-feedback">                 <span v-if="!$v.user.password.required">Password is required</span>
                <span v-if="!$v.user.password.minLength">Password must be at least 6 characters</span>
             </div>
            </div>
  					<div class="form-group">
  						<CButton type="submit" color="primary" class="px-4">Login</CButton>
  					</div>
  				</form>
            </CCardBody>
            <div class="card-footer panel">
  				        <div class="d-flex justify-content-center links text-white">
  					             Don't have an account? <a href="/#/pages/register">Sign Up</a>
  				        </div>
  				       <div class="d-flex justify-content-center">
  					            <a href="/#/pages/reset_password">Forgot your password?</a>
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
  import VueCookie from 'vue-cookie'
  export default {
    name: 'Login',
    data () {
      return {
        user: {
          username: '',
          password: ''
        },
        errorAlert: false
      }
    },
    validations: {
      user: {
        username: { required, minLength: minLength(8) },
        email: { required, email },
        password: { required, minLength: minLength(6) },
        confirmPassword: { required, sameAsPassword: sameAs('password') }
      }
    },
    methods: {
      login: function (event) {
        api.login({
          username: this.user.username,
          password: this.user.password
        })
          .then(res => {
            VueCookie.set('access_token', res.data.access_token, 1)
            this.activeUser.username = this.user.username
            this.$router.push('/dashboard')
          })
          .catch(err => {
            if (err) {
              this.errorAlert = true
            }
          })
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
