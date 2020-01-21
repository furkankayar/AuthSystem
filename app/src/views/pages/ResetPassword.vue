<template>
  <div class="bg">
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="6" sm="8">

          <CCard class="p-4 panel">
            <CCardBody>
              <h1 class="text-white">Send Recovery Email</h1>
              <p class="text-white">Rescue your account</p>
              <b-alert v-model="errorAlert" variant="danger" dismissible>
            Email could not been sent!
          </b-alert>
          <b-alert v-model="successAlert" variant="success" dismissible>
            Email has been sent successfully!
          </b-alert>
  				<form @submit.prevent="send">
  					<div class="input-group form-group">
  						<div class="input-group-prepend">
  							<span class="input-group-text">@</span>
  						</div>
              <input label="Email" placeholder="Email" type="text" v-model="user.email" id="email" name="email" class="form-control" :class="{ 'is-invalid': $v.user.email.$error}" />
              <div v-if="$v.user.email.$error" class="invalid-feedback text-danger">
                  <span v-if="!$v.user.email.required">Email is required</span>
                  <span v-if="!$v.user.email.email">Email is invalid</span>
              </div>
  					</div>
  					<div class="form-group">
              <CButton id="sendButton" type="submit" color="primary" class="px-4">Send</CButton>
            </div>
  				</form>
            </CCardBody>
            <div class="card-footer panel">
              <div class="d-flex justify-content-center text-white">
                <a href="/#/pages/login">Remembered your password?</a>
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
  import { required, email } from 'vuelidate/lib/validators'
  //  import VueCookie from 'vue-cookie'
  //  import { EventBus } from '../event-bus'
  export default {
    name: 'ResetPassword',
    data () {
      return {
        user: {
          email: ''
        },
        formError: '',
        errorAlert: false,
        successAlert: false
      }
    },
    validations: {
      user: {
        email: { required, email }
      }
    },
    methods: {
      send () {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          document.getElementById('sendButton').disabled = true
          api.reset_password({
            email: this.user.email
          })
            .then(res => {
              this.$v.$reset()
              this.user.email = ''
              if (res.data.error === false) {
                this.successAlert = true
                this.errorAlert = false
                document.getElementById('sendButton').disabled = false
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
