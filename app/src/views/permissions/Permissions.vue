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
        { key: 'permission_id' },
        { key: 'permission_name' },
        { key: 'api_endpoint' },
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
    api.read_permissions({})
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
}
</script>
