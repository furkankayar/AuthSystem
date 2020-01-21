<template>
  <CRow>
    <CCol md="12">
      <CCard>
        <CCardHeader>
          <strong>User id:</strong> {{ $route.params.id }}, <strong>Username:</strong> {{ this.username }}
        </CCardHeader>
        <CCardBody>
          <b-alert v-model="errorAlert" variant="danger" dismissible>
            User could not been updated!
          </b-alert>
          <b-alert v-model="successAlert" variant="success" dismissible>
            User has been updated!
          </b-alert>
          <form id="updateForm" @submit.prevent="update">
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
              <label class="control-label text-muted">Password Key</label>
              <div>
                <input placeholder="Password Key" type="text" v-model="password_key" class="form-control text-dark" />
              </div>
            </div>
            <div class="form-group">
              <CRow>
                <CCol sm="6">
                  <label class="control-label text-muted">Is Active</label>
                  <b-form-select v-model="is_active" :options="[{value: true, text:'True'}, {value:false, text:'False'}]"/>
                </CCol>
                <CCol sm="6">
                  <label class="control-label text-muted">Role</label>
                  <b-form-select v-on:change="groupChanged" v-model="group_name" :options="userGroups"/>
                </CCol>
              </CRow>
            </div>
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
          </form>
          <div>
            <label class="control-label text-muted">User Permissions</label>
            <vue-list-picker
              v-bind:title-substr="30"
              :left-items="availablePermissions"
              :right-items="selectedPermissions"
              title-left="Permissions Available"
              title-right="Permissions Selected"
              button-class="btn btn-primary btn-sm"
              content-key="permission_id"
              content-attr="permission_name"
              v-bind:content-substr="50"
            />
          </div>
        </CCardBody>
        <CCardFooter>
          <CButton type="submit" form="updateForm" color="primary" class="px-4">Update</CButton>
          <CButton color="primary" @click="goBack">Back</CButton>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import datePicker from 'vue-bootstrap-datetimepicker'
import { VueListPicker } from 'vue-list-picker'
import api from '../../api'
import { email } from 'vuelidate/lib/validators'
export default {
  name: 'User',
  components: {
    datePicker,
    VueListPicker
  },
  data () {
      return {
        username: '',
        email: '',
        password_key: '',
        is_active: false,
        user_id: -1,
        first_name: '',
        last_name: '',
        birthdate: '',
        mobile: '',
        address: '',
        group_name: '',
        options: {
          format: 'YYYY-MM-DD',
          useCurrent: false
        },
        userGroups: [],
        availablePermissions: [],
        selectedPermissions: [],
        fontsize: 30,
        emailChanged: false,
        emailAvailable: true,
        successAlert: false,
        errorAlert: false
      }
  },
  mounted () {
    let user = null
    api.read_user({
      'user_id': this.$route.params.id
    })
      .then(res => {
        if (res.data.error !== true) {
          user = res.data.message
          this.username = user.username
          this.email = user.email
          this.password_key = user.password_key
          this.is_active = user.is_active
          this.user_id = user.user_id
          this.first_name = user.first_name
          this.last_name = user.last_name
          this.birthdate = user.birthdate
          this.mobile = user.mobile
          this.address = user.address
          this.group_name = user.group_name
        } else {
          user = null
        }
      })
      .catch(err => {
        if (err) {
          user = null
        }
      })

    let groups = []
    api.read_groups({})
      .then(res => {
        if (res.data.error !== true) {
          groups =  res.data.message
          groups.forEach(group => {
            this.userGroups.push(group.group_name)
          })
        }
      })
      .catch(err => {
        if (err) {
          this.userGroups = []
        }
      })

      api.read_user_permissions({
        user_id: this.$route.params.id
      })
        .then(res => {
          if (res.data.error !== true) {
            res.data.message.user_permission.forEach(permission => {
              if (permission.permission_id !== null) {
                this.selectedPermissions.push(permission)
              }
            })
            res.data.message.all_permissions.forEach(permission => {
              if (this.selectedPermissions.filter(p => p.permission_id === permission.permission_id).length <= 0) {
                this.availablePermissions.push(permission)
              }
            })
          }
        })
        .catch(err => {
          if (err) {
            console.log(err)
          }
        })
  },
  validations: {
    email: { email }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    update () {
      this.$v.$touch()
      if (!this.$v.$invalid && this.emailAvailable) {
        api.update_user({
          username: this.username,
          email: this.email,
          password_key: this.password_key,
          is_active: this.is_active,
          birthdate: this.birthdate,
          first_name: this.first_name,
          last_name: this.last_name,
          birthdate: this.birthdate,
          mobile: this.mobile,
          address: this.address,
          group_name: this.group_name,
          user_id: this.$route.params.id,
          user_permission: this.selectedPermissions
        })
          .then(res => {
            if (res.data.error !== true) {
              this.successAlert = true
              this.errorAlert = false
            } else {
              this.successAlert = false
              this.errorAlert = true
            }
          })
          .catch(err => {
            console.log(err)
            if (err) {
              this.successAlert = false
              this.errorAlert = true
            }
          })
      } else {
        this.successAlert = false
        this.errorAlert = true
      }
      document.documentElement.scrollTop = 0;
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
    groupChanged (event) {

      api.update_user_group({
        username: this.username,
        group_name: this.group_name,
      })
        .then(res => {
          this.successAlert = true
          this.errorAlert = false
          this.selectedPermissions = []
          this.availablePermissions = []
          api.read_user_permissions({
            user_id: this.$route.params.id
          })
            .then(res => {
              if (res.data.error !== true) {
                res.data.message.user_permission.forEach(permission => {
                  if (permission.permission_id !== null) {
                    this.selectedPermissions.push(permission)
                  }
                })
                res.data.message.all_permissions.forEach(permission => {
                  if (this.selectedPermissions.filter(p => p.permission_id === permission.permission_id).length <= 0) {
                    this.availablePermissions.push(permission)
                  }
                })
              }
            })
            .catch(err => {
              if (err) {
                console.log(err)
              }
            })
        })
        .catch(err => {
        })


    }
  }
}
</script>
