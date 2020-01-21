<template>
  <CRow>
    <CCol col="12" lg="12">
      <CCard>
        <CCardHeader>
          <strong>Add New Group</strong>
        </CCardHeader>
        <CCardBody>
          <b-alert v-model="errorAlert" variant="danger" dismissible>
            Group could not been created!
          </b-alert>
          <b-alert v-model="successAlert" variant="success" dismissible>
            Group has been created!
          </b-alert>
          <form id="createForm" @submit.prevent="create">
            <div class="form-group text-light">
              <label class="control-label text-muted">Group Name</label>
              <div>
                <input class="form-control text-dark" type="text" v-model="group_name">
              </div>
            </div>
          </form>
          <div>
            <label class="control-label text-muted">Group Permissions</label>
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
          <CButton type="submit" form="createForm" color="primary" class="px-4">Create</CButton>
          <CButton color="primary" @click="goBack">Back</CButton>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { VueListPicker } from 'vue-list-picker'
import api from '../../api'
export default {
  name: 'AddGroup',
  components: {
    VueListPicker
  },
  data () {
      return {
        group_name: '',
        successAlert: false,
        errorAlert: false,
        availablePermissions: [],
        selectedPermissions: [],
        reset: [],
        fontsize: 30,
        errorAlert: false,
        successAlert: false
      }
  },
  mounted () {
    let groups = []
    api.read_permissions({
    })
      .then(res => {
        if (res.data.error !== true) {
          res.data.message.forEach(permission => {
            if (this.selectedPermissions.filter(p => p.permission_id === permission.permission_id).length <= 0) {
              this.availablePermissions.push(permission)
            }
          })
          this.reset = this.availablePermissions.slice()
        }
      })
      .catch(err => {
        if (err) {
          console.log(err)
        }
      })
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },

    create () {
      if (this.group_name !== '' ){
        api.create_group({
          group_name: this.group_name,
          group_permissions: this.selectedPermissions
        })
          .then(res => {
            if (res.data.error !== true ){
              this.errorAlert = false
              this.successAlert = true
            } else {
              this.errorAlert = true
              this.successAlert = false
            }
          })
          .catch(err => {
            if (err) {
              this.errorAlert = true
              this.successAlert = false
            }
          })

        this.group_name = ''
        this.selectedPermissions = []
        this.availablePermissions = this.reset.slice()
        document.documentElement.scrollTop = 0;
      } else {
        this.errorAlert = true
        this.successAlert = false
        document.documentElement.scrollTop = 0;
      }
    },
  }
}
</script>
