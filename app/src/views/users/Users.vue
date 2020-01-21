<template>
  <CRow>
    <CCol col="12" xl="12">
      <transition name="slide">
        <CCard>
          <CCardHeader>
            Users
          </CCardHeader>
          <CCardBody>
            <CDataTable
              hover
              striped
              :items="items"
              :fields="fields"
              :items-per-page="perPage"
              @row-clicked="rowClicked"
              :pagination="$options.paginationProps"
              index-column
              clickable-rows
            >
              <template #username="data">
                <td>
                  <strong>{{data.item.username}}</strong>
                </td>
              </template>

              <template #is_active="data">
                <td>
                  <CBadge :color="getBadge(data.item.is_active)">
                    {{data.item.is_active}}
                  </CBadge>
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </transition>
    </CCol>
  </CRow>
</template>

<script>
import api from '../../api'
export default {
  name: 'Users',
  data: () => {
    return {
      items: [],
      fields: [
        { key: 'username' },
        { key: 'first_name' },
        { key: 'last_name' },
        { key: 'user_id' },
        { key: 'group_name', label: 'Role' },
        { key: 'is_active' }
      ],
      perPage: 10,
    }
  },
  paginationProps: {
    align: 'center',
    doubleArrows: false,
    previousButtonHtml: 'prev',
    nextButtonHtml: 'next'
  },
  mounted () {
    api.read_users({})
      .then(res => {
        if (res.data.error === false) {
          this.items = res.data.message;
        } else {
          this.items = [];
        }
      })
      .catch(err => {
        if (err) {
          this.items = [];
        }
      })
  },
  methods: {
    getBadge (is_active) {
      return is_active === true ? 'success' : 'danger'
    },
    userLink (id) {
      return `users/${id.toString()}`
    },
    rowClicked (item, index) {
      const userLink = this.userLink(item.user_id)
      this.$router.push({path: userLink})
    }
  }
}
</script>
