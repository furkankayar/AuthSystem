<template>
  <CRow>
    <CCol md="12">
      <CCard>
        <CCardHeader>
          <strong>Group id:</strong> {{ $route.params.id }}
        </CCardHeader>
        <CCardBody>
          <!--<CDataTable
            striped
            small
            fixed
            @row-clicked="rowClicked"
            :items="this.userData"
            :fields="$options.fields"
          />-->
          <b-alert v-model="errorAlert" variant="danger" dismissible>
            {{ this.errorMessage }}
          </b-alert>
          <b-alert v-model="successAlert" variant="success" dismissible>
            {{ this.successMessage }}
          </b-alert>
          <form id="updateForm" @submit.prevent="update">
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
          <CButton type="submit" form="updateForm" color="primary" class="px-4">Update</CButton>
          <CButton color="danger" @click="destroy">Delete</CButton>
          <CButton color="primary" @click="goBack">Back</CButton>
          <CModal
            title="Warning"
            color="danger"
            :show.sync="dangerModal"
            >
            You are about to delete a group! Are you sure?
            <template #footer>
              <CButton @click="discardDestroy" color="primary">Cancel</CButton>
              <CButton @click="acceptDestroy" color="danger">Delete</CButton>
            </template>
          </CModal>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { VueListPicker } from 'vue-list-picker'
import api from '../../api'
export default {
  name: 'Group',
  components: {
    VueListPicker
  },
  data () {
      return {
        group_id: '',
        group_name: '',
        successAlert: false,
        errorAlert: false,
        availablePermissions: [],
        selectedPermissions: [],
        fontsize: 30,
        errorAlert: false,
        successAlert: false,
        errorMessage: 'Group could not been updated',
        successMessage: 'Group has been updated',
        dangerModal: false
      }
  },
  mounted () {
    let groups = []
    api.read_groups({})
      .then(res => {
        if (res.data.error !== true) {
          groups =  res.data.message
          groups.forEach(group => {
            if (group.group_id == this.$route.params.id) {
                this.group_id = group.group_id
                this.group_name = group.group_name
            }
          })
        }
      })
      .catch(err => {
        if (err) {
          this.group_id = ''
          this.group_name = ''
        }
      })

    api.read_group_permissions({
      group_id: this.$route.params.id
    })
      .then(res => {
        if (res.data.error !== true) {
          res.data.message.group_permission.forEach(permission => {
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
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    update () {
      api.update_group_permissions({
        group_id: this.group_id,
        group_permission: this.selectedPermissions,
        group_name: this.group_name
      })
        .then(res => {
          if (res.data.error !== true ){
            this.errorAlert = false
            this.successMessage = res.data.message
            this.successAlert = true
          } else {
            this.errorMessage = res.data.message
            this.errorAlert = true
            this.successAlert = false
          }
        })
        .catch(err => {
          if (err) {
            this.errorMessage = 'Group could not been updated'
            this.errorAlert = true
            this.successAlert = false
          }
        })
      document.documentElement.scrollTop = 0;
    },
    destroy () {
      this.dangerModal = true
    },
    discardDestroy () {
      this.dangerModal = false
    },
    acceptDestroy () {
      this.dangerModal = false
      api.delete_group({
        group_id: this.group_id
      })
        .then(res => {
          if (res.data.error !== true) {
           this.$router.go(-1)
          } else {
            this.errorMessage = res.data.message
            this.errorAlert = true
            this.successAlert = false
            document.documentElement.scrollTop = 0;
          }
        })
        .catch(err => {
          this.errorMessage = 'Group could not been deleted'
          this.errorAlert = true
          this.successAlert = false
          document.documentElement.scrollTop = 0;
        })
    }
  }
}
</script>
