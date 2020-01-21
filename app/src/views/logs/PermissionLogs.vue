<template>
  <CRow>
    <CCol col="12" xl="12">
      <transition name="slide">
        <CCard>
          <CCardHeader>
            Permission Logs
          </CCardHeader>
          <CCardBody>
            <CDataTable
              hover
              striped
              :items="items"
              :fields="fields"
              :items-per-page="perPage"
              :pagination="$options.paginationProps"
              index-column
              clickable-rows
            >
              <template #username="data">
                <td>
                  <strong>{{data.item.username}}</strong>
                </td>
              </template>

              <template #status="data">
                <td>
                  <CBadge :color="getBadge(data.item.status)">
                    {{data.item.status}}
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
  name: 'PermissionLogs',
  data: () => {
    return {
      items: [],
      fields: [
        { key: 'permission_id' },
        { key: 'permission_name' },
        { key: 'api_endpoint' },
        { key: 'crud_operation' },
        { key: 'action_time' }
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
    api.read_permission_log({})
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
    getBadge (status) {
      return status === 'Active' ? 'success'
        : status === 'Inactive' ? 'secondary'
          : status === 'Pending' ? 'warning'
            : status === 'Banned' ? 'danger' : 'primary'
    },
  }
}
</script>
