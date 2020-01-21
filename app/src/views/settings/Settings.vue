<template>
  <CRow>
    <CCol md="2"/>
    <CCol md="8">
      <div class="d-flex justify-content-center h-100">
      <div class="w-100 card">
        <br>
        <div class="card-header bg-white">
          <h3>Settings</h3>
        </div>
        <div class="card-body">
          <b-alert v-model="errorAlert" variant="danger" dismissible>
            Personal info could not been updated!
          </b-alert>
          <b-alert v-model="successAlert" variant="success" dismissible>
            Personal info has been updated!
          </b-alert>
          <form @submit.prevent="update">
            <div class="form-group">
              <label class="control-label text-muted">First name</label>
              <div>
                <input class="form-control text-dark" placeholder="First Name" v-model="first_name" type="text">
              </div>
            </div>
            <div class="form-group text-light">
              <label class="control-label text-muted">Last name</label>
              <div>
                <input class="form-control text-dark" type="text" placeholder="Last Name" v-model="last_name">
              </div>
            </div>
            <div class="form-group text-light">
              <label class="control-label text-muted">Birthdate</label>
              <div>
                <date-picker class="form-control text-dark" @dp-change="dateChange" :config="options" placeholder="1969-12-31" v-model="birthdate"></date-picker>
              </div>
            </div>
            <div class="form-group text-light">
              <label class="control-label text-muted">Address</label>
              <textarea class="form-control text-dark" rows="3" placeholder="Address" v-model="address"></textarea>
            </div>
            <div class="form-group text-light">
              <label class="control-label text-muted">Mobile</label>
              <div>
                <input class="form-control text-dark" type="tel" placeholder="555-555-5555" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" v-model="mobile">
              </div>
            </div>
            <div class="form-group text-light">
              <label class="control-label text-muted">Email</label>
              <div>
                <input @change="setEmailChanged" class="form-control text-dark" type="text" v-model="email" :class="{ 'is-invalid': (emailChanged) && ($v.email.$error || !emailAvailable) }">
                <div v-if="(emailChanged) && ($v.email.$error || !emailAvailable)" class="invalid-feedback text-danger">
                    <span v-if="!$v.email.email">Email is invalid</span>
                    <span v-if="!emailAvailable">Email is already registered</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label text-muted">New Password</label>
              <input placeholder="Password" @input="setPasswordTyped" type="password" v-model="password" id="password" name="password" class="form-control" :class="{ 'is-invalid': (passwordTyped) && $v.password.$error }" />
              <div v-if="(passwordTyped)  && $v.password.$error" class="invalid-feedback text-danger">
                  <span v-if="!$v.password.required">Password is required</span>
                  <span v-if="!$v.password.minLength">Password has to be at least 6 characters</span>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label text-muted">New Password Confirm</label>
              <input placeholder="Confirm Password" @input="setConfirmPasswordTyped" type="password" v-model="confirmPassword" id="confirmPassword" name="confirmPassword" class="form-control" :class="{ 'is-invalid': (confirmPasswordTyped)  && $v.confirmPassword.$error }" />
              <div v-if="(confirmPasswordTyped) && $v.confirmPassword.$error" class="invalid-feedback text-danger">
                  <span v-if="!$v.confirmPassword.required">Confirm Password is required</span>
                  <span v-else-if="!$v.confirmPassword.sameAsPassword">Passwords must match</span>
              </div>
            </div>
            <div class="form-group">
              <CButton type="submit" color="primary" class="px-4">Update</CButton>
            </div>
          </form>
        </div>
      </div>
    </div>
    </CCol>
  </CRow>
</template>

<script>
import datePicker from 'vue-bootstrap-datetimepicker'
import api from '../../api'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'Profile',
  components: {
    datePicker
  },
  mounted () {
    api.get_account(null)
      .then(res => {
        if (res.status === 200) {
          this.username = res.data.username
          this.email = res.data.email
          this.first_name = res.data.first_name
          this.last_name = res.data.last_name
          this.birthdate = res.data.birthdate
          this.mobile = res.data.mobile
          this.address = res.data.address
          this.constant_email = res.data.email
        }
      })
      .catch(err => {
        if (err) {
          console.log(err)
        }
      })
  },
  data () {
    return {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      birthdate: '',
      mobile: '',
      address: '',
      password: '',
      confirmPassword: '',
      options: {
        format: 'YYYY-MM-DD',
        useCurrent: false
      },
      emailChanged: false,
      emailAvailable: true,
      passwordTyped: false,
      confirmPasswordTyped: false,
      successAlert: false,
      errorAlert: false
    }
  },
  validations: {
    email: { email },
    password: { minLength: minLength(6) },
    confirmPassword: { sameAsPassword: sameAs('password') }
  },
  methods: {
    update () {
      this.$v.$touch()
      if (!this.$v.$invalid && this.emailAvailable) {
        api.update_personal_info({
          first_name: this.first_name,
          last_name: this.last_name,
          birthdate: this.birthdate,
          address: this.address,
          mobile: this.mobile,
          email: this.email,
          password: this.password,
        })
          .then(res => {
            this.successAlert = true
            this.errorAlert = false
          })
          .catch(err => {
            if (err) {
              this.successAlert = false
              this.errorAlert = true
            }
          })
      }
    },
    dateChange (event) {
      this.birthdate = event.currentTarget.value
    },
    setEmailChanged (event) {
      if (this.email !== this.constant_email) {
        api.check_email({
          email: this.email
        })
          .then(res => {
            if (res.data.error === false) {
              this.emailAvailable = true
            } else {
              this.emailAvailable = false
            }
            this.emailChanged = true
          })
      } else {
        this.emailAvailable = true
      }
    },
    setPasswordTyped: function (event) {
      this.passwordTyped = true
      this.$v.password.$touch()
    },
    setConfirmPasswordTyped: function (event) {
      this.confirmPasswordTyped = true
      this.$v.confirmPassword.$touch()
    }
  }
}
</script>
